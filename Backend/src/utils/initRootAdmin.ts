import bcrypt from "bcrypt"
import { AdminDAO } from "../dao/admin.dao"


export const initRootAdmin = async () => {
    const name = process.env.ROOT_ADMIN_NAME;
    const email = process.env.ROOT_ADMIN_EMAIL;
    const password = process.env.ROOT_ADMIN_PASSWORD;

    if(!name || !email || !password){
        console.warn("Root admin environment variables are not set. Skipping root admin creation")
        return;
    }

    try {
        const existingAdmin = await AdminDAO.findAdminByEmail(email);
        if(existingAdmin){
            console.warn("Root admin already exists.")
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await AdminDAO.createAdmin(name, email, hashedPassword);
        console.log("Root admin created successfully.");

    } catch (error: any) {
        console.error("Error creating root admin:", error.message);
    }
}