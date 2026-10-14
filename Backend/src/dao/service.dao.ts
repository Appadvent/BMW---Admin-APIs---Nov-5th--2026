import prisma from "../config/db.config";

interface ServiceItemInput {
  id?: number;
  title: string;
  description: string;
  image?: string | null;
}

export const ServiceDao = {
  // CREATE SERVICE
  createService: async (data: { heading: string; items: ServiceItemInput[] }) => {
    return await prisma.service.create({
      data: {
        heading: data.heading,
        items: {
          create: data.items.map((item) => ({
            title: item.title,
            description: item.description,
            image: item.image ?? null,
          })),
        },
      },
      include: { items: true },
    });
  },

  // GET ALL SERVICES
  getAllServices: async () => {
    return await prisma.service.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  // GET SERVICE BY ID
  getServiceById: async (id: number) => {
    return await prisma.service.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  // UPDATE SERVICE
  updateService: async (
    id: number,
    heading: string,
    items: ServiceItemInput[]
  ) => {
    // First, update the service heading
    const updatedService = await prisma.service.update({
      where: { id },
      data: { heading },
    });

    // Handle items: upsert each item
    for (const item of items) {
      if (item.id) {
        // update existing item
        await prisma.serviceItem.update({
          where: { id: item.id },
          data: {
            title: item.title,
            description: item.description,
            image: item.image ?? null,
          },
        });
      } else {
        // create new item
        await prisma.serviceItem.create({
          data: {
            serviceId: id,
            title: item.title,
            description: item.description,
            image: item.image ?? null,
          },
        });
      }
    }

    // Return updated service with all items
    return await prisma.service.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  // DELETE SERVICE
  deleteService: async (id: number) => {
    // Delete all items first
    await prisma.serviceItem.deleteMany({ where: { serviceId: id } });

    // Delete service
    return await prisma.service.delete({ where: { id } });
  },
};
