import prisma from "../config/db.config";

export interface CreateTestimonialInput {
  name: string;
  message: string;
  image?: string | null;
  designation?: string | null;
}

export interface UpdateTestimonialInput {
  name?: string;
  message?: string;
  image?: string | null;
  designation?: string | null;
}

export interface GetAllTestimonialsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const TestimonialDao = {
  // CREATE TESTIMONIAL
  createTestimonial: async (data: CreateTestimonialInput) => {
    return await prisma.testimonial.create({
      data: {
        name: data.name,
        message: data.message,
        image: data.image ?? null,
        designation: data.designation ?? null,
      },
    });
  },

  // GET ALL TESTIMONIALS (WITH SERVER-SIDE PAGINATION, SEARCH, AND NEWEST-FIRST SORT)
  getAllTestimonials: async ({
    page = 1,
    limit = 10,
    search,
  }: GetAllTestimonialsQuery = {}) => {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" as const } },
        { message: { contains: query, mode: "insensitive" as const } },
        { designation: { contains: query, mode: "insensitive" as const } },
      ];
    }

    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count({ where: Object.keys(where).length ? where : undefined }),
      prisma.testimonial.findMany({
        where: Object.keys(where).length ? where : undefined,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      testimonials,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  },

  // GET TESTIMONIAL BY ID
  getTestimonialById: async (id: number) => {
    return await prisma.testimonial.findUnique({
      where: { id },
    });
  },

  // UPDATE TESTIMONIAL
  updateTestimonial: async (id: number, data: UpdateTestimonialInput) => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.designation !== undefined) updateData.designation = data.designation;

    return await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });
  },

  // DELETE TESTIMONIAL
  deleteTestimonial: async (id: number) => {
    return await prisma.testimonial.delete({
      where: { id },
    });
  },
};
