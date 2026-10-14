import { Request, Response } from "express";
import { BannerDao } from "../dao/banner.dao";
import { RESPONSE_MESSAGES } from "../constants/response";

export const bannerController = {
  // Public storefront endpoint: returns only active banners ordered by sequence asc
  getActiveBanners: async (_req: Request, res: Response): Promise<void> => {
    try {
      const banners = await BannerDao.getActiveBanners();
      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.GET_BANNERS({
        banners,
      }));
    } catch (error: any) {
      console.error("Get Active Banners Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: list all banners with pagination & search
  getBannersAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      let isActive: boolean | undefined = undefined;
      if (req.query.isActive !== undefined) {
        isActive = String(req.query.isActive) === "true";
      }

      const result = await BannerDao.getBannersAdmin({
        page,
        limit,
        search,
        isActive,
      });

      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.GET_BANNERS(result));
    } catch (error: any) {
      console.error("Get Banners Admin Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: get banner by id
  getBannerById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const banner = await BannerDao.getBannerById(Number(id));
      if (!banner) {
        res.status(404).json({ success: false, message: "Banner not found" });
        return;
      }
      res.status(200).json({ success: true, data: banner });
    } catch (error: any) {
      console.error("Get Banner By ID Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: create banner
  createBanner: async (req: Request, res: Response): Promise<void> => {
    try {
      const banner = await BannerDao.createBanner(req.body);
      res.status(201).json(RESPONSE_MESSAGES.SUCCESS.BANNER_CREATED(banner));
    } catch (error: any) {
      console.error("Create Banner Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: update banner
  updateBanner: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const banner = await BannerDao.updateBanner(Number(id), req.body);
      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.BANNER_UPDATED(banner));
    } catch (error: any) {
      console.error("Update Banner Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: toggle banner active status
  toggleStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const banner = await BannerDao.toggleStatus(Number(id));
      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.BANNER_UPDATED(banner));
    } catch (error: any) {
      console.error("Toggle Banner Status Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  // Admin endpoint: delete banner
  deleteBanner: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await BannerDao.deleteBanner(Number(id));
      res.status(200).json(RESPONSE_MESSAGES.SUCCESS.BANNER_DELETED);
    } catch (error: any) {
      console.error("Delete Banner Error:", error);
      res.status(500).json(RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
    }
  },
};

export default bannerController;
