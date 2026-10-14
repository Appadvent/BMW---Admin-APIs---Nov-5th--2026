import prisma from "../config/db.config";
import { initRootAdmin } from "../utils/initRootAdmin";

export async function clearAllData() {
  console.log("==================================================");
  console.log("🗑️  Deleting all database content...");
  console.log("==================================================");

  try {
    // Execute deletion in reverse foreign-key dependency order
    await prisma.$transaction([
      // 1. About Module
      prisma.aboutSectionItem.deleteMany(),
      prisma.aboutSection.deleteMany(),
      prisma.aboutItem.deleteMany(),
      prisma.about.deleteMany(),

      // 2. Products & Features & Categories & Subcategories
      prisma.feature.deleteMany(),
      prisma.specification.deleteMany(),
      prisma.product.deleteMany(),
      prisma.blog.deleteMany(),
      prisma.subcategory.deleteMany(),
      prisma.category.deleteMany(),
      prisma.productHeading.deleteMany(),

      // 3. Testimonials & Reviews
      prisma.testimonial.deleteMany(),
      prisma.reviews.deleteMany(),

      // 4. Services
      prisma.serviceItem.deleteMany(),
      prisma.service.deleteMany(),

      // 5. Mission & Vision
      prisma.missionVisionItem.deleteMany(),
      prisma.missionVision.deleteMany(),

      // 6. Why Choose Us
      prisma.whyChooseItem.deleteMany(),
      prisma.whyChoose.deleteMany(),

      // 7. Benefits
      prisma.benefitItem.deleteMany(),
      prisma.benefit.deleteMany(),

      // 8. FAQ
      prisma.fAQItem.deleteMany(),
      prisma.fAQSection.deleteMany(),

      // 9. Plans
      prisma.planFeature.deleteMany(),
      prisma.plan.deleteMany(),

      // 10. Other Pages & Contact & Home & Founder
      prisma.home.deleteMany(),
      prisma.founder.deleteMany(),
      prisma.contact.deleteMany(),
      prisma.pages.deleteMany(),

      // 11. Banners
      (prisma as any).banner.deleteMany(),
    ]);

    console.log("✅ All data deleted successfully!");

    // Ensure root admin is present
    await initRootAdmin();
    console.log("👤 Root admin verified/ready.");
    console.log("==================================================");
  } catch (error: any) {
    console.error("❌ Error deleting data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  clearAllData()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
