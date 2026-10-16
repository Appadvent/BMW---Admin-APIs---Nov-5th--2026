import prisma from "../config/db.config";

async function main() {
  console.log("Seeding EUTORIIA architectural categories, products, about us, and blogs...");

  // 1. Clear existing products, features, blogs, and categories to ensure a clean, accurate theme
  console.log("Clearing old dummy data...");
  await prisma.feature.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Seed EUTORIIA Categories
  const categoriesData = [
    {
      name: "Architectural Hardware",
      description:
        "Premium handles, hinges, door accessories, and hardware solutions for modern architectural spaces.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Glass Fittings",
      description:
        "High-quality glass door fittings, patch fittings, shower fittings, and glass architectural accessories.",
      image:
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Door Locks",
      description:
        "Advanced mechanical and smart locking systems designed for security, convenience, and modern aesthetics.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Water Purifiers",
      description:
        "Innovative water purification systems designed to provide clean, safe, and healthy drinking water.",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const categoryMap = new Map<string, number>();

  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap.set(cat.name, created.id);
    console.log(`Created Category: "${created.name}" (ID: ${created.id})`);
  }

  // 3. Seed About Us Section
  const aboutData = {
    badge: "ABOUT US",
    title: "Building Better Spaces Together.",
    subtitle:
      "With decades of expertise in architectural hardware and home solutions, we partner with architects, interior designers, builders, and homeowners to deliver products that elevate every space - combining precision engineering with exceptional design.",
    description:
      "With decades of expertise in architectural hardware and home solutions, we partner with architects, interior designers, builders, and homeowners to deliver products that elevate every space - combining precision engineering with exceptional design.",
    content:
      "Our products undergo rigorous testing to ensure exceptional longevity, corrosion resistance, and flawless mechanical movement. From luxury residences to global commercial landmarks, EUTORIIA represents the benchmark of architectural craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
    image2:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "",
    layout: "image-left",
    itemsLayout: "grid",
    alignment: "left",
    ctaEnabled: true,
    ctaText: "Know More",
    ctaLink: "/about",
    ctaTarget: "_self",
    isActive: true,
    titleOne: "Building Better Spaces Together.",
    titleTwo: "Precision Engineering & Exceptional Design.",
    descriptionOne:
      "We deliver architectural hardware and home solutions with a focus on quality, precision engineering, and modern aesthetics.",
    descriptionTwo:
      "Dedicated support and comprehensive hardware ecosystems for residential and commercial architecture worldwide.",
  };

  const existingAbout = await prisma.about.findFirst();

  const aboutItems = [
    {
      title: "Premium Quality",
      description: "We deliver products that last, with a focus on quality and reliability.",
      icon: "Award",
      link: "/about#quality",
      order: 1,
      isActive: true,
    },
    {
      title: "Innovative Solutions",
      description: "Modern designs and advanced technology for evolving architectural needs.",
      icon: "Zap",
      link: "/about#innovation",
      order: 2,
      isActive: true,
    },
    {
      title: "Wide Range",
      description: "Complete hardware and home solutions for every project requirement and specification.",
      icon: "LayoutGrid",
      link: "/products",
      order: 3,
      isActive: true,
    },
    {
      title: "Customer Focus",
      description: "Dedicated support to help you find the right solutions for your spaces.",
      icon: "Users",
      link: "/contact",
      order: 4,
      isActive: true,
    },
  ];

  if (!existingAbout) {
    await prisma.about.create({
      data: {
        ...aboutData,
        items: {
          create: aboutItems,
        },
      },
    });
    console.log("Created About Us Section");
  } else {
    await prisma.aboutItem.deleteMany({
      where: { aboutId: existingAbout.id },
    });
    await prisma.about.update({
      where: { id: existingAbout.id },
      data: {
        ...aboutData,
        items: {
          create: aboutItems,
        },
      },
    });
    console.log("Updated About Us Section");
  }

  // 4. Seed EUTORIIA Products (5 Bestsellers + Catalogue Items)
  const productsData = [
    // --- 5 BESTSELLERS ---
    {
      title: "Stainless Steel Door Handle",
      description:
        "Precision-crafted stainless steel door handle with ergonomic grip, corrosion resistance, and sleek modern aesthetic for luxury residences.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Architectural Hardware",
      features: [
        { title: "Grade 304 Stainless Steel", description: "Corrosion and tarnish proof for interior and exterior doors." },
        { title: "Ergonomic Contour", description: "Smooth tactile operation tested for 200,000 opening cycles." },
        { title: "Satin Brushed Finish", description: "Fingerprint resistant electroplated matte finish." },
      ],
    },
    {
      title: "Patch Fitting",
      description:
        "High-durability stainless steel patch fitting for frameless glass door installations with smooth pivot movement.",
      image:
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Glass Fittings",
      features: [
        {
          title: "Heavy Load Capacity",
          description: "Supports frameless glass panels up to 100kg.",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Universal Pivot Core",
          description: "Compatible with standard commercial floor springs.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "High-Tensile Aluminum Core",
          description: "Reinforced clamped internal structure for maximum safety.",
        },
      ],
      specifications: [
        { name: "Material", value: "Marine Grade Stainless Steel 316", order: 0 },
        { name: "Glass Thickness", value: "10 mm – 12 mm", order: 1 },
        { name: "Max Door Weight", value: "100 kg", order: 2 },
        { name: "Finish", value: "Satin Brushed / Polished Chrome / Matte Black", order: 3 },
      ],
    },
    {
      title: "Digital Door Lock",
      description:
        "Smart biometric and PIN digital door lock with multi-tier access security, mobile app control, and tamper alarms.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Door Locks",
      features: [
        {
          title: "Biometric 3D Scanner",
          description: "Instant 0.3s optical fingerprint recognition.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "WiFi Mobile App Integration",
          description: "Remote unlock, temporary visitor PINs, and real-time access logs.",
          image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Anti-Tamper & Auto-Lock",
          description: "Built-in shock sensor with 100dB deterrent alarm.",
        },
      ],
      specifications: [
        { name: "Locking Mechanism", value: "Electronic Mortise", order: 0 },
        { name: "Fingerprint Capacity", value: "100 Users", order: 1 },
        { name: "Battery Life", value: "Up to 12 Months", order: 2 },
      ],
    },
    {
      title: "Glass Door Hinge",
      description:
        "Precision engineered self-closing hydraulic glass door hinge tested for 500,000 opening cycles in commercial spaces.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Glass Fittings",
      features: [
        {
          title: "Hydraulic Soft-Close",
          description: "Controlled closing speed prevents glass slamming and shattering.",
          image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Adjustable 90-Degree Hold",
          description: "Integrated hold-open position at 90 degrees.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "8mm to 12mm Glass Support",
          description: "Precision gaskets protect glass surfaces.",
        },
      ],
      specifications: [
        { name: "Material", value: "Stainless Steel 304", order: 0 },
        { name: "Door Weight Max", value: "65 kg", order: 1 },
        { name: "Opening Angle", value: "180 Degrees with 90° Hold", order: 2 },
      ],
    },
    {
      title: "RO Water Purifier",
      description:
        "Advanced multi-stage RO + UV water purification system with mineral retention and high-flow rapid dispensing.",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Water Purifiers",
      features: [
        {
          title: "7-Stage RO + UV Filtration",
          description: "Removes 99.9% heavy metals, micro-plastics, and pathogens.",
          image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Active Mineral Controller",
          description: "Maintains optimal pH balance and essential calcium/magnesium.",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Smart LED Indicator",
          description: "Real-time TDS monitor and filter change alerts.",
        },
      ],
      specifications: [
        { name: "Filtration Stages", value: "7 Stages", order: 0 },
        { name: "Capacity", value: "15 L/hr", order: 1 },
        { name: "Storage Tank", value: "8 Liters Stainless Steel", order: 2 },
      ],
    },

    // --- ADDITIONAL CATALOGUE PRODUCTS ---
    {
      title: "Prestige Lever Handle",
      description:
        "The Prestige Lever Handle is a masterpiece of engineering and design. Precision-forged from solid brass and finished in a warm satin tone, it delivers both timeless aesthetics and exceptional durability. Compatible with standard mortise lock sets, it is suitable for residential, hospitality, and commercial environments.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      tag: "Best Seller",
      categoryName: "Architectural Hardware",
      features: [
        {
          title: "Precision-forged solid brass construction",
          description: "Superior structural density and luxurious heavyweight feel.",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Anti-tarnish satin brass finish",
          description: "Scratch-resistant physical vapor deposition coating.",
          image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Universal backset compatibility",
          description: "Seamlessly adapts to 60mm and 70mm standard architectural latch mechanisms.",
        },
        {
          title: "Left/right hand reversible",
          description: "Quick reversible mechanical spring hub for simple universal installation.",
        },
        {
          title: "BHMA Grade 2 certified",
          description: "Tested and rated for over 200,000 continuous door opening cycles.",
        },
      ],
      specifications: [
        { name: "Material", value: "Solid Brass", order: 0 },
        { name: "Finish", value: "Satin Brass", order: 1 },
        { name: "Backset", value: "60 mm / 70 mm", order: 2 },
        { name: "Door Thickness", value: "35–55 mm", order: 3 },
        { name: "Handle Length", value: "135 mm", order: 4 },
        { name: "Warranty", value: "5 Years", order: 5 },
      ],
    },
    {
      title: "Glide Pro Sliding System",
      description:
        "Ultra-silent soft-close sliding system for frameless glass panels up to 80 kg with concealed track profile.",
      image:
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
      tag: "New",
      categoryName: "Glass Fittings",
      features: [
        { title: "Dual Soft-Close Dampers", description: "Seamless decelerated stopping in both open and close directions." },
        { title: "Concealed Aluminum Rail", description: "Minimalist ceiling or wall-mounted architectural profile." },
      ],
      specifications: [
        { name: "Material", value: "High-Tensile Aluminum & Stainless Steel 304", order: 0 },
        { name: "Max Weight Capacity", value: "80 kg per panel", order: 1 },
        { name: "Glass Compatibility", value: "8 mm – 12 mm Toughened Glass", order: 2 },
        { name: "Track Length", value: "2000 mm / 3000 mm (Customizable)", order: 3 },
        { name: "Cycle Rating", value: "100,000 Cycles", order: 4 },
      ],
    },
    {
      title: "Grip Series Pull Handle",
      description:
        "Ergonomically designed pull handle with matte finish. Compliant with accessibility standards for glass and wood doors.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      tag: "Featured",
      categoryName: "Architectural Hardware",
      features: [
        { title: "Back-to-Back Mounting", description: "Heavy-duty threaded stainless steel tie rod fixing." },
        { title: "Matte Black & Satin Finish", description: "Architectural grade powder coating." },
      ],
      specifications: [
        { name: "Material", value: "Grade 304 Stainless Steel", order: 0 },
        { name: "Length Options", value: "450 mm / 600 mm / 900 mm", order: 1 },
        { name: "Diameter", value: "32 mm", order: 2 },
        { name: "Mounting Type", value: "Back-to-back through bolt", order: 3 },
      ],
    },
    {
      title: "Smart Lock Pro",
      description:
        "Fingerprint, PIN, card, and app-controlled smart lock for residential and commercial entry doors.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      tag: "Featured",
      categoryName: "Door Locks",
      features: [
        { title: "5-Way Keyless Entry", description: "Fingerprint, passcode, RFID card, smartphone app, and backup key." },
        { title: "Bank-Grade Encryption", description: "AES-128 cryptographic wireless protocol." },
      ],
      specifications: [
        { name: "Locking Mechanism", value: "Heavy-duty Electronic Mortise", order: 0 },
        { name: "Fingerprint Capacity", value: "100 Users", order: 1 },
        { name: "Battery Life", value: "Up to 12 Months (4x AA Alkaline)", order: 2 },
        { name: "Emergency Power", value: "Type-C USB Port", order: 3 },
      ],
    },
    {
      title: "Aqua Pure RO System",
      description:
        "7-stage reverse osmosis purification delivering mineral-balanced drinking water with smart filter change indicators.",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      tag: "New",
      categoryName: "Water Purifiers",
      features: [
        { title: "High-Recovery Membrane", description: "Reduces water wastage by 50% compared to standard ROs." },
        { title: "Compact Countertop/Under-Sink", description: "Sleek architectural housing fits modern luxury kitchens." },
      ],
      specifications: [
        { name: "Filtration Stages", value: "7 Stages (RO + UV + UF + Mineralizer)", order: 0 },
        { name: "Purification Capacity", value: "15 Liters / Hour", order: 1 },
        { name: "Storage Tank", value: "8 Liters Food-Grade Stainless Steel", order: 2 },
        { name: "TDS Reduction", value: "Up to 95%", order: 3 },
      ],
    },
    {
      title: "Frameless Patch Fitting Set",
      description:
        "Stainless steel patch fittings for frameless glass door installations with top and bottom pivot accessories.",
      image:
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
      tag: "Featured",
      categoryName: "Glass Fittings",
      features: [
        { title: "Complete Top/Bottom Set", description: "Includes top pivot, bottom patch, and security lock fitting." },
        { title: "Stainless Steel 316", description: "Marine grade alloy suitable for exterior and high-humidity areas." },
      ],
      specifications: [
        { name: "Material", value: "Marine Grade Stainless Steel 316", order: 0 },
        { name: "Glass Thickness", value: "10 mm – 12 mm", order: 1 },
        { name: "Max Door Weight", value: "100 kg", order: 2 },
        { name: "Finish", value: "Satin Brushed / Polished Chrome / Matte Black", order: 3 },
      ],
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categoryName) || null;
    const createdProd = await (prisma.product as any).create({
      data: {
        title: prod.title,
        description: prod.description,
        image: prod.image,
        tag: (prod as any).tag || null,
        categoryId: categoryId,
        features: {
          create: prod.features,
        },
        ...((prod as any).specifications && {
          specifications: {
            create: (prod as any).specifications,
          },
        }),
      },
    });
    console.log(`Created Product: "${createdProd.title}" (Tag: ${createdProd.tag || "None"}, ID: ${createdProd.id})`);
  }

  // 5. Seed EUTORIIA Blogs / News Articles
  const blogsData = [
    {
      title: "Technological Advancements in Architectural Solutions",
      description:
        "Explore how new composite finishes, precision CNC processes, and smart materials enhance endurance and aesthetic excellence in modern architecture.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      author: "Design Team",
      publishedDate: new Date("2026-08-12T00:00:00.000Z"),
      categoryName: "Architectural Hardware",
    },
    {
      title: "Modern Minimalist Hardware Trends for 2026",
      description:
        "How frameless glass fittings, matte black architectural accessories, and concealed fixtures are transforming luxury residential and commercial interiors.",
      image:
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
      author: "Architectural Digest",
      publishedDate: new Date("2026-08-05T00:00:00.000Z"),
      categoryName: "Glass Fittings",
    },
    {
      title: "Sustainability and Longevity in Modern Construction",
      description:
        "A deep dive into corrosion-resistant alloys, recyclable materials, and precision mechanical testing standards for sustainable living spaces.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      author: "Engineering Insights",
      publishedDate: new Date("2026-07-28T00:00:00.000Z"),
      categoryName: "Architectural Hardware",
    },
    {
      title: "Smart Locks and Intelligent Access Control in Contemporary Homes",
      description:
        "Integrating biometric authentication, IoT mobile keys, and architectural aesthetics for seamless smart home security.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      author: "Security Today",
      publishedDate: new Date("2026-07-20T00:00:00.000Z"),
      categoryName: "Door Locks",
    },
  ];

  // 5. Seed Testimonials
  console.log("Seeding Testimonials...");
  await prisma.testimonial.deleteMany({});

  const testimonialsData = [
    {
      name: "Rajan Mehta",
      designation: "Mehta & Associates Architects",
      message:
        "EUTORIIA hardware has become our standard specification on every premium residential project. The quality and finish consistency across their range is unmatched.",
      image: "https://minioapi.appadvent.in/i-mag/testimonials/1791277217117-Rajan_Mehta.jpg",
    },
    {
      name: "Priya Nair",
      designation: "Inspace Interiors",
      message:
        "The Glide Pro sliding system transformed our glass partition projects. Clients are always impressed by the silent, smooth operation — and it installs in half the time of comparable products.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Aditya Shah",
      designation: "ShahBuild Developers",
      message:
        "We specified EUTORIIA smart locks across 240 apartment units. The after-sales support was excellent and the system performed flawlessly throughout the handover period.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Lena Müller",
      designation: "Müller Hospitality Group",
      message:
        "Our hotel renovation called for hardware that felt premium but was genuinely durable. EUTORIIA delivered both — two years in, every handle and fitting still looks showroom-new.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
  ];

  for (const t of testimonialsData) {
    const created = await prisma.testimonial.create({ data: t });
    console.log(`Created Testimonial: "${created.name}" (ID: ${created.id})`);
  }

  // 6. Seed Banners
  console.log("Seeding Banners...");
  await (prisma as any).banner.deleteMany({});

  const bannersData = [
    {
      bgMediaType: "VIDEO",
      bgMedia: "/From Klickpin.com- 54 Trending Digital Detox Ideas for This Year-pin-id-845832373798948413.mp4.mp4",
      label: "ARCHITECTURAL HARDWARE & HOME SOLUTIONS",
      heading: "Better Spaces. Smarter Living.",
      description: "Discover innovative architectural hardware and home solutions designed to combine style, security, durability, and functionality.",
      textAlignment: "CENTER",
      primaryBtnText: "Explore Our Products",
      primaryBtnLink: "/products",
      secondaryBtnText: "Contact Us",
      secondaryBtnLink: "#contact",
      sideImage: null,
      sideImagePosition: "RIGHT",
      sequence: 1,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: "/e53679a624d175106c5010d2ddc83fdad75f1d0a.jpg",
      label: "PRECISION CRAFTSMANSHIP & INNOVATION",
      heading: "Engineering Luxury. Defining Strength.",
      description: "Transforming residential and commercial architectural environments with world-class fittings, precision-engineered handles, and certified hardware.",
      textAlignment: "LEFT",
      primaryBtnText: "Explore Our Products",
      primaryBtnLink: "/products",
      secondaryBtnText: "Contact Us",
      secondaryBtnLink: "#contact",
      sideImage: "/b398947491d1478e49ba10276ba692b4bdf31e88.png",
      sideImagePosition: "RIGHT",
      sequence: 2,
      isActive: true,
    },
    {
      bgMediaType: "IMAGE",
      bgMedia: "/living-room.jpg",
      label: "INTELLIGENT ACCESS & SECURITY",
      heading: "Seamless Design. Enduring Quality.",
      description: "Engineered for modern living with durable finishes, smooth mechanical movement, and flawless performance tested for over 30+ years.",
      textAlignment: "LEFT",
      primaryBtnText: "Explore Our Products",
      primaryBtnLink: "/products",
      secondaryBtnText: "Contact Us",
      secondaryBtnLink: "#contact",
      sideImage: "/living-room.jpg",
      sideImagePosition: "RIGHT",
      sequence: 3,
      isActive: true,
    },
  ];

  for (const b of bannersData) {
    const created = await (prisma as any).banner.create({ data: b });
    console.log(`Created Banner: "${created.heading}" (ID: ${created.id})`);
  }

  console.log("✅ EUTORIIA seed data successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Error seeding dummy data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
