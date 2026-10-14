import prisma from "../config/db.config";

export const planDao = {
  
  // Get all plans
  getAll: async () => {
    return prisma.plan.findMany({
      include: { features: true },
      orderBy: { id: "desc" }
    });
  },

  // Get by ID
  getById: async (id: number) => {
    return prisma.plan.findUnique({
      where: { id },
      include: { features: true }
    });
  },

  // Find plan by name (for validation)
  findByName: async (name: string) => {
    return prisma.plan.findFirst({
      where: { name },
    });
  },

 
create: async (data: any) => {
  return prisma.plan.create({
    data: {
      name: data.name,
      price: data.price,
      priceType: data.priceType,
      buttonText: data.buttonText,
      isPopular: data.isPopular,
      features: {
        create: (data.features || []).map((f: any) => ({ text: f.text }))
      }
    },
    include: { features: true }
  });
},
  
// Update plan
update: async (id: number, data: any) => {
  // Delete old features
  await prisma.planFeature.deleteMany({ where: { planId: id } });

  return prisma.plan.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      priceType: data.priceType,
      buttonText: data.buttonText,
      isPopular: data.isPopular,
      features: {
        create: (data.features || []).map((f: any) => ({ text: f.text }))
      }
    },
    include: { features: true }
  });
},

  // Delete plan
  delete: async (id: number) => {
    return prisma.plan.delete({
      where: { id }
    });
  }
};
