import * as fs from "fs";
import * as path from "path";
import prisma from "../config/db.config";
import { minioClient, BUCKET_NAME, getMinioPublicUrl } from "../config/minio.config";

const PRODUCTS_DIR = path.resolve(__dirname, "../../../Frontend/public/uploads/products");
const MAPPING_FILE = path.resolve(__dirname, "./minio_image_mapping.json");

// Helper to determine mime type
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function uploadSingleFile(filename: string): Promise<string> {
  const filePath = path.join(PRODUCTS_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `products/${Date.now()}-${sanitizedName}`;

  const metaData = {
    "Content-Type": getMimeType(filename),
  };

  await minioClient.putObject(
    BUCKET_NAME,
    objectKey,
    buffer,
    buffer.length,
    metaData
  );

  return getMinioPublicUrl(objectKey);
}

async function uploadAllImages() {
  console.log("Reading product images from:", PRODUCTS_DIR);
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
  });

  console.log(`Found ${files.length} images to upload to MinIO.`);

  // Load existing mapping if any
  let mapping: Record<string, string> = {};
  if (fs.existsSync(MAPPING_FILE)) {
    try {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
      console.log(`Loaded ${Object.keys(mapping).length} pre-existing mapped images.`);
    } catch {
      mapping = {};
    }
  }

  // Upload in batches of 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (filename) => {
        if (mapping[filename]) {
          return; // already uploaded
        }
        try {
          const url = await uploadSingleFile(filename);
          mapping[filename] = url;
          console.log(`[${Object.keys(mapping).length}/${files.length}] Uploaded: ${filename}`);
        } catch (err) {
          console.error(`Failed to upload ${filename}:`, err);
        }
      })
    );
    // Persist progress
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), "utf-8");
  }

  console.log(`All ${Object.keys(mapping).length} images uploaded and mapped!`);

  // Default fallback URLs from mapping
  const bumperAssyDefault =
    mapping["bumper_assy_row_1.png"] ||
    mapping["bumper_assy_row_1.jpeg"] ||
    Object.values(mapping)[0];

  const bumperShellDefault =
    mapping["bumper_shell_row_1.png"] ||
    mapping["bumper_shell_row_1.jpeg"] ||
    bumperAssyDefault;

  const headlightDefault =
    mapping["headlight_bmw_row_2.png"] ||
    mapping["headlight_bmw_row_10.png"] ||
    bumperAssyDefault;

  const lensHousingDefault =
    mapping["headlight_bmw_row_3.png"] ||
    mapping["headlight_bmw_row_11.png"] ||
    headlightDefault;

  // 1. Update Categories
  console.log("Updating Categories with MinIO URLs...");
  await (prisma as any).category.updateMany({
    where: { name: { contains: "Bumper Assembly", mode: "insensitive" } },
    data: { image: bumperAssyDefault },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Bumper Shell", mode: "insensitive" } },
    data: { image: bumperShellDefault },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Headlight", mode: "insensitive" } },
    data: { image: headlightDefault },
  });

  await (prisma as any).category.updateMany({
    where: { name: { contains: "Lens", mode: "insensitive" } },
    data: { image: lensHousingDefault },
  });

  // 2. Update Products
  console.log("Updating Products with MinIO URLs...");
  const categories = await (prisma as any).category.findMany();
  for (const cat of categories) {
    let prefix = "bumper_assy";
    let defaultUrl = bumperAssyDefault;

    if (cat.name.toLowerCase().includes("shell")) {
      prefix = "bumper_shell";
      defaultUrl = bumperShellDefault;
    } else if (cat.name.toLowerCase().includes("headlight")) {
      prefix = "headlight_bmw";
      defaultUrl = headlightDefault;
    } else if (cat.name.toLowerCase().includes("lens") || cat.name.toLowerCase().includes("housing")) {
      prefix = "headlight_bmw"; // or lens default
      defaultUrl = lensHousingDefault;
    }

    const prods = await (prisma as any).product.findMany({
      where: { categoryId: cat.id },
      select: { id: true },
      orderBy: { id: "asc" },
    });

    console.log(`Assigning MinIO URLs to ${prods.length} products in "${cat.name}"...`);
    for (let idx = 0; idx < prods.length; idx++) {
      const rowIdx = idx + 1;
      let matchedUrl: string | undefined = undefined;

      // Look for row-specific image
      for (const ext of [".png", ".jpeg", ".jpg", ".webp"]) {
        const key = `${prefix}_row_${rowIdx}${ext}`;
        if (mapping[key]) {
          matchedUrl = mapping[key];
          break;
        }
      }

      // If not found, look for general prefix image or default
      if (!matchedUrl) {
        matchedUrl = defaultUrl;
      }

      await (prisma as any).product.update({
        where: { id: prods[idx].id },
        data: { image: matchedUrl },
      });
    }
  }

  // 3. Create 4 Automotive OEM Media Posts (Blogs)
  console.log("Creating 4 Automotive OEM Media Posts in Blog table...");
  await (prisma as any).blog.deleteMany({});

  const mediaPosts = [
    {
      title: "Genuine OEM vs. Aftermarket Body Panels: What Collision Repair Centers Need to Know",
      description: `In high-end automotive collision repair, precision is non-negotiable. Modern luxury marques like BMW, Mercedes-Benz, and Audi engineer their exterior components using proprietary thermoplastic polyolefin (TPO) and polycarbonate composites. 

While aftermarket replica bumper assemblies and shells may appear visually similar, subtle dimensional variances of even 1-2 millimeters can cause misaligned shut lines, improper radar cruise calibration, and failing ultrasonic park assist (PDC) sensors.

Our distribution centre supplies only verified OEM bumper assemblies and structural fascias complete with intact mounting brackets, washer nozzle provisions, and original factory markings. Every component is cross-referenced with the vehicle's unique 17-digit VIN before dispatch, guaranteeing flawless installation for professional workshops.`,
      image: bumperAssyDefault,
      author: "Technical Logistics Division",
      publishedDate: new Date(),
    },
    {
      title: "Adaptive LED & Laser Headlight Technologies: Structural Anatomy and Replacement Protocols",
      description: `Automotive lighting has transformed from simple illumination into sophisticated optical computing systems. Contemporary BMW Adaptive LED and Laserlicht headlamps feature multi-element matrix beam modules, stepper motor actuators, and integrated cooling channels.

When vehicle front-ends sustain impact, headlights frequently suffer fractured mounting ears, cracked housing seals, or shattered front lenses. Repair facilities must verify whether internal optical arrays remain calibrated or whether complete headlamp replacement is mandated.

We maintain a curated inventory of genuine OEM headlamp units and UV-hardcoated replacement lenses. Our technician team inspects mounting geometry, lens clarity, and electrical pin connectors to ensure workshops receive plug-and-play lighting solutions with zero coding complications.`,
      image: headlightDefault,
      author: "Lighting Systems Specialist",
      publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Streamlining B2B Parts Procurement for European Body Shops & Collision Specialists",
      description: `Workshop turnaround times directly impact repair shop profitability and insurance claim cycle efficiency. Waiting weeks for oversized body panels or receiving parts with damaged mounting tabs creates severe scheduling bottlenecks.

To solve this, our B2B procurement network offers dedicated Request for Quotation (RFQ) processing with 24-hour response times. Workshops can submit part numbers or vehicle VINs via our streamlined web portal, receiving verified condition reports, high-resolution photography, and guaranteed delivery estimates.

All bumpers, fascias, and optical housings are protected in custom shock-absorbing automotive transit crating, preventing shipping deformation and ensuring components arrive ready for preparation, painting, and fitting.`,
      image: bumperShellDefault,
      author: "B2B Workshop Services",
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Extending Automotive Component Lifecycles: High-Grade Lens Replacement & Housing Restoration",
      description: `Replacing an entire high-specification matrix LED headlamp assembly can cost thousands of euros when only the polycarbonate outer cover has experienced stone chipping, oxidation, or cosmetic scratching.

Modern automotive restoration standards now support professional headlamp de-lensing and re-sealing using factory-grade butyl adhesives and precision-molded polycarbonate replacement lenses.

Our inventory includes precision-matched left and right outer lenses and internal housing shells engineered for BMW F-Series, G-Series, and Mercedes-Benz E-Class/C-Class models. Featuring anti-UV surface hardcoats and optical-grade transparency, these replacement lenses restore factory light distribution and beam throw at a fraction of the cost of new complete units.`,
      image: lensHousingDefault,
      author: "Restoration & Materials Team",
      publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of mediaPosts) {
    await (prisma as any).blog.create({
      data: post,
    });
  }

  console.log("Successfully published 4 Automotive OEM Media Posts!");
}

uploadAllImages()
  .catch((err) => {
    console.error("Fatal error during MinIO upload & database update:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
