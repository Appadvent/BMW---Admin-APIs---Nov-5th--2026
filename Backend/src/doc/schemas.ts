import Joi from "joi";
import { generateExampleFromJoi } from "../utils/swagger";

import { createPage, updatePage } from "../validations/pageValidation";
import { createProduct, updateProduct } from "../validations/productValidation";
import { createFeature, updateFeature } from "../validations/featureValidation";
import { createCategory, updateCategory } from "../validations/categoryValidation";
import { createSubcategory, updateSubcategory } from "../validations/subcategoryValidation";
import { createBlog, updateBlog } from "../validations/blogValidations";
import { queryValidation } from "../validations/queryValidation";
import { adminLoginValidation, emailSendValidation } from "../validations/adminValidation";
import { createAboutSchema, updateAboutSchema } from "../validations/aboutValidation";
import { createBenefitSchema, updateBenefitSchema } from "../validations/benefitValidation";
import { createFAQSchema, updateFAQSchema } from "../validations/faqValidation";
import { createFounderSchema, updateFounderSchema } from "../validations/founderValidation";
import { createHomeSchema, updateHomeSchema } from "../validations/homeValidation";
import { createMissionSchema, updateMissionSchema } from "../validations/missionValidation";
import { createPlanSchema, updatePlanSchema } from "../validations/planValidation";
import { createProductHeadingSchema, updateProductHeadingSchema } from "../validations/productHeadingValidation";
import { createReviewSchema, updateReviewSchema } from "../validations/reviewsValidation";
import { createServiceSchema, updateServiceSchema } from "../validations/serviceValidation";
import { createWhyChooseSchema, updateWhyChooseSchema } from "../validations/whyChooseValidation";
import { createTestimonialSchema, updateTestimonialSchema } from "../validations/testimonialValidation";

const deleteUploadValidation = Joi.object({
  url: Joi.string().uri().required().example("https://minioapi.appadvent.in/i-mag/uploads/1790589653307-image.jpg").messages({
    "string.empty": "Image URL is required",
    "string.uri": "Invalid image URL format",
  }),
});

function withExample(joiSchema: Joi.Schema): any {
  return generateExampleFromJoi(joiSchema);
}

export const swaggerSchemas = {
  createProductSchema: withExample(createProduct),
  updateProductSchema: withExample(updateProduct),
  createFeatureSchema: withExample(createFeature),
  updateFeatureSchema: withExample(updateFeature),
  createCategorySchema: withExample(createCategory),
  updateCategorySchema: withExample(updateCategory),
  createSubcategorySchema: withExample(createSubcategory),
  updateSubcategorySchema: withExample(updateSubcategory),
  createBlogSchema: withExample(createBlog),
  updateBlogSchema: withExample(updateBlog),
  createPageSchema: withExample(createPage),
  updatePageSchema: withExample(updatePage),
  querySchema: withExample(queryValidation),
  adminLoginSchema: withExample(adminLoginValidation),
  emailSendSchema: withExample(emailSendValidation),
  deleteUploadSchema: withExample(deleteUploadValidation),
  createAboutSchema: withExample(createAboutSchema),
  updateAboutSchema: withExample(updateAboutSchema),
  createBenefitSchema: withExample(createBenefitSchema),
  updateBenefitSchema: withExample(updateBenefitSchema),
  createFAQSchema: withExample(createFAQSchema),
  updateFAQSchema: withExample(updateFAQSchema),
  createFounderSchema: withExample(createFounderSchema),
  updateFounderSchema: withExample(updateFounderSchema),
  createHomeSchema: withExample(createHomeSchema),
  updateHomeSchema: withExample(updateHomeSchema),
  createMissionSchema: withExample(createMissionSchema),
  updateMissionSchema: withExample(updateMissionSchema),
  createPlanSchema: withExample(createPlanSchema),
  updatePlanSchema: withExample(updatePlanSchema),
  createProductHeadingSchema: withExample(createProductHeadingSchema),
  updateProductHeadingSchema: withExample(updateProductHeadingSchema),
  createReviewSchema: withExample(createReviewSchema),
  updateReviewSchema: withExample(updateReviewSchema),
  createServiceSchema: withExample(createServiceSchema),
  updateServiceSchema: withExample(updateServiceSchema),
  createWhyChooseSchema: withExample(createWhyChooseSchema),
  updateWhyChooseSchema: withExample(updateWhyChooseSchema),
  createTestimonialSchema: withExample(createTestimonialSchema),
  updateTestimonialSchema: withExample(updateTestimonialSchema),
};
