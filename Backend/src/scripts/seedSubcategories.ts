import prisma from "../config/db.config";
import * as fs from "fs";
import * as path from "path";

const MAPPING_FILE = path.resolve(__dirname, "./minio_image_mapping.json");
let minioMapping: Record<string, string> = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    minioMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
  } catch {}
}

const BUMPER_ASSY_URL =
  minioMapping["bumper_assy_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056119575-bumper_assy_row_1.png";

const BUMPER_ASSY_SIDE_URL =
  minioMapping["bumper_assy_row_2.jpeg"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056120027-bumper_assy_row_2.jpeg";

const BUMPER_SHELL_URL =
  minioMapping["bumper_shell_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121191-bumper_shell_row_1.png";

const BUMPER_SHELL_SIDE_URL =
  minioMapping["bumper_shell_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121419-bumper_shell_row_2.png";

const HEADLIGHT_URL =
  minioMapping["headlight_bmw_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123162-headlight_bmw_row_2.png";

const LENS_HOUSING_URL =
  minioMapping["headlight_bmw_row_3.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123400-headlight_bmw_row_3.png";

export async function seedSubcategories() {
  console.log("🌱 Seeding Automotive Subcategories with MinIO URLs...");

  const categories = await prisma.category.findMany();
  const getCat = (name: string) =>
    categories.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const assyCat = getCat("BMW OEM Bumper Assembly");
  const shellCat = getCat("BMW OEM Bumper Shell");
  const headlightCat = getCat("Headlight OEM BMW");
  const lensCat = getCat("Lens and Housing - BMW / BENZ");

  const subcategoryData: Array<{
    categoryName: string;
    catId?: number;
    items: Array<{
      name: string;
      slug: string;
      description: string;
      image: string;
      status: string;
    }>;
  }> = [
    {
      categoryName: "BMW OEM Bumper Assembly",
      catId: assyCat?.id,
      items: [
        {
          name: "Front Bumper Assemblies",
          slug: "front-bumper-assemblies",
          description: "Complete front bumper assemblies with factory mounting brackets, grilles, and sensor brackets.",
          image: BUMPER_ASSY_URL,
          status: "ACTIVE",
        },
        {
          name: "Rear Bumper Assemblies",
          slug: "rear-bumper-assemblies",
          description: "Complete rear bumper assemblies including lower diffusers and towing eye caps.",
          image: BUMPER_ASSY_SIDE_URL,
          status: "ACTIVE",
        },
        {
          name: "M Sport & Performance Bumpers",
          slug: "m-sport-bumpers",
          description: "Original OEM BMW M Sport and M-Tech complete aerodynamic bumper assemblies.",
          image: BUMPER_ASSY_URL,
          status: "ACTIVE",
        },
      ],
    },
    {
      categoryName: "BMW OEM Bumper Shell",
      catId: shellCat?.id,
      items: [
        {
          name: "Front Bumper Covers & Skins",
          slug: "front-bumper-covers",
          description: "Genuine OEM front primed bumper covers ready for prep and paint.",
          image: BUMPER_SHELL_URL,
          status: "ACTIVE",
        },
        {
          name: "Rear Bumper Covers & Skins",
          slug: "rear-bumper-covers",
          description: "Original rear bumper fascias with factory park distance sensor cutouts.",
          image: BUMPER_SHELL_SIDE_URL,
          status: "ACTIVE",
        },
      ],
    },
    {
      categoryName: "Headlight OEM BMW",
      catId: headlightCat?.id,
      items: [
        {
          name: "Adaptive LED Headlights",
          slug: "adaptive-led-headlights",
          description: "Complete intelligent matrix LED adaptive headlamp units.",
          image: HEADLIGHT_URL,
          status: "ACTIVE",
        },
        {
          name: "Laser Headlights",
          slug: "laser-headlights",
          description: "OEM BMW Laserlicht long-range optical headlight assemblies.",
          image: HEADLIGHT_URL,
          status: "ACTIVE",
        },
        {
          name: "Bi-Xenon Headlights",
          slug: "bi-xenon-headlights",
          description: "Original equipment high-intensity discharge Xenon headlamp systems.",
          image: HEADLIGHT_URL,
          status: "ACTIVE",
        },
      ],
    },
    {
      categoryName: "Lens and Housing - BMW / BENZ",
      catId: lensCat?.id,
      items: [
        {
          name: "Replacement Headlight Lenses",
          slug: "headlight-lenses",
          description: "Precision-molded polycarbonate clear outer lenses with UV protective hardcoat.",
          image: LENS_HOUSING_URL,
          status: "ACTIVE",
        },
        {
          name: "Headlamp Housing Shells",
          slug: "headlamp-housings",
          description: "Durable rear casing housings, internal brackets, and mounting tab repair units.",
          image: LENS_HOUSING_URL,
          status: "ACTIVE",
        },
      ],
    },
  ];

  for (const group of subcategoryData) {
    if (!group.catId) {
      console.warn(`Category "${group.categoryName}" not found. Skipping subcategories.`);
      continue;
    }

    for (const item of group.items) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: group.catId,
            name: item.name,
          },
        },
        create: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          image: item.image,
          status: item.status,
          categoryId: group.catId,
        },
        update: {
          slug: item.slug,
          description: item.description,
          image: item.image,
          status: item.status,
        },
      });
      console.log(`Subcategory "${item.name}" -> Category "${group.categoryName}"`);
    }
  }

  console.log("✅ Automotive subcategories successfully seeded with MinIO URLs!");
}

if (require.main === module) {
  seedSubcategories()
    .catch((e) => {
      console.error("Seed subcategories error:", e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
