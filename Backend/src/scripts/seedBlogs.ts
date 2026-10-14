import prisma from "../config/db.config";

async function main() {
  console.log("Seeding real News & Media blogs...");

  // Ensure categories exist
  const categories = [
    { name: "PRODUCT LAUNCH", description: "Product launches and innovations" },
    { name: "AWARD", description: "Industry awards and design recognitions" },
    { name: "BUSINESS", description: "Corporate expansions and global partnerships" },
    { name: "CERTIFICATION", description: "Quality, safety, and testing certifications" },
  ];

  const categoryMap: { [key: string]: number } = {};

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });
    if (existing) {
      categoryMap[cat.name] = existing.id;
    } else {
      const created = await prisma.category.create({
        data: { name: cat.name, description: cat.description },
      });
      categoryMap[cat.name] = created.id;
    }
  }

  // Clear existing blogs to avoid duplicate seed runs
  await prisma.blog.deleteMany({});

  const blogsData = [
    {
      title: "EUTORIIA Launches Smart Lock Collection at ArchBuild 2026",
      description: `Our newest smart locking systems were unveiled at the ArchBuild Asia-Pacific Expo, drawing widespread interest from architects and developers.

EUTORIIA unveiled its next-generation Smart Lock Pro collection at the ArchBuild Asia-Pacific Expo held in Singapore this September. The launch attracted significant attention from leading architects, interior designers, and property developers across the region.

The Smart Lock Pro collection introduces quad-mode access — fingerprint recognition, PIN code, RFID card, and Bluetooth app control — in a form factor that integrates seamlessly with contemporary door designs. The range is available in three finishes: Matte Black, Brushed Gold, and Satin Stainless.

"We designed the Smart Lock Pro to answer a clear market need: security that does not compromise on aesthetics," said the company's Head of Product Development. "The response from the architecture community at ArchBuild has confirmed that this is exactly what the market was looking for."

The collection is now available for order across our distribution network in South Asia, Southeast Asia, and the Middle East.`,
      image: "/83ff01111d7e0e26bc28cd18afe9cb715caacb28.jpg",
      categoryId: categoryMap["PRODUCT LAUNCH"],
      author: "EUTORIIA Editorial",
      publishedDate: new Date("2026-09-12"),
    },
    {
      title: "Glass Fittings Range Wins Red Dot Design Award",
      description: `The Glide Pro series received the prestigious Red Dot Design Award for innovation in architectural hardware solutions.

EUTORIIA's premier architectural glass fitting series, the Glide Pro, has been officially awarded the internationally acclaimed Red Dot Design Award for Product Design.

Evaluated by an independent jury of 40 international design experts, the Glide Pro stood out for its ultra-slim profile, concealed hydraulic dampening mechanism, and frictionless gliding performance on heavy tempered glass panels.

"This recognition affirms our continuous commitment to merging high mechanical performance with minimalist visual harmony," noted the lead industrial designer.`,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      categoryId: categoryMap["AWARD"],
      author: "Design Studio",
      publishedDate: new Date("2026-08-03"),
    },
    {
      title: "Expanding Distribution Network Across Southeast Asia",
      description: `We are proud to announce new distribution partnerships across Thailand, Malaysia, and Vietnam, strengthening our regional footprint.

As part of our continuous international growth strategy, EUTORIIA has finalized distribution and service agreements with three premier building material conglomerates in Southeast Asia.

The expansion will see dedicated experience centers opening in Bangkok, Kuala Lumpur, and Ho Chi Minh City over the next two quarters, providing architects and builders immediate local access to our comprehensive architectural and hardware collections.`,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      categoryId: categoryMap["BUSINESS"],
      author: "Corporate Relations",
      publishedDate: new Date("2026-06-28"),
    },
    {
      title: "Aqua Pure RO System Receives International Safety Certification",
      description: `Our water purification range has achieved CE and ISI dual certification, affirming the highest standards of safety and performance.

EUTORIIA's residential and commercial water purification lineup has successfully completed all laboratory compliance verifications, achieving dual CE and ISI quality certifications.

Featuring multi-stage reverse osmosis, UV-C sterilisation, and intelligent mineral retention, the Aqua Pure range is engineered for both reliability and energy efficiency.`,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      categoryId: categoryMap["CERTIFICATION"],
      author: "Quality & Compliance",
      publishedDate: new Date("2026-05-15"),
    },
  ];

  for (const blog of blogsData) {
    await prisma.blog.create({
      data: blog,
    });
  }

  console.log("Successfully seeded 4 real blogs!");
}

main()
  .catch((e) => {
    console.error("Error seeding blogs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
