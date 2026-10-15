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

const HEADLIGHT_URL =
  minioMapping["headlight_bmw_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123162-headlight_bmw_row_2.png";

const LENS_HOUSING_URL =
  minioMapping["headlight_bmw_row_3.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123400-headlight_bmw_row_3.png";

const BUMPER_SHELL_URL =
  minioMapping["bumper_shell_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121191-bumper_shell_row_1.png";

const BUMPER_SHELL_SIDE_URL =
  minioMapping["bumper_shell_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121419-bumper_shell_row_2.png";

export async function seedBanners() {
  console.log("Seeding automotive catalogue banners with MinIO URLs...");

  // Remove old banners and replace with automotive replacement parts banners
  await (prisma as any).banner.deleteMany({});

  const automotiveBanners = [
    {
      bgMediaType: "IMAGE",
      bgMedia: BUMPER_ASSY_URL,
      label: "GENUINE OEM REPLACEMENT PARTS",
      heading: "OEM Automotive Body Panels. Precision Fitment.",
      description: "Complete bumper assemblies, LED headlights, lenses, and housings for BMW, Mercedes-Benz, Audi, and Range Rover. 100% VIN-verified compatibility.",
      textAlignment: "LEFT",
      primaryBtnText: "Browse Catalogue",
      primaryBtnLink: "/products",
      secondaryBtnText: "Request a Quote (RFQ)",
      secondaryBtnLink: "/contact-us",
      sideImage: BUMPER_ASSY_SIDE_URL,
      sideImagePosition: "RIGHT",
      sequence: 1,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: HEADLIGHT_URL,
      label: "LIGHTING & OPTICAL COMPONENTS",
      heading: "OEM Headlights & Lenses. Factory Assurance.",
      description: "Authentic Halogen, Xenon, Adaptive LED headlamps and UV-coated polycarbonate lens housings engineered for seamless collision repair.",
      textAlignment: "LEFT",
      primaryBtnText: "Explore Headlights",
      primaryBtnLink: "/products",
      secondaryBtnText: "Contact Support",
      secondaryBtnLink: "/contact-us",
      sideImage: LENS_HOUSING_URL,
      sideImagePosition: "RIGHT",
      sequence: 2,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: BUMPER_SHELL_URL,
      label: "BODY SHOPS & COLLISION CENTERS (B2B)",
      heading: "Fast Dispatch. Dedicated B2B Automotive Supply.",
      description: "Direct supply of genuine plastic panels and lighting components to repair centers and body shops with comprehensive condition documentation.",
      textAlignment: "CENTER",
      primaryBtnText: "B2B Cooperation",
      primaryBtnLink: "/contact-us",
      secondaryBtnText: "View Parts Catalogue",
      secondaryBtnLink: "/products",
      sideImage: BUMPER_SHELL_SIDE_URL,
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

  console.log("Successfully seeded 3 automotive catalogue banners with MinIO URLs!");
}

if (require.main === module) {
  seedBanners()
    .catch((e) => {
      console.error("Seed banners error:", e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
