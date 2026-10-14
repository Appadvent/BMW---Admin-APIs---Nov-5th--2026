import prisma from "../config/db.config";

interface BenefitItemInput {
  id?: number;
  title: string;
  description: string;
}

export const BenefitDao = {
  createBenefit: async (data: { heading: string; description: string; items: BenefitItemInput[] }) => {
    return prisma.benefit.create({
      data: {
        heading: data.heading,
        description: data.description,
        items: {
          create: data.items.map((item) => ({
            title: item.title,
            description: item.description,
          })),
        },
      },
      include: { items: true },
    });
  },

  getAllBenefits: async () => {
    return prisma.benefit.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getBenefitById: async (id: number) => {
    return prisma.benefit.findUnique({
      where: { id },
      include: { items: true },
    });
  },

//   updateBenefit: async (
//     id: number,
//     heading: string,
//     description: string,
//     items: BenefitItemInput[]
//   ) => {
//     // Update benefit heading and description
//     await prisma.benefit.update({
//       where: { id },
//       data: { heading, description },
//     });

//     // Upsert items
//     for (const item of items) {
//       if (item.id) {
//         await prisma.benefitItem.update({
//           where: { id: item.id },
//           data: { title: item.title, description: item.description },
//         });
//       } else {
//         await prisma.benefitItem.create({
//           data: { benefitId: id, title: item.title, description: item.description },
//         });
//       }
//     }

//     return prisma.benefit.findUnique({ where: { id }, include: { items: true } });
//   },
updateBenefit: async (
  id: number,
  heading: string,
  description: string,
  items: BenefitItemInput[]
) => {

  // 1️⃣ Update Benefit text fields
  await prisma.benefit.update({
    where: { id },
    data: { heading, description },
  });

  // 2️⃣ Fetch existing item IDs from DB
  const existingItems = await prisma.benefitItem.findMany({
    where: { benefitId: id },
  });

  const existingIds = existingItems.map((i) => i.id);
  const newIds = items.filter(i => i.id).map((i) => i.id);

  // 3️⃣ Delete items removed by user
  const idsToDelete = existingIds.filter((id) => !newIds.includes(id));

  if (idsToDelete.length > 0) {
    await prisma.benefitItem.deleteMany({
      where: { id: { in: idsToDelete } },
    });
  }

  // 4️⃣ Update or create items
  for (const item of items) {
    if (item.id) {
      // Update existing
      await prisma.benefitItem.update({
        where: { id: item.id },
        data: {
          title: item.title,
          description: item.description,
        },
      });
    } else {
      // Create new
      await prisma.benefitItem.create({
        data: {
          benefitId: id,
          title: item.title,
          description: item.description,
        },
      });
    }
  }

  // 5️⃣ Return updated full benefit
  return prisma.benefit.findUnique({
    where: { id },
    include: { items: true },
  });
},

  deleteBenefit: async (id: number) => {
    await prisma.benefitItem.deleteMany({ where: { benefitId: id } });
    return prisma.benefit.delete({ where: { id } });
  },
};
