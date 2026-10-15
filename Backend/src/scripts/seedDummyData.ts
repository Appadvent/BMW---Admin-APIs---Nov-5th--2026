import prisma from "../config/db.config";
import * as fs from "fs";
import * as path from "path";
import { seedAutomotiveCatalog } from "./seedAutomotiveCatalog";
import { seedSubcategories } from "./seedSubcategories";
import { seedBanners } from "./seedBanners";
import { seedBlogs } from "./seedBlogs";

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

const BUMPER_SHELL_URL =
  minioMapping["bumper_shell_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121191-bumper_shell_row_1.png";

const HEADLIGHT_URL =
  minioMapping["headlight_bmw_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123162-headlight_bmw_row_2.png";

const LENS_HOUSING_URL =
  minioMapping["headlight_bmw_row_3.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123400-headlight_bmw_row_3.png";

async function main() {
  console.log("==================================================");
  console.log("🚗 Seeding Automotive OEM Catalogue & Dynamic Data...");
  console.log("==================================================");

  // 1. Seed About Us Section
  console.log("\n1. Seeding Automotive About Us Module...");
  const aboutData = {
    badge: "ABOUT OUR OEM SUPPLY",
    title: "Precision Engineering & OEM Reliability For European Vehicles.",
    subtitle:
      "Specialized B2B supplier of genuine OEM bumper assemblies, bumper shells, adaptive headlights, and optical polycarbonate lenses for BMW, Mercedes-Benz, and premium European marques.",
    description:
      "We partner directly with certified collision repair facilities, bodyshop networks, and independent specialists across Europe and global markets. Every single component in our inventory is inspected against 17-digit vehicle VINs to guarantee 100% factory fitment, sensor compatibility, and structural integrity.",
    content:
      "All bumper fascias, matrix LED headlamps, and replacement lens assemblies are stored in climate-controlled automotive distribution hubs and packed in high-density shock-absorbing crating to eliminate transit deformation.",
    image: BUMPER_ASSY_URL,
    image2: HEADLIGHT_URL,
    videoUrl: "",
    layout: "image-left",
    itemsLayout: "grid",
    alignment: "left",
    ctaEnabled: true,
    ctaText: "Browse Catalogue",
    ctaLink: "/products",
    ctaTarget: "_self",
    isActive: true,
    titleOne: "Precision Engineering & OEM Reliability For European Vehicles.",
    titleTwo: "Guaranteed VIN-Matched Fitment & 24h RFQ Response.",
    descriptionOne:
      "Comprehensive catalogue of factory bumper assemblies, primed shells, and optical lighting components direct from verified European OEM supply channels.",
    descriptionTwo:
      "Dedicated B2B procurement portal with guaranteed dispatch within 48 hours and complete pre-shipment photographic verification.",
  };

  const existingAbout = await prisma.about.findFirst();
  const aboutItems = [
    {
      title: "100% OEM Compatibility",
      description: "Direct replacement matching factory part numbers, mounting points, and crash structure tolerances.",
      icon: "Award",
      link: "/products",
      order: 1,
      isActive: true,
    },
    {
      title: "Adaptive Lighting Specialist",
      description: "Matrix LED, Laser, and Bi-Xenon systems with pristine internal electronics and optical alignment.",
      icon: "Zap",
      link: "/products",
      order: 2,
      isActive: true,
    },
    {
      title: "Extensive In-Stock Inventory",
      description: "Complete catalogue across BMW 1-8 Series, X-Series, and Mercedes-Benz C/E/S-Class models.",
      icon: "LayoutGrid",
      link: "/products",
      order: 3,
      isActive: true,
    },
    {
      title: "Dedicated B2B Support",
      description: "Fast Request for Quotation (RFQ) turnaround, VIN verification, and professional workshop shipping.",
      icon: "Users",
      link: "/contact-us",
      order: 4,
      isActive: true,
    },
  ];

  if (!existingAbout) {
    await prisma.about.create({
      data: {
        ...aboutData,
        items: {
          create: aboutItems,
        },
      },
    });
    console.log("Created Automotive About Us Section");
  } else {
    await prisma.aboutItem.deleteMany({
      where: { aboutId: existingAbout.id },
    });
    await prisma.about.update({
      where: { id: existingAbout.id },
      data: {
        ...aboutData,
        items: {
          create: aboutItems,
        },
      },
    });
    console.log("Updated Automotive About Us Section");
  }

  // 2. Seed Automotive Categories & Products from Excel with MinIO URLs
  console.log("\n2. Seeding Automotive Products & Categories...");
  await seedAutomotiveCatalog();

  // 3. Seed Automotive Subcategories
  console.log("\n3. Seeding Automotive Subcategories...");
  await seedSubcategories();

  // 4. Seed Testimonials (Automotive Collision Workshops & Fleet Managers)
  console.log("\n4. Seeding Automotive Testimonials...");
  await prisma.testimonial.deleteMany({});

  const testimonialsData = [
    {
      name: "Marcus Weber",
      designation: "Lead Collision Specialist, AutoTech Karosseriebau (Munich)",
      message:
        "The BMW F30 and G20 bumper assemblies arrived in immaculate condition. Every mounting tab and PDC sensor bracket was 100% aligned with factory body points, saving our workshop hours of adjustment.",
      image: "https://minioapi.appadvent.in/i-mag/testimonials/1791277217117-Rajan_Mehta.jpg",
    },
    {
      name: "Jean-Pierre Laurent",
      designation: "Procurement Director, EuroCar Bodyshop Network",
      message:
        "Their VIN-based verification process is a lifesaver. Sourcing Adaptive LED headlights for luxury European vehicles used to carry huge return risks — with them, every unit codes and calibrates on the first attempt.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Tomasz Kowalski",
      designation: "Workshop Manager, Silesia Body & Paint Center",
      message:
        "Fast dispatch and reliable crating make them our primary replacement parts supplier. The UV-coated replacement headlamp lenses have allowed us to offer high-margin, OEM-quality restorations.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Christian Becker",
      designation: "Fleet Logistics & Repair Specialist, Berlin",
      message:
        "Outstanding part documentation, clear condition reports, and genuine OEM shells. In commercial fleet repair, turnaround time is everything, and their 24h RFQ turnaround keeps our bays moving.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
  ];

  for (const t of testimonialsData) {
    const created = await prisma.testimonial.create({ data: t });
    console.log(`Created Automotive Testimonial: "${created.name}" (ID: ${created.id})`);
  }

  // 5. Seed Banners with MinIO URLs
  console.log("\n5. Seeding Automotive Banners...");
  await seedBanners();

  // 6. Seed Blogs with MinIO URLs
  console.log("\n6. Seeding Automotive Media Posts...");
  await seedBlogs();

  console.log("\n✅ All automotive seeder data successfully seeded with MinIO URLs!");
}

main()
  .catch((e) => {
    console.error("Error seeding dummy data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
