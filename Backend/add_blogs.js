const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let cat = await prisma.category.findFirst({
      where: { name: "General" }
    });

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          name: "General",
          description: "General category for news and media",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"
        }
      });
    }

    const blogs = [
      {
        title: "Modern Architecture Trends 2026",
        description: "Exploring minimalist designs, sustainable materials, and smart hardware integration in modern architecture for 2026.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        author: "John Doe",
        publishedDate: new Date("2026-10-05T00:00:00Z"),
        categoryId: cat.id
      },
      {
        title: "New Glass Fittings Launched",
        description: "Announcing our latest premium glass fitting collection engineered for durability, elegance, and seamless installation.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
        author: "Jane Smith",
        publishedDate: new Date("2026-10-06T00:00:00Z"),
        categoryId: cat.id
      },
      {
        title: "Sustainable Building Materials",
        description: "How eco-friendly architectural hardware and sustainable manufacturing are shaping the future of commercial spaces.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
        author: "Alice Johnson",
        publishedDate: new Date("2026-10-07T00:00:00Z"),
        categoryId: cat.id
      },
      {
        title: "Innovative Hardware Solutions",
        description: "A deep dive into modern interior hardware design, aesthetics, and functionality for upscale residential projects.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
        author: "Bob Builder",
        publishedDate: new Date("2026-10-08T00:00:00Z"),
        categoryId: cat.id
      }
    ];

    for (const blog of blogs) {
      await prisma.blog.create({
        data: blog
      });
    }

    console.log(`Successfully added ${blogs.length} articles.`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
