// src/swagger.ts
import swaggerAutogen from "swagger-autogen";
import { swaggerSchemas } from "./doc/schemas";

const isProduction = process.env.NODE_ENV === "production";

const doc = {
    info: {
        title: "Streamline Factory API",
        description: "Standardized Swagger API Documentation for Streamline Factory backend",
        version: "1.0.0",
    },
    host: isProduction ? "15.206.197.114:5000" : "localhost:5000",
    schemes: isProduction ? ["http"] : ["http"],
    basePath: "/api",
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        { name: "Admin", description: "Admin authentication & administration" },
        { name: "Upload", description: "MinIO file upload and storage management" },
        { name: "Page", description: "Static page management" },
        { name: "Query", description: "User contact & inquiries" },
        { name: "Product", description: "Product catalog management" },
        { name: "ProductHeading", description: "Product heading section" },
        { name: "Feature", description: "Product features & specifications" },
        { name: "Category", description: "Product and blog categories" },
        { name: "Subcategory", description: "Product subcategories management" },
        { name: "Blog", description: "Articles and blog posts" },
        { name: "About", description: "About section & company profile" },
        { name: "Reviews", description: "Customer reviews and testimonials" },
        { name: "Testimonials", description: "Customer testimonials & client endorsements" },
        { name: "Services", description: "Industrial & fabrication services" },
        { name: "Founders", description: "Company leadership & team" },
        { name: "Home", description: "Homepage media & content" },
        { name: "MissionVision", description: "Mission & Vision statements" },
        { name: "WhyChoose", description: "Why Choose Us items" },
        { name: "Benefit", description: "Business & technical benefits" },
        { name: "FAQ", description: "Frequently asked questions" },
        { name: "Plan", description: "Pricing & subscription plans" },
    ],
    securityDefinitions: {
        BearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Enter your token as 'Bearer <TOKEN>'",
        },
    },
    security: [{ BearerAuth: [] }],
    definitions: {
        adminLoginSchema: swaggerSchemas.adminLoginSchema,
        emailSendSchema: swaggerSchemas.emailSendSchema,
        deleteUploadSchema: swaggerSchemas.deleteUploadSchema,
        createPageSchema: swaggerSchemas.createPageSchema,
        updatePageSchema: swaggerSchemas.updatePageSchema,
        querySchema: swaggerSchemas.querySchema,
        createProductSchema: swaggerSchemas.createProductSchema,
        updateProductSchema: swaggerSchemas.updateProductSchema,
        createProductHeadingSchema: swaggerSchemas.createProductHeadingSchema,
        updateProductHeadingSchema: swaggerSchemas.updateProductHeadingSchema,
        createFeatureSchema: swaggerSchemas.createFeatureSchema,
        updateFeatureSchema: swaggerSchemas.updateFeatureSchema,
        createCategorySchema: swaggerSchemas.createCategorySchema,
        updateCategorySchema: swaggerSchemas.updateCategorySchema,
        createSubcategorySchema: swaggerSchemas.createSubcategorySchema,
        updateSubcategorySchema: swaggerSchemas.updateSubcategorySchema,
        createBlogSchema: swaggerSchemas.createBlogSchema,
        updateBlogSchema: swaggerSchemas.updateBlogSchema,
        createAboutSchema: swaggerSchemas.createAboutSchema,
        updateAboutSchema: swaggerSchemas.updateAboutSchema,
        createBenefitSchema: swaggerSchemas.createBenefitSchema,
        updateBenefitSchema: swaggerSchemas.updateBenefitSchema,
        createFAQSchema: swaggerSchemas.createFAQSchema,
        updateFAQSchema: swaggerSchemas.updateFAQSchema,
        createFounderSchema: swaggerSchemas.createFounderSchema,
        updateFounderSchema: swaggerSchemas.updateFounderSchema,
        createHomeSchema: swaggerSchemas.createHomeSchema,
        updateHomeSchema: swaggerSchemas.updateHomeSchema,
        createMissionSchema: swaggerSchemas.createMissionSchema,
        updateMissionSchema: swaggerSchemas.updateMissionSchema,
        createPlanSchema: swaggerSchemas.createPlanSchema,
        updatePlanSchema: swaggerSchemas.updatePlanSchema,
        createReviewSchema: swaggerSchemas.createReviewSchema,
        updateReviewSchema: swaggerSchemas.updateReviewSchema,
        createTestimonialSchema: swaggerSchemas.createTestimonialSchema,
        updateTestimonialSchema: swaggerSchemas.updateTestimonialSchema,
        createServiceSchema: swaggerSchemas.createServiceSchema,
        updateServiceSchema: swaggerSchemas.updateServiceSchema,
        createWhyChooseSchema: swaggerSchemas.createWhyChooseSchema,
        updateWhyChooseSchema: swaggerSchemas.updateWhyChooseSchema,
    },
};

const outputFile = "./src/swagger.json";
const endpointsFiles = ["./src/routes/index.ts", "./src/validations/*.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generated successfully");
});
