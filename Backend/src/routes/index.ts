import {Router} from "express";
import pageRouters from "./pageRoutes";
import queryRouters from "./queryRoutes";
import adminRouters from "./adminRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import blogRoutes from "./blogRoutes";
import featureRoutes from "./featureRoutes";
import aboutRoutes from "./aboutRoutes"
import reviewsRoutes from "./reviewsRoutes"
import serviceRoutes from "./serviceRoutes"
import founderRoutes from "./founderRoutes"
import homeRoutes from "./homeRoutes"
import missionRoutes from "./missionRoutes"
import whyChooseRoutes from "./whyChooseRoutes"
import productHeadingRoutes from "./productHeadingRoutes"
import benefitRoutes from "./benefitRoutes"
import faqRoutes from "./faqRoutes"
import uploadRoutes from "./uploadRoutes"
import testimonialRoutes from "./testimonialRoutes"
import bannerRoutes from "./bannerRoutes"
import planRoutes from "./planRoutes"
import subcategoryRoutes from "./subcategoryRoutes"

const router = Router();

router.use('/banners', bannerRoutes)
router.use('/upload', uploadRoutes)
router.use('/page', pageRouters )
router.use('/query', queryRouters )
router.use('/admin', adminRouters )
router.use("/product", productRoutes)
router.use("/products", productRoutes)
router.use("/feature", featureRoutes)
router.use("/category", categoryRoutes)
router.use("/subcategory", subcategoryRoutes)
router.use("/subcategories", subcategoryRoutes)
router.use("/blog",blogRoutes)
router.use("/about", aboutRoutes)
router.use("/reviews", reviewsRoutes)
router.use("/testimonials", testimonialRoutes)
router.use("/services", serviceRoutes)
router.use("/founders", founderRoutes)
router.use("/home", homeRoutes)
router.use("/mission", missionRoutes)
router.use("/whychoose", whyChooseRoutes)
router.use("/product-headings",productHeadingRoutes)
router.use("/benefit", benefitRoutes)
router.use("/faq", faqRoutes)
router.use("/plan", planRoutes)

export default router