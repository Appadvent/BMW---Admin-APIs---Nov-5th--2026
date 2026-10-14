// import prisma from "../config/db.config";

// export const WhyChooseDao = {
//   createWhyChoose: async (data: any) => {
//     return await prisma.whyChoose.create({
//       data: {
//         heading: data.heading,
//         description: data.description,
//         items: {
//           create: data.items,
//         },
//       },
//       include: { items: true },
//     });
//   },

//   getAllWhyChoose: async () => {
//     return await prisma.whyChoose.findMany({
//       include: { items: true },
//       orderBy: { id: "desc" },
//     });
//   },

//   getWhyChooseById: async (id: number) => {
//     return await prisma.whyChoose.findUnique({
//       where: { id },
//       include: { items: true },
//     });
//   },

//   updateWhyChoose: async (id: number, data: any) => {
//     // Delete old items; recreate new ones
//     await prisma.whyChooseItem.deleteMany({
//       where: { whyChooseId: id },
//     });

//     return await prisma.whyChoose.update({
//       where: { id },
//       data: {
//         heading: data.heading,
//         description: data.description,
//         items: {
//           create: data.items,
//         },
//       },
//       include: { items: true },
//     });
//   },

//   deleteWhyChoose: async (id: number) => {
//     await prisma.whyChooseItem.deleteMany({ where: { whyChooseId: id } });

//     return await prisma.whyChoose.delete({
//       where: { id },
//     });
//   },
// };
import prisma from "../config/db.config";

export const WhyChooseDao = {
  createWhyChoose: async (data: any) => {
    return await prisma.whyChoose.create({
      data: {
        heading: data.heading,
        description: data.description,
        items: {
          create: data.items.map((i: any) => ({
            description: i.description,
          })),
        },
      },
      include: { items: true },
    });
  },

  getAllWhyChoose: async () => {
    return await prisma.whyChoose.findMany({
      include: { items: true },
      orderBy: { id: "desc" },
    });
  },

  getWhyChooseById: async (id: number) => {
    return await prisma.whyChoose.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  updateWhyChoose: async (id: number, data: any) => {
    const { heading, description, items } = data;

    // 1️⃣ Fetch existing items from DB
    const existingItems = await prisma.whyChooseItem.findMany({
      where: { whyChooseId: id },
    });

    const existingIds = existingItems.map((i) => i.id);
    const incomingIds = items.filter((i: any) => i.id).map((i: any) => i.id);

    // 2️⃣ Delete removed items
    const toDelete = existingIds.filter((eid) => !incomingIds.includes(eid));

    if (toDelete.length > 0) {
      await prisma.whyChooseItem.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // 3️⃣ Prepare update + create arrays
    const updateItems = items
      .filter((i: any) => i.id)
      .map((i: any) => ({
        where: { id: i.id },
        data: { description: i.description },
      }));

    const createItems = items
      .filter((i: any) => !i.id)
      .map((i: any) => ({
        description: i.description,
      }));

    // 4️⃣ Perform update
    return await prisma.whyChoose.update({
      where: { id },
      data: {
        heading,
        description,
        items: {
          update: updateItems,
          create: createItems,
        },
      },
      include: { items: true },
    });
  },

  deleteWhyChoose: async (id: number) => {
    await prisma.whyChooseItem.deleteMany({ where: { whyChooseId: id } });

    return await prisma.whyChoose.delete({
      where: { id },
    });
  },
};
