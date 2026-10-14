import prisma from "../config/db.config";

async function seedBanners() {
  console.log("Seeding automotive catalogue banners...");

  // Remove old banners and replace with automotive replacement parts banners
  await (prisma as any).banner.deleteMany({});

  const automotiveBanners = [
    {
      bgMediaType: "IMAGE",
      bgMedia: "/uploads/products/bumper_assy_row_1.png",
      label: "GENUINE OEM REPLACEMENT PARTS",
      heading: "OEM Automotive Body Panels. Precision Fitment.",
      description: "Complete bumper assemblies, LED headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover. 100% VIN-verified compatibility.",
      textAlignment: "LEFT",
      primaryBtnText: "Browse Catalogue",
      primaryBtnLink: "/products",
      secondaryBtnText: "Request a Quote (RFQ)",
      secondaryBtnLink: "/contact-us",
      sideImage: "/images/automotive/collection.jpg",
      sideImagePosition: "RIGHT",
      sequence: 1,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: "/uploads/products/headlight_bmw_row_2.png",
      label: "LIGHTING & OPTICAL COMPONENTS",
      heading: "OEM Headlights & Lenses. Factory Assurance.",
      description: "Authentic Halogen, Xenon, Adaptive LED headlamps and UV-coated polycarbonate lens housings engineered for seamless collision repair.",
      textAlignment: "LEFT",
      primaryBtnText: "Explore Headlights",
      primaryBtnLink: "/products?categoryId=3",
      secondaryBtnText: "Contact Support",
      secondaryBtnLink: "/contact-us",
      sideImage: "/uploads/products/headlight_bmw_row_3.png",
      sideImagePosition: "RIGHT",
      sequence: 2,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: "/images/automotive/workshop.jpg",
      label: "BODY SHOPS & COLLISION CENTERS (B2B)",
      heading: "Fast Dispatch. Dedicated B2B Automotive Supply.",
      description: "Direct supply of genuine plastic panels and lighting components to repair centers and body shops with comprehensive condition documentation.",
      textAlignment: "CENTER",
      primaryBtnText: "B2B Cooperation",
      primaryBtnLink: "/contact-us",
      secondaryBtnText: "View Parts Catalogue",
      secondaryBtnLink: "/products",
      sideImage: null,
      sideImagePosition: "RIGHT",
      sequence: 3,
      isActive: true,
    },
  ];

  for (const banner of automotiveBanners) {
    await (prisma as any).banner.create({
      data: banner,
    });
  }

  console.log("Successfully seeded 3 automotive catalogue banners!");
}

seedBanners()
  .catch((e) => {
    console.error("Seed banners error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
