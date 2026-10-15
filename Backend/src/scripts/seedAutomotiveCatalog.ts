import prisma from "../config/db.config";
import * as fs from "fs";
import * as path from "path";
// Require xlsx from Admin/node_modules/xlsx
const XLSX = require(path.resolve(__dirname, "../../../Admin/node_modules/xlsx"));

const DOC_DIR = path.resolve(__dirname, "../../doc");
const MAPPING_FILE = path.resolve(__dirname, "./minio_image_mapping.json");

let minioMapping: Record<string, string> = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    minioMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
  } catch {}
}

const DEFAULT_BUMPER_ASSY_URL =
  minioMapping["bumper_assy_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056119575-bumper_assy_row_1.png";

const DEFAULT_BUMPER_SHELL_URL =
  minioMapping["bumper_shell_row_1.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056121191-bumper_shell_row_1.png";

const DEFAULT_HEADLIGHT_URL =
  minioMapping["headlight_bmw_row_2.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123162-headlight_bmw_row_2.png";

const DEFAULT_LENS_HOUSING_URL =
  minioMapping["headlight_bmw_row_3.png"] ||
  "https://minioapi.appadvent.in/i-mag/products/1792056123400-headlight_bmw_row_3.png";

// Helper to find uploaded MinIO image for a row
function getExtractedImage(prefix: string, rowIdx: number): string | null {
  const exts = [".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of exts) {
    const filename = `${prefix}_row_${rowIdx}${ext}`;
    if (minioMapping[filename]) {
      return minioMapping[filename];
    }
  }
  return null;
}

export async function seedAutomotiveCatalog() {
  console.log("Starting Automotive Parts Catalogue Seeding...");

  // 1. Define Category definitions matching the 4 Excel files
  const categoryDefs = [
    {
      file: "BMW OEM bumper  assembly .xlsx",
      name: "BMW OEM Bumper Assembly",
      description: "Original equipment BMW complete bumper assemblies including grilles, brackets, trim inserts, and sensor mounts.",
      image: DEFAULT_BUMPER_ASSY_URL,
      prefix: "bumper_assy",
    },
    {
      file: "BMW OEM bumper shell  .xlsx",
      name: "BMW OEM Bumper Shell",
      description: "Genuine OEM front and rear bumper covers and shells with PDC sensor cutouts, fog openings, and washer jet provisions.",
      image: DEFAULT_BUMPER_SHELL_URL,
      prefix: "bumper_shell",
    },
    {
      file: "headlight OEM  BMW .xlsx",
      name: "Headlight OEM BMW",
      description: "Original BMW headlights featuring Halogen, Xenon, Adaptive LED, and Laser technologies for European and global specifications.",
      image: DEFAULT_HEADLIGHT_URL,
      prefix: "headlight_bmw",
    },
    {
      file: "lens  and houseing -BMW  BENZ .xlsx",
      name: "Lens and Housing - BMW / BENZ",
      description: "High-grade replacement polycarbonate headlamp lenses and durable housing assemblies for BMW, Mercedes-Benz, and MINI vehicles.",
      image: DEFAULT_LENS_HOUSING_URL,
      prefix: "lens_housing",
    },
  ];

  // Map to hold category IDs
  const categoryMap = new Map<string, number>();

  for (const cat of categoryDefs) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } });
    if (existing) {
      const updated = await prisma.category.update({
        where: { id: existing.id },
        data: {
          description: cat.description,
          image: cat.image,
        },
      });
      categoryMap.set(cat.name, updated.id);
      console.log(`Updated Category: ${cat.name} (ID: ${updated.id})`);
    } else {
      const created = await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
          image: cat.image,
        },
      });
      categoryMap.set(cat.name, created.id);
      console.log(`Created Category: ${cat.name} (ID: ${created.id})`);
    }
  }

  let totalProductsCreated = 0;

  // 2. Process File 1: BMW OEM bumper assembly
  const cat1Id = categoryMap.get("BMW OEM Bumper Assembly")!;
  const file1Path = path.join(DOC_DIR, "BMW OEM bumper  assembly .xlsx");
  if (fs.existsSync(file1Path)) {
    const wb = XLSX.readFile(file1Path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[0]) continue;

      const rawOem = String(row[0] || "").trim();
      const rawNameEn = String(row[2] || row[1] || "Bumper Assy").trim();
      const rawModel = String(row[3] || "").trim();
      if (!rawOem) continue;

      const title = `BMW ${rawModel ? rawModel + " " : ""}${rawNameEn} [OEM ${rawOem}]`.trim();
      const position = rawNameEn.toLowerCase().includes("rear") || rawNameEn.includes("后") ? "Rear" : "Front";
      const isM = rawModel.toUpperCase().includes("M") || rawNameEn.toUpperCase().includes("M");
      const img = getExtractedImage("bumper_assy", i) || DEFAULT_BUMPER_ASSY_URL;

      const specs = [
        { name: "Brand / Make", value: "BMW", order: 0 },
        { name: "OEM Part Number", value: rawOem, order: 1 },
        { name: "Vehicle Model / Chassis", value: rawModel || "BMW Series", order: 2 },
        { name: "Component Type", value: "Complete Bumper Assembly", order: 3 },
        { name: "Installation Position", value: position, order: 4 },
        { name: "Specification / Package", value: isM ? "M Sport / Performance" : "Standard OEM", order: 5 },
        { name: "Condition", value: "Original Equipment Manufacturer (OEM)", order: 6 },
        { name: "Market Specification", value: "European / Global", order: 7 },
      ];

      try {
        await prisma.product.upsert({
          where: { title },
          create: {
            title,
            description: `Original BMW ${rawModel} ${rawNameEn}. High precision OEM fitment with complete mounting points and internal reinforcements. Part Number: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawModel,
            position,
            condition: "OEM Replacement",
            tag: isM ? "M Sport" : "OEM Original",
            categoryId: cat1Id,
            specifications: {
              create: specs,
            },
          },
          update: {
            description: `Original BMW ${rawModel} ${rawNameEn}. High precision OEM fitment with complete mounting points and internal reinforcements. Part Number: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawModel,
            position,
            condition: "OEM Replacement",
            tag: isM ? "M Sport" : "OEM Original",
            categoryId: cat1Id,
          },
        });
        totalProductsCreated++;
      } catch (err: any) {
        console.warn(`Error creating bumper assy row ${i}:`, err.message);
      }
    }
    console.log(`Processed Bumper Assemblies. Running total: ${totalProductsCreated}`);
  }

  // 3. Process File 2: BMW OEM bumper shell
  const cat2Id = categoryMap.get("BMW OEM Bumper Shell")!;
  const file2Path = path.join(DOC_DIR, "BMW OEM bumper shell  .xlsx");
  if (fs.existsSync(file2Path)) {
    const wb = XLSX.readFile(file2Path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[0]) continue;

      const rawOem = String(row[0] || "").trim();
      const rawNameZh = String(row[1] || "").trim();
      const rawNameEn = String(row[2] || "Bumper Shell").trim();
      const rawModel = String(row[3] || "").trim();
      if (!rawOem) continue;

      const title = `BMW ${rawModel ? rawModel + " " : ""}${rawNameEn} Cover [OEM ${rawOem}]`.trim();
      const position = rawNameEn.toLowerCase().includes("rear") || rawNameZh.includes("后") ? "Rear" : "Front";
      const hasWaterJet = rawNameEn.toLowerCase().includes("water") || rawNameZh.includes("喷水");
      const has4Holes = rawNameEn.includes("4 hole") || rawNameZh.includes("4孔");
      const isM = rawModel.toUpperCase().includes("M") || rawNameEn.toUpperCase().includes("M");
      const img = getExtractedImage("bumper_shell", i) || DEFAULT_BUMPER_SHELL_URL;

      const specs = [
        { name: "Brand / Make", value: "BMW", order: 0 },
        { name: "OEM Part Number", value: rawOem, order: 1 },
        { name: "Vehicle Model / Chassis", value: rawModel || "BMW Series", order: 2 },
        { name: "Component Type", value: "Bumper Shell / Skin", order: 3 },
        { name: "Installation Position", value: position, order: 4 },
        { name: "PDC Sensor Cutouts", value: has4Holes ? "4 Holes for PDC Sensors" : "Standard", order: 5 },
        { name: "Headlight Washer Jet", value: hasWaterJet ? "With washer jet openings" : "Without washer opening", order: 6 },
        { name: "Specification / Package", value: isM ? "M Sport Package" : "Standard", order: 7 },
      ];

      try {
        await prisma.product.upsert({
          where: { title },
          create: {
            title,
            description: `Genuine OEM bumper skin for BMW ${rawModel}. Designed for direct replacement with factory tolerances. ${rawNameEn}. OEM Part: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawModel,
            position,
            condition: "OEM Primed / Unpainted",
            tag: isM ? "M Sport" : "OEM Shell",
            categoryId: cat2Id,
            specifications: {
              create: specs,
            },
          },
          update: {
            description: `Genuine OEM bumper skin for BMW ${rawModel}. Designed for direct replacement with factory tolerances. ${rawNameEn}. OEM Part: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawModel,
            position,
            condition: "OEM Primed / Unpainted",
            tag: isM ? "M Sport" : "OEM Shell",
            categoryId: cat2Id,
          },
        });
        totalProductsCreated++;
      } catch (err: any) {
        console.warn(`Error creating bumper shell row ${i}:`, err.message);
      }
    }
    console.log(`Processed Bumper Shells. Running total: ${totalProductsCreated}`);
  }

  // 4. Process File 3: headlight OEM BMW
  const cat3Id = categoryMap.get("Headlight OEM BMW")!;
  const file3Path = path.join(DOC_DIR, "headlight OEM  BMW .xlsx");
  if (fs.existsSync(file3Path)) {
    const wb = XLSX.readFile(file3Path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // In headlight sheet: row 0 is contacts, row 1 is headers, data starts at row 2
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const rawCarStyle = String(row[2] || "").trim();
      const rawName = String(row[3] || "").trim();
      const rawYear = String(row[5] || "").trim();
      const rawOem = String(row[6] || "").replace(/\r?\n/g, " / ").trim();
      const rawTech = String(row[7] || "Headlight").trim();
      const rawMark = String(row[8] || "").trim();
      const rawMark2 = String(row[9] || "").trim();

      if (!rawName && !rawOem) continue;

      const title = `BMW ${rawCarStyle ? rawCarStyle + " " : ""}${rawName} [OEM ${rawOem.split("/")[0].trim() || i}]`.trim();
      const img = getExtractedImage("headlight_bmw", i) || DEFAULT_HEADLIGHT_URL;

      const specs = [
        { name: "Brand / Make", value: "BMW", order: 0 },
        { name: "Car Model / Chassis", value: rawCarStyle || "BMW", order: 1 },
        { name: "OEM Part Numbers", value: rawOem || "On Request", order: 2 },
        { name: "Model Years", value: rawYear || "All Supported Years", order: 3 },
        { name: "Lighting Technology", value: rawTech || "OEM Lighting", order: 4 },
        { name: "Assembly Type", value: rawMark ? rawMark.split("\n")[0] : "Complete Headlamp Assembly", order: 5 },
        { name: "Certification / Drive", value: rawMark2 || "E-Mark / European Road Legal", order: 6 },
      ];

      try {
        await prisma.product.upsert({
          where: { title },
          create: {
            title,
            description: `Original BMW Headlamp for ${rawCarStyle} (${rawYear}). ${rawName}. Lighting Tech: ${rawTech}. OEM Part Numbers: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawCarStyle,
            yearRange: rawYear,
            position: "Front Left / Right",
            condition: "OEM Assembly",
            tag: rawTech.includes("LED") ? "Full LED" : rawTech.includes("Xenon") ? "Bi-Xenon" : "OEM Headlight",
            categoryId: cat3Id,
            specifications: {
              create: specs,
            },
          },
          update: {
            description: `Original BMW Headlamp for ${rawCarStyle} (${rawYear}). ${rawName}. Lighting Tech: ${rawTech}. OEM Part Numbers: ${rawOem}.`,
            image: img,
            oemNumber: rawOem,
            make: "BMW",
            model: rawCarStyle,
            yearRange: rawYear,
            position: "Front Left / Right",
            condition: "OEM Assembly",
            tag: rawTech.includes("LED") ? "Full LED" : rawTech.includes("Xenon") ? "Bi-Xenon" : "OEM Headlight",
            categoryId: cat3Id,
          },
        });
        totalProductsCreated++;
      } catch (err: any) {
        console.warn(`Error creating headlight row ${i}:`, err.message);
      }
    }
    console.log(`Processed Headlights. Running total: ${totalProductsCreated}`);
  }

  // 5. Process File 4: lens and houseing -BMW BENZ
  const cat4Id = categoryMap.get("Lens and Housing - BMW / BENZ")!;
  const file4Path = path.join(DOC_DIR, "lens  and houseing -BMW  BENZ .xlsx");
  if (fs.existsSync(file4Path)) {
    const wb = XLSX.readFile(file4Path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const rawDesc = String(row[0] || "").trim();
      const rawCar = String(row[1] || "").trim();
      const rawYear = String(row[2] || "").trim();
      const rawDetails = String(row[3] || "").trim();
      const rawBrand = String(row[5] || "BMW").trim().toUpperCase();
      const rawFullName = String(row[6] || "").trim();

      if (!rawCar && !rawFullName) continue;

      const title = rawFullName || `${rawBrand} ${rawCar} ${rawYear} ${rawDesc} ${rawDetails}`.trim();
      const isLens = rawDesc.toUpperCase().includes("LENS");
      const position = rawDetails.toUpperCase().includes("LEFT") ? "Left" : rawDetails.toUpperCase().includes("RIGHT") ? "Right" : "Left / Right";

      const specs = [
        { name: "Brand / Make", value: rawBrand, order: 0 },
        { name: "Vehicle Model", value: rawCar, order: 1 },
        { name: "Production Years", value: rawYear || "Standard", order: 2 },
        { name: "Component Type", value: isLens ? "Headlamp Outer Lens (Polycarbonate)" : "Headlamp Housing Shell", order: 3 },
        { name: "Installation Position", value: position, order: 4 },
        { name: "Technical Details", value: rawDetails || "Standard Replacement", order: 5 },
      ];

      try {
        await prisma.product.upsert({
          where: { title },
          create: {
            title,
            description: `Precision replacement ${rawDesc.toLowerCase()} for ${rawBrand} ${rawCar} ${rawYear}. High optical clarity polycarbonate, UV resistant coating, direct fitment. Position: ${rawDetails}.`,
            image: getExtractedImage("headlight_bmw", i) || DEFAULT_LENS_HOUSING_URL,
            make: rawBrand,
            model: rawCar,
            yearRange: rawYear,
            position,
            condition: "Brand New Replacement",
            tag: isLens ? "Clear Lens" : "Housing Case",
            categoryId: cat4Id,
            specifications: {
              create: specs,
            },
          },
          update: {
            description: `Precision replacement ${rawDesc.toLowerCase()} for ${rawBrand} ${rawCar} ${rawYear}. High optical clarity polycarbonate, UV resistant coating, direct fitment. Position: ${rawDetails}.`,
            make: rawBrand,
            model: rawCar,
            yearRange: rawYear,
            position,
            condition: "Brand New Replacement",
            tag: isLens ? "Clear Lens" : "Housing Case",
            categoryId: cat4Id,
          },
        });
        totalProductsCreated++;
      } catch (err: any) {
        // Ignore duplicate title collision if any
      }
    }
    console.log(`Processed Lens and Housings. Final total products: ${totalProductsCreated}`);
  }

  console.log("Automotive Parts Catalogue Seeding Finished Successfully!");
}

if (require.main === module) {
  seedAutomotiveCatalog()
    .catch((e) => {
      console.error("Seeding Error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
