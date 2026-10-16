import prisma from "../config/db.config";

export async function seedSubcategories() {
  console.log("🌱 Seeding Subcategories...");

  // Find categories
  const categories = await prisma.category.findMany();
  const getCat = (name: string) =>
    categories.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const archHardware = getCat("Architectural Hardware");
  const glassFittings = getCat("Glass Fittings");
  const doorLocks = getCat("Door Locks");
  const waterPurifiers = getCat("Water Purifiers");

  const subcategoryData: Array<{
    categoryName: string;
    catId?: number;
    items: Array<{
      name: string;
      slug: string;
      description: string;
      image: string;
      status: string;
      productTitles: string[];
    }>;
  }> = [
    {
      categoryName: "Architectural Hardware",
      catId: archHardware?.id,
      items: [
        {
          name: "Door Handles & Pulls",
          slug: "door-handles-and-pulls",
          description: "Designer pull handles, mortise handles, and luxury lever handles for wooden and metal doors.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [
            "Stainless Steel Door Handle",
            "Prestige Lever Handle",
            "Grip Series Pull Handle",
          ],
        },
        {
          name: "Door Hinges & Closers",
          slug: "door-hinges-and-closers",
          description: "Concealed hinges, heavy-duty ball bearing hinges, and hydraulic automatic door closers.",
          image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Architectural Fittings",
          slug: "architectural-fittings",
          description: "Tower bolts, magnetic door stoppers, safety chains, and architectural brass accessories.",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Cabinet Handles & Knobs",
          slug: "cabinet-handles-and-knobs",
          description: "Modern kitchen cabinet handles, wardrobe pull handles, and minimalist drawer knobs in brass and matte finishes.",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Sliding & Folding Door Hardware",
          slug: "sliding-and-folding-door-hardware",
          description: "Heavy duty tracks, synchronous sliding rollers, and soft-close mechanisms for wooden interior doors.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Door Controls & Drop Seals",
          slug: "door-controls-and-drop-seals",
          description: "Concealed acoustic drop-down seals, magnetic door stoppers, and floor-mounted buffer hardware.",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Panic Exit & Fire Hardware",
          slug: "panic-exit-and-fire-hardware",
          description: "UL-certified panic crash bars, fire-rated door coordinators, and emergency escape hardware for commercial spaces.",
          image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
      ],
    },
    {
      categoryName: "Glass Fittings",
      catId: glassFittings?.id,
      items: [
        {
          name: "Patch Fittings & Connectors",
          slug: "patch-fittings-and-connectors",
          description: "Precision engineered stainless steel patch fittings and pivot sets for frameless glass doors.",
          image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: ["Patch Fitting", "Frameless Patch Fitting Set"],
        },
        {
          name: "Sliding Systems & Railing",
          slug: "sliding-systems-and-railing",
          description: "Smooth glide top-hung sliding glass rail systems and shower enclosure hinges.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: ["Glide Pro Sliding System", "Glass Door Hinge"],
        },
        {
          name: "Spider & Curtain Wall Fittings",
          slug: "spider-curtain-wall-fittings",
          description: "Heavy duty stainless steel spider brackets and routels for exterior glass facades.",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
      ],
    },
    {
      categoryName: "Door Locks",
      catId: doorLocks?.id,
      items: [
        {
          name: "Smart & Digital Locks",
          slug: "smart-digital-locks",
          description: "Fingerprint, RFID card, passcode, and mobile app-enabled keyless smart door locks.",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: ["Digital Door Lock", "Smart Lock Pro"],
        },
        {
          name: "Mechanical Mortise Locks",
          slug: "mechanical-mortise-locks",
          description: "High security mortise sashlocks, deadbolts, and euro profile brass cylinder locksets.",
          image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Padlocks & Rim Locks",
          slug: "padlocks-rim-locks",
          description: "Hardened steel weatherproof padlocks and surface rim night latch locks.",
          image: "https://images.unsplash.com/photo-1510519138195-068d82f8d487?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
      ],
    },
    {
      categoryName: "Water Purifiers",
      catId: waterPurifiers?.id,
      items: [
        {
          name: "Domestic RO Systems",
          slug: "domestic-ro-systems",
          description: "Advanced multi-stage RO, UV, and alkaline antioxidant drinking water purifiers for homes.",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: ["RO Water Purifier", "Aqua Pure RO System"],
        },
        {
          name: "Commercial & Industrial RO",
          slug: "commercial-industrial-ro",
          description: "High-capacity commercial purification plants, stainless steel water dispensers and coolers.",
          image: "https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
        {
          name: "Filters & Purification Spares",
          slug: "filters-and-spares",
          description: "Sediment spun filters, activated carbon cartridges, RO membranes, and UV lamps.",
          image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80",
          status: "ACTIVE",
          productTitles: [],
        },
      ],
    },
  ];

  let createdCount = 0;
  let linkedProductCount = 0;

  for (const group of subcategoryData) {
    if (!group.catId) {
      console.warn(`Category "${group.categoryName}" not found in database. Skipping.`);
      continue;
    }

    for (const item of group.items) {
      const existing = await prisma.subcategory.findUnique({
        where: {
          categoryId_name: {
            categoryId: group.catId,
            name: item.name,
          },
        },
      });

      let subcategory;
      if (existing) {
        subcategory = await prisma.subcategory.update({
          where: { id: existing.id },
          data: {
            slug: item.slug,
            description: item.description,
            image: item.image,
            status: item.status,
          },
        });
        console.log(`Updated subcategory: ${item.name} (Cat ID: ${group.catId})`);
      } else {
        subcategory = await prisma.subcategory.create({
          data: {
            name: item.name,
            categoryId: group.catId,
            slug: item.slug,
            description: item.description,
            image: item.image,
            status: item.status,
          },
        });
        createdCount++;
        console.log(`Created subcategory: ${item.name} (Cat ID: ${group.catId})`);
      }

      // Link products to this subcategory
      if (item.productTitles.length > 0) {
        for (const title of item.productTitles) {
          const prod = await prisma.product.findFirst({
            where: {
              title: {
                contains: title,
                mode: "insensitive",
              },
            },
          });
          if (prod) {
            await prisma.product.update({
              where: { id: prod.id },
              data: {
                subcategoryId: subcategory.id,
                categoryId: group.catId, // ensure matching category
              },
            });
            linkedProductCount++;
            console.log(`  -> Linked product "${prod.title}" to subcategory "${subcategory.name}"`);
          }
        }
      }
    }
  }

  console.log(`✅ Finished seeding! Added/Updated subcategories. Linked ${linkedProductCount} products.`);
}

if (require.main === module) {
  seedSubcategories()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
