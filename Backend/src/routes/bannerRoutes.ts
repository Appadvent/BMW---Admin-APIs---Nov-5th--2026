import { Router } from "express";
import { bannerController } from "../controller/bannerController";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware";
import {
  validateCreateBanner,
  validateUpdateBanner,
} from "../validations/bannerValidation";

const router = Router();

// PUBLIC STOREFRONT ROUTE: Fetch active banners (max 3, ordered by sequence)
router.get("/", bannerController.getActiveBanners);

// ADMIN ROUTES (Protected by adminAuthMiddleware)
router.get("/admin", adminAuthMiddleware, bannerController.getBannersAdmin);
router.get("/:id", adminAuthMiddleware, bannerController.getBannerById);
router.post("/", adminAuthMiddleware, validateCreateBanner, bannerController.createBanner);
router.patch("/:id", adminAuthMiddleware, validateUpdateBanner, bannerController.updateBanner);
router.patch("/:id/status", adminAuthMiddleware, bannerController.toggleStatus);
router.delete("/:id", adminAuthMiddleware, bannerController.deleteBanner);

export default router;
