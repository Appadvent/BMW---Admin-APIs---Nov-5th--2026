import prisma from "../config/db.config";

export class AboutDao {
  static async createAbout(data: any) {
    const { items, sections, ...aboutData } = data;

    // Normalizing legacy fields if provided
    const payload: any = {
      ...aboutData,
      title: aboutData.title || aboutData.titleOne || "About Us",
      subtitle: aboutData.subtitle || aboutData.titleTwo || null,
      description: aboutData.description || aboutData.descriptionOne || null,
      content: aboutData.content || aboutData.descriptionTwo || null,
    };

    if (items && Array.isArray(items) && items.length > 0) {
      payload.items = {
        create: items.map((item: any, index: number) => ({
          title: item.title,
          description: item.description || null,
          icon: item.icon || null,
          link: item.link || null,
          order: item.order !== undefined ? Number(item.order) : index,
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
        })),
      };
    }

    if (sections && Array.isArray(sections) && sections.length > 0) {
      payload.sections = {
        create: sections.map((sec: any, secIdx: number) => ({
          title: sec.title || "Section",
          subtitle: sec.subtitle || null,
          badge: sec.badge || null,
          description: sec.description || null,
          content: sec.content || null,
          image: sec.image || null,
          imagePosition: sec.imagePosition || "left",
          layout: sec.layout || "default",
          order: sec.order !== undefined ? Number(sec.order) : secIdx,
          isActive: sec.isActive !== undefined ? Boolean(sec.isActive) : true,
          items: sec.items && Array.isArray(sec.items) && sec.items.length > 0
            ? {
                create: sec.items.map((item: any, itIdx: number) => ({
                  title: item.title || null,
                  description: item.description || null,
                  image: item.image || null,
                  icon: item.icon || null,
                  order: item.order !== undefined ? Number(item.order) : itIdx,
                  isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
                })),
              }
            : undefined,
        })),
      };
    }

    return await prisma.about.create({
      data: payload,
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            items: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  static async getAllAbout() {
    const records = await prisma.about.findMany({
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            items: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      ...record,
      title: record.title || record.titleOne || "",
      subtitle: record.subtitle || record.titleTwo || "",
      description: record.description || record.descriptionOne || "",
      content: record.content || record.descriptionTwo || "",
    }));
  }

  static async getAboutById(id: number) {
    const record = await prisma.about.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            items: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!record) return null;

    return {
      ...record,
      title: record.title || record.titleOne || "",
      subtitle: record.subtitle || record.titleTwo || "",
      description: record.description || record.descriptionOne || "",
      content: record.content || record.descriptionTwo || "",
    };
  }

  static async updateAbout(id: number, data: any) {
    const { items, sections, ...aboutData } = data;

    return await prisma.$transaction(async (tx) => {
      // If items array is explicitly provided, synchronize items
      if (items !== undefined && Array.isArray(items)) {
        await tx.aboutItem.deleteMany({ where: { aboutId: id } });
        if (items.length > 0) {
          await tx.aboutItem.createMany({
            data: items.map((item: any, index: number) => ({
              aboutId: id,
              title: item.title,
              description: item.description || null,
              icon: item.icon || null,
              link: item.link || null,
              order: item.order !== undefined ? Number(item.order) : index,
              isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
            })),
          });
        }
      }

      // If sections array is explicitly provided, synchronize sections and their items
      if (sections !== undefined && Array.isArray(sections)) {
        await tx.aboutSection.deleteMany({ where: { aboutId: id } });
        for (let secIdx = 0; secIdx < sections.length; secIdx++) {
          const sec = sections[secIdx];
          await tx.aboutSection.create({
            data: {
              aboutId: id,
              title: sec.title || "Section",
              subtitle: sec.subtitle || null,
              badge: sec.badge || null,
              description: sec.description || null,
              content: sec.content || null,
              image: sec.image || null,
              imagePosition: sec.imagePosition || "left",
              layout: sec.layout || "default",
              order: sec.order !== undefined ? Number(sec.order) : secIdx,
              isActive: sec.isActive !== undefined ? Boolean(sec.isActive) : true,
              items: sec.items && Array.isArray(sec.items) && sec.items.length > 0
                ? {
                    create: sec.items.map((item: any, itIdx: number) => ({
                      title: item.title || null,
                      description: item.description || null,
                      image: item.image || null,
                      icon: item.icon || null,
                      order: item.order !== undefined ? Number(item.order) : itIdx,
                      isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
                    })),
                  }
                : undefined,
            },
          });
        }
      }

      return await tx.about.update({
        where: { id },
        data: aboutData,
        include: {
          items: {
            orderBy: { order: "asc" },
          },
          sections: {
            orderBy: { order: "asc" },
            include: {
              items: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    });
  }

  static async deleteAbout(id: number) {
    return await prisma.about.delete({
      where: { id },
    });
  }
}
