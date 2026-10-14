import prisma from "../config/db.config";

export const FAQDao = {
  // Create a FAQ Section with items
  createFAQSection: async (data: any) => {
    return await prisma.fAQSection.create({
      data: {
        heading: data.heading,
        items: {
          create:
            data.items?.map((item: any) => ({
              question: item.question,
              answer: item.answer,
            })) || [],
        },
      },
      include: { items: true },
    });
  },

  // Get all FAQ Sections with their items
  getAllFAQSections: async () => {
    return await prisma.fAQSection.findMany({
      include: { items: true },
      orderBy: { id: "desc" },
    });
  },

  // Get a single FAQ Section by ID
  getFAQSectionById: async (id: number) => {
    return await prisma.fAQSection.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  // Update a FAQ Section and its items
  updateFAQSection: async (id: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
      // Delete old items
      await tx.fAQItem.deleteMany({ where: { sectionId: id } });

      // Update parent + recreate items
      return await tx.fAQSection.update({
        where: { id },
        data: {
          heading: data.heading,
          items: {
            create:
              data.items?.map((item: any) => ({
                question: item.question,
                answer: item.answer,
              })) || [],
          },
        },
        include: { items: true },
      });
    });
  },

  // Delete FAQ Section and its items
  deleteFAQSection: async (id: number) => {
    await prisma.fAQItem.deleteMany({ where: { sectionId: id } });
    return await prisma.fAQSection.delete({ where: { id } });
  },
};
