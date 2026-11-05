const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('Total product count:', count);
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      make: true,
      model: true,
      yearRange: true,
      position: true,
      condition: true,
      specifications: true,
      category: { select: { name: true } }
    }
  });
  console.log('Sample products:', JSON.stringify(products, null, 2));

  const categories = await prisma.category.findMany();
  console.log('Categories in DB:', categories);
}

main().catch(console.error).finally(() => prisma.$disconnect());


