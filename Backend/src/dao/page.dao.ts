import prisma from "../config/db.config";
import sanitizeHtml from "sanitize-html";

export class PageDao {
    static async createPage(title : string, content : string, type : string) {
        const safeContent = sanitizeHtml(content, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'div', 'span', 'strong', 'em', 'u', 's', 'del', 'sub', 'sup', 'mark', 'ins',  'p', 'b', 'i', 'ul', 'ol', 'li', 'br'],
            allowedAttributes: {}
          });
        const data = { type, title, content: safeContent };
        return await prisma.pages.create({ data });
    }

    

    static async getPages() {
        return await prisma.pages.findMany({
            orderBy: { createdAt: "desc" },
        });
    }


    static async findPage(id : number) {
        return await prisma.pages.findFirst({ where: { id } });
    }

    static async findPageByType(type : string) {
        return await prisma.pages.findUnique({ where: { type } });
    }
    static async updatePage(id : number, content : string, title : string, type : string) {
        const safeContent = sanitizeHtml(content, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'div', 'span', 'strong', 'em', 'u', 's', 'del', 'sub', 'sup', 'mark', 'ins',  'p', 'b', 'i', 'ul', 'ol', 'li', 'br'],
            allowedAttributes: {}
          });
        const data = { type, title, content: safeContent };

        return await prisma.pages.update({ where: { id }, data });
    }
    static async deletePage(id : number) {
        return await prisma.pages.delete({ where: { id } });
    }
}