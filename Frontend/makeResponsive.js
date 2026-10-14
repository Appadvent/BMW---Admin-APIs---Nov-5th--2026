const fs = require('fs');
const path = require('path');

const files = [
  'src/app/about/page.tsx',
  'src/app/contact-us/page.tsx',
  'src/app/global-presence/page.tsx',
  'src/app/products/page.tsx',
  'src/app/page.tsx',
  'src/app/Providers.tsx',
  'src/components/about.tsx',
  'src/components/AnimatedCounter.tsx',
  'src/components/CategoryCard.tsx',
  'src/components/EnquiryPopup.tsx',
  'src/components/Footer.tsx',
  'src/components/HomePage.tsx',
  'src/components/Navber.tsx',
  'src/components/NewsDetailPage.tsx',
  'src/components/NewsMediaPage.tsx',
  'src/components/ProductCard.tsx',
  'src/components/ProductDetail.tsx',
  'src/components/Products.tsx'
];

function makeResponsive(content) {
  let updated = content;

  // Text sizes
  updated = updated.replace(/(?<![a-z0-9-:])\btext-([4-9])xl\b(?! md:)/g, "text-3xl md:text-$1xl");
  updated = updated.replace(/(?<![a-z0-9-:])\btext-([2-3])xl\b(?! md:)/g, "text-xl md:text-$1xl");

  // Padding X
  updated = updated.replace(/(?<![a-z0-9-:])\bpx-([1-9][0-9]+|8)\b(?! md:)/g, "px-4 md:px-$1");
  
  // Padding Y
  updated = updated.replace(/(?<![a-z0-9-:])\bpy-([1-9][0-9]+|8)\b(?! md:)/g, "py-8 md:py-$1");

  // Gap
  updated = updated.replace(/(?<![a-z0-9-:])\bgap-([1-9][0-9]+|6|8)\b(?! md:)/g, "gap-4 md:gap-$1");

  // Widths (Fractional)
  updated = updated.replace(/(?<![a-z0-9-:])\bw-1\/2\b(?! md:)/g, "w-full md:w-1/2");
  updated = updated.replace(/(?<![a-z0-9-:])\bw-1\/3\b(?! md:)/g, "w-full md:w-1/3");
  updated = updated.replace(/(?<![a-z0-9-:])\bw-1\/4\b(?! md:)/g, "w-full md:w-1/4");
  updated = updated.replace(/(?<![a-z0-9-:])\bw-2\/3\b(?! md:)/g, "w-full md:w-2/3");
  updated = updated.replace(/(?<![a-z0-9-:])\bw-3\/4\b(?! md:)/g, "w-full md:w-3/4");

  // Grid columns
  updated = updated.replace(/(?<![a-z0-9-:])\bgrid-cols-2\b(?! md:)/g, "grid-cols-1 sm:grid-cols-2");
  updated = updated.replace(/(?<![a-z0-9-:])\bgrid-cols-3\b(?! lg:)/g, "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3");
  updated = updated.replace(/(?<![a-z0-9-:])\bgrid-cols-4\b(?! lg:)/g, "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4");
  updated = updated.replace(/(?<![a-z0-9-:])\bgrid-cols-5\b(?! lg:)/g, "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5");

  // Viewport height fix
  updated = updated.replace(/(?<![a-z0-9-:])\bh-screen\b/g, "h-[100dvh]");

  return updated;
}

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const original = fs.readFileSync(filePath, 'utf-8');
    const modified = makeResponsive(original);
    if (original !== modified) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      console.log(`Updated ${file}`);
      modifiedCount++;
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
}

console.log(`Successfully processed ${modifiedCount} files.`);
