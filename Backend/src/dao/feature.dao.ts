import prisma from "../config/db.config";
import sanitizeHtml from "sanitize-html";

export const FeatureDao = {
  createFeature: async (data: { title: string; description: string; image?: string; productId: number }) => {
    const safeTitle = sanitizeHtml(data.title, { allowedTags: [], allowedAttributes: {} });
    const safeDescription = sanitizeHtml(data.description, {
      allowedTags: ["h1","h2","h3","h4","h5","h6","p","b","i","strong","em","u","a","ul","ol","li","br","img"],
      allowedAttributes: { a: ["href","target"], img: ["src","alt"] },
    });
    const safeImage = data.image ? sanitizeHtml(data.image, { allowedTags: [], allowedAttributes: {} }) : undefined;

    return await prisma.feature.create({
      data: {
        title: safeTitle,
        description: safeDescription,
        image: safeImage,
        product: { connect: { id: data.productId } },
      },
      include: { product: true },
    });
  },

  findProductById: async (id: number) => {
    return await prisma.product.findUnique({
      where: { id }, 
    });
  },

  getAllFeatures: async () =>
    prisma.feature.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    }),

  getFeatureById: async (id: number) =>
    prisma.feature.findUnique({ where: { id }, include: { product: true } }),

  getFeaturesByProduct: async (productId: number) =>
    prisma.feature.findMany({
      where: { productId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    }),

  getFeatureCountByProduct: async (productId: number) =>
    prisma.feature.count({
      where: { productId },
    }),

  updateFeature: async (id: number, data: any) => {
    const sanitizedData: any = {};
    if (data.title) sanitizedData.title = sanitizeHtml(data.title, { allowedTags: [], allowedAttributes: {} });
    if (data.description) sanitizedData.description = sanitizeHtml(data.description, {
      allowedTags: ["h1","h2","h3","h4","h5","h6","p","b","i","strong","em","u","a","ul","ol","li","br","img"],
      allowedAttributes: { a: ["href","target"], img: ["src","alt"] },
    });
    if (data.image) sanitizedData.image = sanitizeHtml(data.image, { allowedTags: [], allowedAttributes: {} });
    if (data.productId) sanitizedData.product = { connect: { id: data.productId } };

    return prisma.feature.update({ where: { id }, data: sanitizedData, include: { product: true } });
  },

  deleteFeature: async (id: number) => prisma.feature.delete({ where: { id } }),
};
