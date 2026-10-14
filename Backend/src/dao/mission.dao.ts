import prisma from "../config/db.config";

export const MissionVisionDao = {
  createMissionVision: async (data: any) => {
    return await prisma.missionVision.create({
      data: {
        heading: data.heading,
        description: data.description,
        items: {
          create: data.items?.map((item: any) => ({
            title: item.title,
            description: item.description,
          })) || [],
        },
      },
      include: { items: true },
    });
  },

  getAllMissionVision: async () => {
    return await prisma.missionVision.findMany({
      include: { items: true },
      orderBy: { id: "desc" },
    });
  },

  getMissionVisionById: async (id: number) => {
    return await prisma.missionVision.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  updateMissionVision: async (id: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
      // delete old items
      await tx.missionVisionItem.deleteMany({
        where: { missionVisionId: id },
      });

      // update parent + recreate items
      return await tx.missionVision.update({
        where: { id },
        data: {
          heading: data.heading,
          description: data.description,
          items: {
            create: data.items?.map((item: any) => ({
              title: item.title,
              description: item.description,
            })) || [],
          },
        },
        include: { items: true },
      });
    });
  },

  deleteMissionVision: async (id: number) => {
  await prisma.missionVisionItem.deleteMany({
    where: { missionVisionId: id },
  });
  return await prisma.missionVision.delete({
    where: { id },
  });
}

};
