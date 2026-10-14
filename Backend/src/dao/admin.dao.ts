import prisma from "../config/db.config";

export interface StatsFilterOptions {
  startDate?: string;
  endDate?: string;
  range?: string; // 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all'
}

export class AdminDAO {
  static async findAdminByEmail(email: string) {
    return await prisma.adminUser.findFirst({
      where: { email },
    });
  }

  static async createAdmin(name: string, email: string, password: string) {
    return await prisma.adminUser.create({
      data: { name, email, password },
    });
  }

  static parseDateFilter(options: StatsFilterOptions = {}) {
    const { startDate, endDate, range } = options;
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    if (range) {
      const normalizedRange = range.toLowerCase().trim();
      if (normalizedRange === "today") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      } else if (normalizedRange === "yesterday") {
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
        end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
      } else if (normalizedRange === "week" || normalizedRange === "this_week") {
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      } else if (normalizedRange === "month" || normalizedRange === "this_month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (normalizedRange === "year" || normalizedRange === "this_year") {
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      }
    }

    if (startDate) {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        start = new Date(parsedStart.getFullYear(), parsedStart.getMonth(), parsedStart.getDate(), 0, 0, 0, 0);
      }
    }

    if (endDate) {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        end = new Date(parsedEnd.getFullYear(), parsedEnd.getMonth(), parsedEnd.getDate(), 23, 59, 59, 999);
      }
    }

    if (start || end) {
      const createdAt: { gte?: Date; lte?: Date } = {};
      if (start) createdAt.gte = start;
      if (end) createdAt.lte = end;
      return { createdAt, start, end };
    }

    return { createdAt: undefined, start: undefined, end: undefined };
  }

  static async getDashboardStats(options: StatsFilterOptions = {}) {
    const { createdAt, start, end } = this.parseDateFilter(options);
    const whereCreatedAt = createdAt ? { createdAt } : undefined;

    const [
      categories,
      products,
      queries,
      blogs,
      testimonials,
      users,
      services,
      pages,
      abouts,
      recentQueries
    ] = await Promise.all([
      prisma.category.count({ where: whereCreatedAt }),
      prisma.product.count({ where: whereCreatedAt }),
      prisma.contact.count({ where: whereCreatedAt }),
      prisma.blog.count({ where: whereCreatedAt }),
      prisma.testimonial.count({ where: whereCreatedAt }),
      prisma.adminUser.count({ where: whereCreatedAt }),
      prisma.service.count({ where: whereCreatedAt }),
      prisma.pages.count({ where: whereCreatedAt }),
      prisma.about.count({ where: whereCreatedAt }),
      prisma.contact.findMany({
        where: whereCreatedAt,
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      counts: {
        categories,
        products,
        queries,
        blogs,
        testimonials,
        users,
        services,
        pages,
        abouts,
      },
      recentQueries,
      filter: {
        startDate: start ? start.toISOString() : null,
        endDate: end ? end.toISOString() : null,
        range: options.range || (start || end ? "custom" : "all"),
      },
    };
  }
}