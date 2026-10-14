import prisma from "../config/db.config";

export const ProductDao = {
  createProduct: async (data: {
    title: string;
    description: string;
    image?: string | null;
    brochure?: string | null;
    tag?: string | null;
    oemNumber?: string | null;
    make?: string | null;
    model?: string | null;
    yearRange?: string | null;
    position?: string | null;
    condition?: string | null;
    categoryId?: number | null;
    subcategoryId?: number | null;
    specifications?: Array<{ name: string; value: string; order?: number }>;
  }) => {
    try {
      const { specifications, ...productData } = data;
      return await (prisma.product as any).create({
        data: {
          ...productData,
          ...(specifications && Array.isArray(specifications) && specifications.length > 0
            ? {
                specifications: {
                  create: specifications.map((s, idx) => ({
                    name: s.name.trim(),
                    value: s.value.trim(),
                    order: typeof s.order === "number" ? s.order : idx,
                  })),
                },
              }
            : {}),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              image: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          features: true,
          specifications: {
            orderBy: { order: "asc" },
          },
        },
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new Error("Product title already exists");
      }
      throw err;
    }
  },

  findProductByTitle: async (title: string) => {
    return await prisma.product.findFirst({
      where: { title },
    });
  },

  getAllProducts: async ({
    page = 1,
    limit = 10,
    search,
    categoryId,
    subcategoryId,
    tag,
    make,
    model,
    oemNumber,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    subcategoryId?: number;
    tag?: string;
    make?: string;
    model?: string;
    oemNumber?: string;
  } = {}) => {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { oemNumber: { contains: q, mode: "insensitive" as const } },
        { model: { contains: q, mode: "insensitive" as const } },
        { make: { contains: q, mode: "insensitive" as const } },
        { specifications: { some: { value: { contains: q, mode: "insensitive" as const } } } },
      ];
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (subcategoryId) {
      where.subcategoryId = Number(subcategoryId);
    }

    if (tag && tag.trim()) {
      where.tag = { equals: tag.trim(), mode: "insensitive" as const };
    }

    if (make && make.trim()) {
      where.make = { contains: make.trim(), mode: "insensitive" as const };
    }

    if (model && model.trim()) {
      where.model = { contains: model.trim(), mode: "insensitive" as const };
    }

    if (oemNumber && oemNumber.trim()) {
      where.oemNumber = { contains: oemNumber.trim(), mode: "insensitive" as const };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where: Object.keys(where).length ? where : undefined }),
      prisma.product.findMany({
        where: Object.keys(where).length ? where : undefined,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              image: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          features: true,
          specifications: {
            orderBy: { order: "asc" },
          },
        },
      }),
    ]);

    return {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  },

  getProductById: async (id: number) => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      return null;
    }
    return await (prisma.product as any).findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            image: true,
            categoryId: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        features: true,
        specifications: {
          orderBy: { order: "asc" },
        },
      },
    });
  },

  updateProduct: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      image?: string | null;
      brochure?: string | null;
      tag?: string | null;
      oemNumber?: string | null;
      make?: string | null;
      model?: string | null;
      yearRange?: string | null;
      position?: string | null;
      condition?: string | null;
      categoryId?: number | null;
      subcategoryId?: number | null;
      specifications?: Array<{ name: string; value: string; order?: number }>;
    }
  ) => {
    try {
      const { specifications, ...productData } = data;

      return await prisma.$transaction(async (tx: any) => {
        if (specifications !== undefined && Array.isArray(specifications)) {
          await tx.specification.deleteMany({ where: { productId: id } });
          if (specifications.length > 0) {
            await tx.specification.createMany({
              data: specifications.map((s, idx) => ({
                productId: id,
                name: s.name.trim(),
                value: s.value.trim(),
                order: typeof s.order === "number" ? s.order : idx,
              })),
            });
          }
        }

        return await tx.product.update({
          where: { id },
          data: productData,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            subcategory: {
              select: {
                id: true,
                name: true,
                image: true,
                categoryId: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            features: true,
            specifications: {
              orderBy: { order: "asc" },
            },
          },
        });
      });
    } catch (err: any) {
      console.error("Update Product Error:", err);
      return null;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      return await prisma.product.delete({ where: { id } });
    } catch {
      return null;
    }
  },
};
