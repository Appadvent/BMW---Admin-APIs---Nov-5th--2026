import prisma from "../config/db.config";

async function main() {
  console.log("Seeding exact Automotive Guides matching Figma/screenshot...");

  // Ensure category exists
  const cat = await prisma.category.upsert({
    where: { name: "Automotive Knowledge" },
    update: {},
    create: {
      name: "Automotive Knowledge",
      description: "Guides and technical articles on OEM automotive parts identification.",
    },
  });

  // Clear existing blogs
  await prisma.blog.deleteMany({});

  const guidesData = [
    {
      title: "How to find the right OEM number for BMW?",
      description: "Learn about the data worth checking before sending a part inquiry. Finding the correct OEM number is crucial for exact fitment on BMW vehicles, avoiding incorrect purchases and compatibility mismatches.",
      image: "/734295950a53ab641f4c489e327584416018d44d.jpg",
      author: "OEM NUMBERS • 14.05.2025",
      categoryId: cat.id,
      publishedDate: new Date("2025-05-14"),
    },
    {
      title: "BMW G20 and G21 — compatibility of body parts",
      description: "Learn about the data worth checking before sending a part inquiry. Explore detailed component matching between sedan (G20) and touring (G21) platforms, including front bumpers, headlights, and PDC sensors.",
      image: "/08b2b9be9642bbf6c5b41bc55de409ebd418d294.jpg",
      author: "COMPATIBILITY • 14.05.2025",
      categoryId: cat.id,
      publishedDate: new Date("2025-05-14"),
    },
    {
      title: "How to check if the bumper supports PDC?",
      description: "Learn about the data worth checking before sending a part inquiry. Sensor brackets, hole diameters, and wiring harness compatibility must be verified prior to painting and mounting the bumper assembly.",
      image: "/1889c8da558725682709642aeaf212caab3ad5e6.jpg",
      author: "TECHNICAL GUIDE • 14.05.2025",
      categoryId: cat.id,
      publishedDate: new Date("2025-05-14"),
    },
  ];

  for (const guide of guidesData) {
    await prisma.blog.create({
      data: guide,
    });
  }

  console.log("Successfully seeded 3 automotive guides into database!");
}

main()
  .catch((e) => {
    console.error("Error seeding guides:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
