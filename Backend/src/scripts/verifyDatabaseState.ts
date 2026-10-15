import prisma from "../config/db.config";

async function verify() {
  console.log("=== Verification Report ===");

  // 1. Categories
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });
  console.log("\n--- Categories (" + categories.length + ") ---");
  for (const c of categories) {
    console.log(`[Category #${c.id}] ${c.name}`);
    console.log(`  Image: ${c.image}`);
  }

  // 2. Products Summary
  const totalProducts = await prisma.product.count();
  const productsWithImages = await prisma.product.count({
    where: {
      image: {
        startsWith: "https://minioapi.appadvent.in/i-mag/products/",
      },
    },
  });
  const productsWithoutImages = await prisma.product.count({
    where: {
      OR: [{ image: null }, { image: "" }],
    },
  });

  console.log("\n--- Products Summary ---");
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Products with MinIO Image URLs: ${productsWithImages}`);
  console.log(`Products without Images: ${productsWithoutImages}`);

  // Sample products from each category
  console.log("\n--- Sample Products by Category ---");
  for (const c of categories) {
    const samples = await prisma.product.findMany({
      where: { categoryId: c.id },
      take: 2,
      select: { id: true, title: true, image: true, oemNumber: true },
    });
    console.log(`Category "${c.name}":`);
    samples.forEach((s) => {
      console.log(`  - [ID ${s.id}] ${s.title.substring(0, 50)}...`);
      console.log(`    OEM: ${s.oemNumber || "N/A"} | Image: ${s.image}`);
    });
  }

  // 3. Blog Media Posts
  const blogs = await (prisma as any).blog.findMany({
    orderBy: { id: "asc" },
  });
  console.log("\n--- Media Posts / Blogs (" + blogs.length + ") ---");
  for (const b of blogs) {
    console.log(`[Blog #${b.id}] ${b.title}`);
    console.log(`  Author: ${b.author} | Image: ${b.image}`);
  }

  console.log("\n=== Verification Complete ===");
}

verify()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
