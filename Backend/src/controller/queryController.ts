import { Request, Response } from "express";
import { QueryDao } from "../dao/query.dao";
import { RESPONSE_MESSAGES } from "../constants/response";

const queryController = {
    contactUs: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, message, services, service, category, phone, carModel, vin, oemNumber, year } = req.body;
            const finalServices = services || service || category || "";
            const result = await QueryDao.createQuery(name, email, message, finalServices, phone, carModel, vin, oemNumber, year);
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.CONTACT_US({
                result
            }))
        } catch (error: any) {
            console.error("Contact Us Error:", error);
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    },
    getQueries: async (req: Request, res: Response): Promise<void> => {
        try {
            const search = req.query.search as string | undefined;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            const { queries, pagination } = await QueryDao.getQueries({
                page,
                limit,
                search,
            });

            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.GET_QUERIES({
                queries,
                pagination,
            }));
        } catch (error: any) {
            console.error("Get Queries Error:", error);
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
        }
    },

    deleteQuery: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
             await QueryDao.deleteQuery(Number(id));
            res.status(200).json(RESPONSE_MESSAGES.SUCCESS.QUERY_DELETED)
        } catch (error: any) {
            res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR)
        }
    }
}

export default queryController