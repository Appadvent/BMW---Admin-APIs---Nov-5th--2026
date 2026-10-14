import prisma from "../config/db.config";

export interface BannerInput {
  bgMediaType?: string;
  bgMedia: string;
  label?: string | null;
  heading: string;
  description?: string | null;
  textAlignment?: string;
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  secondaryBtnLink?: string | null;
  sideImage?: string | null;
  sideImagePosition?: string | null;
  sequence?: number;
  isActive?: boolean;
}

export class BannerDao {
  private static get bannerModel() {
    return (prisma as any).banner;
  }

  /**
   * Enforces that at most 3 banners can remain active simultaneously.
   * If activeCount >= 3, automatically deactivates the active banner with the lowest sequence / oldest update.
   */
  private static async enforceActiveLimit(currentBannerId?: number) {
    const whereClause: any = { isActive: true };
    if (currentBannerId) {
      whereClause.NOT = { id: currentBannerId };
    }

    const activeCount = await this.bannerModel.count({ where: whereClause });
    if (activeCount >= 3) {
      // Find the banner to deactivate
      const bannerToDeactivate = await this.bannerModel.findFirst({
        where: whereClause,
        orderBy: [{ sequence: "asc" }, { updatedAt: "asc" }],
      });

      if (bannerToDeactivate) {
        await this.bannerModel.update({
          where: { id: bannerToDeactivate.id },
          data: { isActive: false },
        });
      }
    }
  }

  /**
   * Public storefront query: returns active banners (max 3) ordered by sequence ASC.
   */
  static async getActiveBanners() {
    return await this.bannerModel.findMany({
      where: { isActive: true },
      orderBy: { sequence: "asc" },
      take: 3,
    });
  }

  /**
   * Admin query: returns all banners with pagination, search, and ordering.
   */
  static async getBannersAdmin({
    page = 1,
    limit = 10,
    search,
    isActive,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  } = {}) {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { heading: { contains: q, mode: "insensitive" } },
        { label: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, banners, activeCount] = await Promise.all([
      this.bannerModel.count({ where }),
      this.bannerModel.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ sequence: "asc" }, { createdAt: "desc" }],
      }),
      this.bannerModel.count({ where: { isActive: true } }),
    ]);

    return {
      banners,
      activeCount,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  static async getBannerById(id: number) {
    return await this.bannerModel.findUnique({
      where: { id },
    });
  }

  static async createBanner(data: BannerInput) {
    if (data.isActive !== false) {
      await this.enforceActiveLimit();
    }

    return await this.bannerModel.create({
      data: {
        bgMediaType: data.bgMediaType || "IMAGE",
        bgMedia: data.bgMedia,
        label: data.label || null,
        heading: data.heading,
        description: data.description || null,
        textAlignment: data.textAlignment || "LEFT",
        primaryBtnText: data.primaryBtnText || null,
        primaryBtnLink: data.primaryBtnLink || null,
        secondaryBtnText: data.secondaryBtnText || null,
        secondaryBtnLink: data.secondaryBtnLink || null,
        sideImage: data.sideImage || null,
        sideImagePosition: data.sideImagePosition || "RIGHT",
        sequence: data.sequence ?? 1,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateBanner(id: number, data: Partial<BannerInput>) {
    if (data.isActive === true) {
      await this.enforceActiveLimit(id);
    }

    return await this.bannerModel.update({
      where: { id },
      data,
    });
  }

  static async toggleStatus(id: number) {
    const current = await this.getBannerById(id);
    if (!current) throw new Error("Banner not found");

    const newStatus = !current.isActive;
    if (newStatus === true) {
      await this.enforceActiveLimit(id);
    }

    return await this.bannerModel.update({
      where: { id },
      data: { isActive: newStatus },
    });
  }

  static async deleteBanner(id: number) {
    return await this.bannerModel.delete({
      where: { id },
    });
  }
}
