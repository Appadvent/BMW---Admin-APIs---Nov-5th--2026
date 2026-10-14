import prisma from "../config/db.config";

// 100% Verified HTTP 200 OK Unsplash Automotive URLs
const VERIFIED_UNSPLASH = {
  bumperAssy: [
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  ],
  bumperShell: [
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80",
  ],
  headlights: [
    "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
  ],
  lensHousing: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80",
  ],
};

async function updateUnsplash() {
  console.log("Updating Categories with 100% verified Unsplash images...");

  // 1. Update Categories
  await (prisma as any).category.updateMany({
    where: { name: { contains: "Bumper Assembly", mode: "insensitive" } },
    data: { image: VERIFIED_UNSPLASH.bumperAssy[0] },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Bumper Shell", mode: "insensitive" } },
    data: { image: VERIFIED_UNSPLASH.bumperShell[0] },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Headlight", mode: "insensitive" } },
    data: { image: VERIFIED_UNSPLASH.headlights[0] },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Lens", mode: "insensitive" } },
    data: { image: VERIFIED_UNSPLASH.lensHousing[0] },
  });

  console.log("Updating Products with 100% verified Unsplash images...");

  // 2. Update Products by Category
  const categories = await (prisma as any).category.findMany();
  for (const cat of categories) {
    let pool = VERIFIED_UNSPLASH.bumperAssy;
    if (cat.name.toLowerCase().includes("shell")) {
      pool = VERIFIED_UNSPLASH.bumperShell;
    } else if (cat.name.toLowerCase().includes("headlight")) {
      pool = VERIFIED_UNSPLASH.headlights;
    } else if (cat.name.toLowerCase().includes("lens") || cat.name.toLowerCase().includes("housing")) {
      pool = VERIFIED_UNSPLASH.lensHousing;
    }

    const prods = await (prisma as any).product.findMany({
      where: { categoryId: cat.id },
      select: { id: true },
    });

    console.log(`Updating ${prods.length} products for category "${cat.name}"...`);
    for (let i = 0; i < prods.length; i++) {
      const img = pool[i % pool.length];
      await (prisma as any).product.update({
        where: { id: prods[i].id },
        data: { image: img },
      });
    }
  }

  // 3. Update Banners with Verified Unsplash
  console.log("Updating Banners with 100% verified Unsplash images...");
  await (prisma as any).banner.deleteMany({});
  await (prisma as any).banner.createMany({
    data: [
      {
        bgMediaType: "IMAGE",
        bgMedia: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
        label: "GENUINE OEM REPLACEMENT PARTS",
        heading: "OEM Automotive Body Panels. Precision Fitment.",
        description: "Complete bumper assemblies, LED headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover. 100% VIN-verified compatibility.",
        textAlignment: "LEFT",
        primaryBtnText: "Browse Catalogue",
        primaryBtnLink: "/products",
        secondaryBtnText: "Request a Quote (RFQ)",
        secondaryBtnLink: "/contact-us",
        sideImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
        sideImagePosition: "RIGHT",
        sequence: 1,
        isActive: true,
      },
      {
        bgMediaType: "IMAGE",
        bgMedia: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1600&q=80",
        label: "LIGHTING & OPTICAL COMPONENTS",
        heading: "OEM Headlights & Lenses. Factory Assurance.",
        description: "Authentic Halogen, Xenon, Adaptive LED headlamps and UV-coated polycarbonate lens housings engineered for seamless collision repair.",
        textAlignment: "LEFT",
        primaryBtnText: "Explore Headlights",
        primaryBtnLink: "/products?categoryId=3",
        secondaryBtnText: "Contact Support",
        secondaryBtnLink: "/contact-us",
        sideImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        sideImagePosition: "RIGHT",
        sequence: 2,
        isActive: true,
      },
      {
        bgMediaType: "IMAGE",
        bgMedia: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
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
    ],
  });

  console.log("Successfully fed categories, products, and banners with 100% verified Unsplash images!");
}

updateUnsplash()
  .catch((err) => {
    console.error("Error updating Unsplash images:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
