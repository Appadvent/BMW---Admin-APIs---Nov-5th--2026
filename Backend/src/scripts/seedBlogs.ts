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

const HEADLIGHT_URL =
  minioMapping["headlight_bmw_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123162-headlight_bmw_row_2.png";

const BUMPER_SHELL_URL =
  minioMapping["bumper_shell_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121191-bumper_shell_row_1.png";

const LENS_HOUSING_URL =
  minioMapping["headlight_bmw_row_3.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123400-headlight_bmw_row_3.png";

export async function seedBlogs() {
  console.log("Seeding 4 Automotive OEM Media Posts into Blog table with MinIO URLs...");

  // Clear existing blogs
  await (prisma as any).blog.deleteMany({});

  const mediaPosts = [
    {
      title: "Genuine OEM vs. Aftermarket Body Panels: What Collision Repair Centers Need to Know",
      description: `In high-end automotive collision repair, precision is non-negotiable. Modern luxury marques like BMW, Mercedes-Benz, and Audi engineer their exterior components using proprietary thermoplastic polyolefin (TPO) and polycarbonate composites. 

While aftermarket replica bumper assemblies and shells may appear visually similar, subtle dimensional variances of even 1-2 millimeters can cause misaligned shut lines, improper radar cruise calibration, and failing ultrasonic park assist (PDC) sensors.

Our distribution centre supplies only verified OEM bumper assemblies and structural fascias complete with intact mounting brackets, washer nozzle provisions, and original factory markings. Every component is cross-referenced with the vehicle's unique 17-digit VIN before dispatch, guaranteeing flawless installation for professional workshops.`,
      image: BUMPER_ASSY_URL,
      author: "Technical Logistics Division",
      publishedDate: new Date(),
    },
    {
      title: "Adaptive LED & Laser Headlight Technologies: Structural Anatomy and Replacement Protocols",
      description: `Automotive lighting has transformed from simple illumination into sophisticated optical computing systems. Contemporary BMW Adaptive LED and Laserlicht headlamps feature multi-element matrix beam modules, stepper motor actuators, and integrated cooling channels.

When vehicle front-ends sustain impact, headlights frequently suffer fractured mounting ears, cracked housing seals, or shattered front lenses. Repair facilities must verify whether internal optical arrays remain calibrated or whether complete headlamp replacement is mandated.

We maintain a curated inventory of genuine OEM headlamp units and UV-hardcoated replacement lenses. Our technician team inspects mounting geometry, lens clarity, and electrical pin connectors to ensure workshops receive plug-and-play lighting solutions with zero coding complications.`,
      image: HEADLIGHT_URL,
      author: "Lighting Systems Specialist",
      publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Streamlining B2B Parts Procurement for European Body Shops & Collision Specialists",
      description: `Workshop turnaround times directly impact repair shop profitability and insurance claim cycle efficiency. Waiting weeks for oversized body panels or receiving parts with damaged mounting tabs creates severe scheduling bottlenecks.

To solve this, our B2B procurement network offers dedicated Request for Quotation (RFQ) processing with 24-hour response times. Workshops can submit part numbers or vehicle VINs via our streamlined web portal, receiving verified condition reports, high-resolution photography, and guaranteed delivery estimates.

All bumpers, fascias, and optical housings are protected in custom shock-absorbing automotive transit crating, preventing shipping deformation and ensuring components arrive ready for preparation, painting, and fitting.`,
      image: BUMPER_SHELL_URL,
      author: "B2B Workshop Services",
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Extending Automotive Component Lifecycles: High-Grade Lens Replacement & Housing Restoration",
      description: `Replacing an entire high-specification matrix LED headlamp assembly can cost thousands of euros when only the polycarbonate outer cover has experienced stone chipping, oxidation, or cosmetic scratching.

Modern automotive restoration standards now support professional headlamp de-lensing and re-sealing using factory-grade butyl adhesives and precision-molded polycarbonate replacement lenses.

Our inventory includes precision-matched left and right outer lenses and internal housing shells engineered for BMW F-Series, G-Series, and Mercedes-Benz E-Class/C-Class models. Featuring anti-UV surface hardcoats and optical-grade transparency, these replacement lenses restore factory light distribution and beam throw at a fraction of the cost of new complete units.`,
      image: LENS_HOUSING_URL,
      author: "Restoration & Materials Team",
      publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of mediaPosts) {
    await (prisma as any).blog.create({
      data: post,
    });
  }

  console.log("Successfully seeded 4 Automotive OEM Media Posts with MinIO URLs!");
}

if (require.main === module) {
  seedBlogs()
    .catch((e) => {
      console.error("Seed blogs error:", e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
