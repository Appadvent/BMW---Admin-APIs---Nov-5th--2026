import prisma from "../config/db.config";

export class QueryDao{
    static async createQuery(
        name: string,
        email: string,
        message: string,
        services?: string,
        phone?: string | number,
        carModel?: string,
        vin?: string,
        oemNumber?: string,
        year?: string
    ) {
        const data: any = {
            name,
            email,
            message,
            services: services || "",
            phone: phone !== undefined && phone !== null ? String(phone) : "",
            carModel: carModel || null,
            vin: vin || null,
            oemNumber: oemNumber || null,
            year: year || null,
        };
        return await prisma.contact.create({ data });
    }

    static async getQueries({
        page = 1,
        limit = 10,
        search,
    }: {
        page?: number;
        limit?: number;
        search?: string;
    } = {}) {
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Number(limit) || 10);
        const skip = (pageNum - 1) * limitNum;

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { phone: { contains: search, mode: "insensitive" as const } },
                    { services: { contains: search, mode: "insensitive" as const } },
                    { message: { contains: search, mode: "insensitive" as const } },
                    { carModel: { contains: search, mode: "insensitive" as const } },
                    { oemNumber: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : undefined;

        const [total, queries] = await Promise.all([
            prisma.contact.count({ where }),
            prisma.contact.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return {
            queries,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1,
            },
        };
    }

    static async deleteQuery(id: number) {
        return await prisma.contact.delete({ where: { id } });
    }
}