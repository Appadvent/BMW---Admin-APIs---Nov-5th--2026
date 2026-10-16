import prisma from "../config/db.config";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting import of lens and housing data from Excel JSON...");

  const jsonPath = path.join(__dirname, "lens_data.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("lens_data.json not found!");
    return;
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const items: any[] = JSON.parse(raw);

  console.log(`Read ${items.length} records from Excel file.`);

  // 1. Ensure Categories exist:
  // "Headlight Lenses" and "Headlight Housings" (or general "Lens and Housing")
  const catLens = await prisma.category.upsert({
    where: { name: "Headlight Lenses" },
    update: {},
    create: {
      name: "Headlight Lenses",
      description: "High quality clear polycarbonate headlamp replacement lenses for BMW, Mercedes-Benz, and Audi.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    },
  });

  const catHousing = await prisma.category.upsert({
    where: { name: "Headlight Housings" },
    update: {},
    create: {
      name: "Headlight Housings",
      description: "Durable OEM and replacement headlamp rear housings and shells.",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
    },
  });

  const catGeneral = await prisma.category.upsert({
    where: { name: "Lens & Housing" },
    update: {},
    create: {
      name: "Lens & Housing",
      description: "Premium replacement headlight lenses, rear shells and lighting components for luxury vehicles.",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80",
    },
  });

  // Also add Bumper category if not present
  const catBumpers = await prisma.category.upsert({
    where: { name: "Bumpers & Body Parts" },
    update: {},
    create: {
      name: "Bumpers & Body Parts",
      description: "Front & rear OEM replacement bumpers, trims, and brackets.",
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80",
    },
  });

  console.log("Categories verified/created.");

  // Clear existing products to avoid unique title collision
  console.log("Clearing existing products...");
  await prisma.specification.deleteMany({});
  await prisma.feature.deleteMany({});
  await prisma.product.deleteMany({});

  let inserted = 0;
  const seenTitles = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let title = (item[" NAME"] || item["NAME"] || "").trim();

    if (!title) {
      const parts = [
        item.BRAND,
        item.CAR,
        item.YEAR,
        item.DESCRIPTION,
        item.DETAILS,
      ].filter(Boolean);
      title = parts.join(" ").trim();
    }

    if (!title) continue;

    // Ensure title uniqueness
    if (seenTitles.has(title)) {
      title = `${title} (${i + 1})`;
    }
    seenTitles.add(title);

    const descUpper = (item.DESCRIPTION || "").toUpperCase();
    const titleUpper = title.toUpperCase();

    let categoryId = catGeneral.id;
    if (descUpper.includes("LENS") || titleUpper.includes("LENS")) {
      categoryId = catLens.id;
    } else if (descUpper.includes("HOUSING") || titleUpper.includes("HOUSING")) {
      categoryId = catHousing.id;
    }

    const brand = item.BRAND || (titleUpper.includes("BMW") ? "BMW" : titleUpper.includes("MERCEDES") || titleUpper.includes("BENZ") ? "Mercedes-Benz" : titleUpper.includes("MINI") ? "MINI" : "OEM");
    const carModel = item.CAR || "";
    const yearRange = item.YEAR || "";
    const position = item.DETAILS || "";

    const fullDescription = `${brand} ${carModel} ${yearRange} - ${item.DESCRIPTION || "Automotive Replacement Part"} ${position ? `(${position})` : ""}. High quality precision fitment component.`;

    const image = categoryId === catLens.id
      ? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80";

    const prod = await prisma.product.create({
      data: {
        title,
        description: fullDescription,
        image,
        make: brand,
        model: carModel,
        yearRange,
        position,
        condition: "Brand New / Replacement",
        categoryId,
        specifications: {
          create: [
            { name: "Brand", value: brand, order: 1 },
            { name: "Model", value: carModel || "Universal / Specific Series", order: 2 },
            { name: "Year Range", value: yearRange || "Check VIN", order: 3 },
            { name: "Side / Position", value: position || "Standard", order: 4 },
            { name: "Type", value: item.DESCRIPTION || "Headlamp Component", order: 5 },
          ],
        },
      },
    });

    inserted++;
  }

  console.log(`Successfully imported ${inserted} products into database!`);
}

main()
  .catch((e) => {
    console.error("Error importing data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
