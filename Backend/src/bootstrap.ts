import { initRootAdmin } from "./utils/initRootAdmin";
import { initMinioBucket } from "./config/minio.config";
import prisma from "./config/db.config";

export const bootstrap = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected");
        await initMinioBucket();
        await initRootAdmin();
    } catch (error: any) {
        console.error("bootstrap failed", error.message);
        process.exit(1);
    }
}

