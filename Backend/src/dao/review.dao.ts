import prisma from "../config/db.config";

export class ReviewDao {
  
  // CREATE REVIEW
  static async createReview(data: { 
    name: string;
    title: string;
    description: string;
    image?: string | null;
  }) {
    // check duplicate title manually
    const existingTitle = await prisma.reviews.findFirst({
      where: { title: data.title },
    });

    if (existingTitle) {
      throw new Error("Review title already exists");
    }

    return prisma.reviews.create({
      data,
    });
  }

  // GET ALL REVIEWS
  static async getAllReviews() {
    return prisma.reviews.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // GET REVIEW BY ID
  static async getReviewById(id: number) {
    return prisma.reviews.findUnique({
      where: { id },
    });
  }

  // UPDATE REVIEW
  static async updateReview(
    id: number,
    data: {
      name?: string;
      title?: string;
      description?: string;
      image?: string | null;
    }
  ) {
    if (data.title) {
      const existingTitle = await prisma.reviews.findFirst({
        where: { title: data.title },
      });

      if (existingTitle && existingTitle.id !== id) {
        throw new Error("Review title already exists");
      }
    }

    return prisma.reviews.update({
      where: { id },
      data,
    });
  }

  // DELETE REVIEW
  static async deleteReview(id: number) {
    return prisma.reviews.delete({
      where: { id },
    });
  }
}
