import prisma from "../config/db.config";

interface ProductItem {
  title: string;
  description: string;
  image: string;
  tag?: string;
}

interface SubcategoryItem {
  name: string;
  description?: string;
  products: ProductItem[];
}

interface CategoryItem {
  name: string;
  description: string;
  image: string;
  subcategories: SubcategoryItem[];
}

const hardwareImages = [
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
];

// Exact sequence according to user sheet
const catalogInOrder: CategoryItem[] = [
  // 1. Glass Hardware
  {
    name: "Glass Hardware",
    description: "Premium architectural glass hardware engineered for frameless glass facades, interior partitions, and entrance systems.",
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Glass Door Control",
        description: "Heavy-duty floor springs, hydraulic patches, and sliding door mechanisms.",
        products: [
          {
            title: "FLOOR SPRING",
            description: "High-performance double cylinder floor spring with adjustable closing speed and 90-degree hold open.",
            image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
          {
            title: "Hydraulic Patch",
            description: "Bottom patch fitting with integrated hydraulic closer for frameless tempered glass doors.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
            tag: "Featured",
          },
          {
            title: "SLIDING SYSTEM",
            description: "Synchronized top-hung sliding glass door system engineered for smooth, whisper-quiet operation.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "MOVABLE GLASS PARTITION SYSTEM",
            description: "Acoustic movable glass wall system with precision rollers for flexible commercial interiors.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "MOVABLE EDGE GLASS PARTITION SYSTEM",
            description: "Frameless movable edge glass partition system providing seamless transitions in modern offices.",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Glass Door Handles",
        description: "Architectural pull handles in premium stainless steel and satin finishes.",
        products: [
          {
            title: "H Handle",
            description: "Classic H-shape architectural back-to-back pull handle crafted in high-grade stainless steel.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
          {
            title: "D Handle",
            description: "Ergonomic D-shaped pull handle with precision CNC turned mountings for glass entrance doors.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "C Handle",
            description: "Sleek curved C-shape handle designed for luxury residential and commercial glass doors.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "GLASS FITTING",
        description: "Point-supported routels, spider fittings, and luxury shower enclosure accessories.",
        products: [
          {
            title: "ROUTELS & SPIDER FITTING -220mm CTC",
            description: "Heavy-duty cast stainless steel spider fitting with articulated counter-sunk routels.",
            image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
            tag: "Featured",
          },
          {
            title: "Connector and Patch fitting",
            description: "Precision-engineered patch fittings and glass-to-wall connectors with satin stainless steel covers.",
            image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "SHOWER HINGE & CONNECTORS",
            description: "Solid forged brass 90-degree and 180-degree glass-to-glass self-centering shower hinges.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "SHOWER KNIGHT HEAD ACCESSORIES",
            description: "Stabilizing support bars and knight head clamp assemblies for frameless glass shower enclosures.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "PVD SHOWER HINGES",
            description: "Luxury shower hinges with advanced PVD titanium coating in matte black and gold finishes.",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "PVD SHOWER KNIGHT HEAD ACCESSORIES & CONNECTORS",
            description: "PVD finished structural wall-to-glass support hardware with supreme corrosion resistance.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "PVD COMBO FLOOR MACHINE",
            description: "Integrated floor spring and bottom pivot assembly finished in scratch-resistant PVD coating.",
            image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
    ],
  },

  // 2. Architectural Hardware
  {
    name: "Architectural Hardware",
    description: "High-security locksets, heavy-duty hinges, tower bolts, and precision door control equipment.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Main Door Locks",
        description: "Heavy multi-bolt security locks and night latches for entrance doors.",
        products: [
          {
            title: "Septa Bolt",
            description: "Ultra-secure 7-bolt rim deadlock with hardened brass cylinders and anti-drill protection.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
          {
            title: "Hexa Bolt",
            description: "6-bolt security door lock featuring reinforced deadbolts and premium computer keys.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Penta Bolt",
            description: "5-bolt entrance door lock delivering reliable heavy-duty domestic and commercial security.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Quard Bolt",
            description: "4-bolt lockset with durable brass deadbolts and smooth dual-stage locking mechanism.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Tri Bolt",
            description: "Triple deadbolt security rim lock with reversible latch for left and right-hand doors.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Mini Tri Bolt",
            description: "Compact 3-bolt auxiliary lock designed for narrow-stile wooden and composite doors.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Night Latch",
            description: "Automatic deadlocking night latch with snib function for residential entrance doors.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Mini Night Latch",
            description: "Compact automatic night latch engineered for internal security doors and apartments.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Shutter Locks",
        description: "Heavy-duty locking mechanisms for rolling shutters and commercial gates.",
        products: [
          {
            title: "Side Shutter Lock",
            description: "High-tensile side locking mechanism for shopfront and industrial rolling shutters.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Centre Shutter Lock",
            description: "Central floor-locking heavy brass bullet lock for commercial shutter installations.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Door Fitting",
        description: "Essential architectural door fittings including hinges, stoppers, and cylinders.",
        products: [
          {
            title: "Knob Set",
            description: "Stainless steel entrance and privacy door knobset with integrated key lock mechanism.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "AL Drop Kit SS",
            description: "Heavy-duty stainless steel Aldrop bolt hardware set for main entrance wooden doors.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Door Hinges",
            description: "Premium stainless steel ball bearing hinges for quiet and friction-free door swing.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Door Stoper",
            description: "Floor mounted magnetic door buffer and stopper with heavy rubber dampening ring.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "LOCKBODY & CYLINDER",
            description: "Euro-profile mortise lockcase paired with 70mm double brass computer key cylinder.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Door Control Devices",
        description: "Hydraulic automatic door closer systems for residential and commercial fire doors.",
        products: [
          {
            title: "Door Closer",
            description: "Overhead hydraulic door closer with dual speed control and backcheck capability.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
        ],
      },
    ],
  },

  // 3. Mortise Handle
  {
    name: "Mortise Handle",
    description: "Designer lever mortise handles engineered from brass, zinc alloy, and high-tensile stainless steel.",
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "MORTISE HANDLE SS202 (PIPE)",
        description: "High-grade tubular pipe mortise handle finished in durable SS202 stainless steel.",
        products: [
          {
            title: "MORTISE HANDLE SS202 (PIPE)",
            description: "Lightweight, corrosion-resistant SS202 stainless steel tubular mortise handle with spring cassette.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "MORTISE HANDLE SS304 (PIPE)",
        description: "Heavy-duty SS304 marine grade tubular mortise handle for exterior coastal and luxury applications.",
        products: [
          {
            title: "MORTISE HANDLE SS304 (PIPE)",
            description: "Premium SS304 marine grade stainless steel lever handle set with superior tensile strength.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
        ],
      },
      {
        name: "Zinc Mortise Handle",
        description: "Die-cast zinc alloy lever handle with electroplated satin chrome and matte finishes.",
        products: [
          {
            title: "Zinc Mortise Handle",
            description: "Modern ergonomic zinc alloy mortise handle with multi-layer anti-tarnish electroplating.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Aluminium Mortise Handle",
        description: "Precision anodized architectural aluminium door handles for sleek contemporary interiors.",
        products: [
          {
            title: "Aluminium Mortise Handle",
            description: "Anodized architectural aluminum lever handle with minimalist profile and smooth spring action.",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "SS Mortise Handle",
        description: "Solid stainless steel forged mortise handle offering maximum durability and refined ergonomics.",
        products: [
          {
            title: "SS Mortise Handle",
            description: "Solid cast stainless steel lever handle with satin finish, engineered for high-traffic corridors.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Steel Mortise Handle",
        description: "Hardened steel core mortise handles with anti-tamper security backplates.",
        products: [
          {
            title: "Steel Mortise Handle",
            description: "Hardened steel mortise handle designed for commercial utility doors and secure enclosures.",
            image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
    ],
  },

  // 4. Furniture Fittings
  {
    name: "Furniture Fittings",
    description: "Cabinet hinges, drawer slides, gas springs, and wardrobe hardware for modern modular furniture.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Cabinet Hinges",
        description: "Concealed 3D adjustable soft-close and regular cabinet hinges.",
        products: [
          {
            title: "Hydraulic",
            description: "Soft-close hydraulic clip-on concealed hinge with 105-degree opening angle and 3D adjustment.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
          {
            title: "Normal",
            description: "Standard slide-on concealed hinge for reliable everyday residential cabinet doors.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Multipurpose Locks",
        description: "Key-operated drawer and cabinet cam locks.",
        products: [
          {
            title: "Normal Key",
            description: "Standard brass pin cylinder multipurpose lock for office desks, drawers, and wooden lockers.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Ultra Key",
            description: "High-security dimple ultra key multipurpose lock with tamper-resistant brass cylinder.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Magnetic Catcher",
        description: "Strong magnetic catches for kitchen cabinets and wardrobe doors.",
        products: [
          {
            title: "Magnetic Catcher",
            description: "Heavy-duty magnetic door catcher with steel strike plate for secure cabinet closure.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Gas Spring",
        description: "Hydraulic pneumatic lift-up gas struts for overhead kitchen flaps.",
        products: [
          {
            title: "Gas Spring",
            description: "Pneumatic cabinet lid stay gas spring delivering effortless upward opening and silent holding.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Tandem Box",
        description: "Double-walled steel drawer systems with integrated soft-close dampening.",
        products: [
          {
            title: "Tandem Box",
            description: "Slim double-wall tandem drawer box with synchronous full extension and 45kg load rating.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
            tag: "Featured",
          },
        ],
      },
      {
        name: "Under Mount Slides",
        description: "Concealed undermount soft-close drawer runners.",
        products: [
          {
            title: "Under Mount Slides",
            description: "Concealed full-extension bottom-mount drawer slides with soft closing and tool-free height adjustment.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Wardrobe Sliding Fitting",
        description: "Top-hung and bottom-running sliding door mechanisms for modular wardrobes.",
        products: [
          {
            title: "Wardrobe Sliding Fitting",
            description: "Heavy-duty wardrobe sliding roller system with dual soft-closing dampers on both ends.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Bed Fittings",
        description: "Hydraulic gas lift mechanisms for ottoman storage beds.",
        products: [
          {
            title: "Bed Fittings",
            description: "Heavy-duty hydraulic bed lift mechanism with reinforced angle brackets for effortless storage access.",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "CABINET HANDLE & KNOB",
        description: "Decorative furniture handles and minimalist knobs.",
        products: [
          {
            title: "CABINET HANDLE & KNOB",
            description: "Solid brass profile cabinet pull handles and knurled knobs finished in brushed champagne and matte black.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
    ],
  },

  // 5. Padlock
  {
    name: "Padlock",
    description: "Hardened steel shackle padlocks offering extreme cut, pry, and drill resistance.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Lever Key",
        description: "Traditional lever mechanism brass and steel padlocks.",
        products: [
          {
            title: "Lever Key",
            description: "Solid brass padlock with multi-lever anti-pick locking mechanism and hardened boron steel shackle.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        name: "Disc Padlock",
        description: "Round disc stainless steel padlocks with concealed anti-bolt cutter shackles.",
        products: [
          {
            title: "Disc Padlock",
            description: "Heavy-duty round stainless steel discus padlock designed to resist bolt cutters and angle grinders.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
            tag: "Best Seller",
          },
        ],
      },
      {
        name: "Ultra Key",
        description: "Computerized dimple ultra key padlocks for maximum key duplicate protection.",
        products: [
          {
            title: "Ultra Key Padlock",
            description: "High-security padlock featuring computerized dimple ultra keys with 100,000+ non-interchangeable combinations.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
    ],
  },

  // 6. IoT Products
  {
    name: "IoT Products",
    description: "Smart digital biometric locks and connected IoT home access control solutions.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Smart Locks",
        description: "Wi-Fi and Bluetooth enabled biometric fingerprint door locks.",
        products: [
          {
            title: "Smart Digital Door Lock",
            description: "5-in-1 smart lock featuring 3D facial recognition, biometric fingerprint, RFID card, PIN code, and mobile app.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
            tag: "New",
          },
          {
            title: "Biometric Keyless Lock",
            description: "Slimline keyless electronic mortise lock with semiconductor fingerprint sensor and automatic auto-lock.",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
            tag: "Featured",
          },
        ],
      },
    ],
  },

  // 7. Kitchen Accessories
  {
    name: "Kitchen Accessories",
    description: "Modern modular kitchen organizers, stainless steel pull-out wire baskets, and corner carousel units.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    subcategories: [
      {
        name: "Modular Kitchen Fittings",
        description: "Stainless steel pull-out organizers and storage systems.",
        products: [
          {
            title: "Kitchen Pull-Out Basket",
            description: "Stainless steel wire basket system for grain trolleys, cutlery, and dish racks with soft-close runners.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
          {
            title: "Corner Carousel Unit",
            description: "Universal revolving blind corner carousel with anti-slip bases for maximum kitchen cabinet space utilization.",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
    ],
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seed() {
  console.log("=== Starting Catalog Seeding (Ordered for createdAt: desc) ===");

  // Clean existing tables first
  console.log("Clearing existing products, subcategories, and categories...");
  await prisma.product.deleteMany({});
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});

  // Base timestamp in the future:
  // Item 0 (1st in list) gets the HIGHEST timestamp so when sorted by createdAt: desc, it appears FIRST!
  const baseTimestamp = Date.now() + 100000000;

  // Flatten counts for total items
  const totalCategories = catalogInOrder.length;
  let totalSubcategoriesCount = 0;
  let totalProductsCount = 0;

  for (const cat of catalogInOrder) {
    totalSubcategoriesCount += cat.subcategories.length;
    for (const sub of cat.subcategories) {
      totalProductsCount += sub.products.length;
    }
  }

  let subcategoryGlobalIndex = 0;
  let productGlobalIndex = 0;

  for (let catIdx = 0; catIdx < totalCategories; catIdx++) {
    const item = catalogInOrder[catIdx];

    // Category 0 gets HIGHEST createdAt -> comes 1st in createdAt: desc
    const categoryCreatedAt = new Date(baseTimestamp - catIdx * 100000);

    const category = await prisma.category.create({
      data: {
        name: item.name,
        description: item.description,
        image: item.image,
        createdAt: categoryCreatedAt,
        updatedAt: categoryCreatedAt,
      },
    });
    console.log(`📁 [Pos ${catIdx + 1}] Category created: "${category.name}" (createdAt: ${categoryCreatedAt.toISOString()})`);

    for (let subIdx = 0; subIdx < item.subcategories.length; subIdx++) {
      const subItem = item.subcategories[subIdx];
      const slug = generateSlug(subItem.name);

      // Subcategory 0 gets HIGHEST createdAt -> comes 1st in createdAt: desc
      const subcategoryCreatedAt = new Date(baseTimestamp - subcategoryGlobalIndex * 10000);
      subcategoryGlobalIndex++;

      const subcategory = await prisma.subcategory.create({
        data: {
          name: subItem.name,
          slug,
          description: subItem.description || null,
          image: null, // Subcategories do NOT use image as instructed
          status: "ACTIVE",
          categoryId: category.id,
          createdAt: subcategoryCreatedAt,
          updatedAt: subcategoryCreatedAt,
        },
      });
      console.log(`   ↳ 📂 [Pos ${subIdx + 1}] Subcategory created: "${subcategory.name}"`);

      for (let prodIdx = 0; prodIdx < subItem.products.length; prodIdx++) {
        const prod = subItem.products[prodIdx];

        // Product 0 gets HIGHEST createdAt -> comes 1st in createdAt: desc
        const productCreatedAt = new Date(baseTimestamp - productGlobalIndex * 1000);
        productGlobalIndex++;

        const createdProduct = await prisma.product.create({
          data: {
            title: prod.title,
            description: prod.description,
            image: prod.image,
            tag: prod.tag || null,
            categoryId: category.id,
            subcategoryId: subcategory.id,
            createdAt: productCreatedAt,
            updatedAt: productCreatedAt,
          },
        });
        console.log(`      • 🏷️ [Pos ${prodIdx + 1}] Product: "${createdProduct.title}"`);
      }
    }
  }

  console.log("\n=================================");
  console.log(`✅ Ordered Seeding Complete!`);
  console.log(`📁 Categories: ${totalCategories}`);
  console.log(`📂 Subcategories: ${subcategoryGlobalIndex}`);
  console.log(`🏷️ Products: ${productGlobalIndex}`);
  console.log("=================================");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
