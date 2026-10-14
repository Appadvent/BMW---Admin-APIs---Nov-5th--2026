import { RESPONSE_MESSAGES } from "../constants/response";
import { Request, Response } from "express";
import { PageDao } from "../dao/page.dao";



const pagesController = {
    createPage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, content, type } = req.body;
            // Check if a page with the same type already exists
            const existingPage = await PageDao.findPageByType(type);
            if (existingPage) {
                res.status(400).json(RESPONSE_MESSAGES.ERROR.PAGE_TYPE_ALREADY_EXISTS);
                return
            }
            const page = await PageDao.createPage(title, content, type);
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.CREATE_PAGE({
                page
            }))
        } catch (error: any) {
            console.log(error);
            
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    },

    updatePage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, content, type } = req.body;

            const existPage = await PageDao.findPage(Number(id));

            if (!existPage) {
                res.status(400).json(RESPONSE_MESSAGES.ERROR.PAGE_NOT_FOUND)
                return
            }

            let updatedData: any = { title, content, type };
            await PageDao.updatePage(Number(id), updatedData.content, updatedData.title, updatedData.type);
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.PAGE_UPDATED)

        } catch (error: any) {
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    },

    deletePage: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const existPage = await PageDao.findPage(Number(id));

            if (!existPage) {
                res.status(400).json(RESPONSE_MESSAGES.ERROR.PAGE_NOT_FOUND)
                return
            }

            await PageDao.deletePage(Number(id));
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.PAGE_DELETED)
        } catch (error: any) {
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    },

    getPages: async (req: Request, res: Response): Promise<void> => {
        try {
            const pages = await PageDao.getPages();
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.GET_PAGES({
                pages
            }))
        } catch (error: any) {
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    }
}

export default pagesController