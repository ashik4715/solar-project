const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Models
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    videoUrl: String,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    seoTags: {
      title: String,
      description: String,
      keywords: String,
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    longDescription: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: { type: Number, required: true },
    salePrice: Number,
    images: [String],
    videos: [String],
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    specifications: mongoose.Schema.Types.Mixed,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    seoTags: {
      title: String,
      description: String,
      keywords: String,
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/solar-store",
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing categories and products");

    // Create categories
    const categoriesData = [
      {
        name: "Solar Panels",
        slug: "solar-panels",
        description:
          "High-efficiency solar panels for residential and commercial use",
        image: "https://via.placeholder.com/300x200?text=Solar+Panels",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Panels - Best Solar Energy Solutions",
          description:
            "Premium solar panels for home and business energy needs",
          keywords:
            "solar panels, photovoltaic, solar energy, renewable energy",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "Inverters",
        slug: "inverters",
        description: "Power conversion devices for solar systems",
        image: "https://via.placeholder.com/300x200?text=Inverters",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Inverters - Power Conversion Solutions",
          description: "High-quality inverters for solar energy systems",
          keywords: "inverter, power conversion, solar inverter, DC to AC",
        },
        isActive: true,
        displayOrder: 2,
      },
      {
        name: "Batteries & Storage",
        slug: "batteries-storage",
        description: "Energy storage solutions for solar systems",
        image: "https://via.placeholder.com/300x200?text=Batteries",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Batteries - Energy Storage Solutions",
          description: "Reliable battery storage for solar power systems",
          keywords:
            "battery storage, solar battery, energy storage, lithium battery",
        },
        isActive: true,
        displayOrder: 3,
      },
      {
        name: "Mounting Systems",
        slug: "mounting-systems",
        description: "Roof and ground mounting systems for solar panels",
        image: "https://via.placeholder.com/300x200?text=Mounting",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Mounting Systems - Installation Solutions",
          description: "Professional mounting systems for solar panels",
          keywords: "mounting system, roof mount, solar installation, hardware",
        },
        isActive: true,
        displayOrder: 4,
      },
      {
        name: "Accessories & Parts",
        slug: "accessories-parts",
        description: "Solar system accessories and replacement parts",
        image: "https://via.placeholder.com/300x200?text=Accessories",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Accessories - Components & Parts",
          description: "Complete range of solar system accessories",
          keywords: "solar accessories, cables, connectors, parts, components",
        },
        isActive: true,
        displayOrder: 5,
      },
      {
        name: "Complete Kits",
        slug: "complete-kits",
        description: "Ready-to-install solar system kits",
        image: "https://via.placeholder.com/300x200?text=Kits",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        seoTags: {
          title: "Solar Kits - Complete System Packages",
          description: "All-in-one solar system kits for easy installation",
          keywords: "solar kit, package, complete system, installation kit",
        },
        isActive: true,
        displayOrder: 6,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products
    const productsData = [
      // Solar Panels
      {
        name: "Premium 400W Solar Panel",
        slug: "premium-400w-solar-panel",
        description:
          "High-efficiency monocrystalline solar panel with 400W output",
        longDescription:
          "Our premium 400W monocrystalline solar panels feature the latest technology for maximum energy conversion. With 22% efficiency and durability tested for 25+ years, these panels are ideal for residential and commercial installations.",
        category: createdCategories[0]._id,
        price: 45000,
        salePrice: 38999,
        images: ["https://via.placeholder.com/400x300?text=400W+Panel"],
        videos: [],
        stock: 150,
        sku: "PANEL-400W-001",
        specifications: {
          power: "400W",
          efficiency: "22%",
          dimensions: "1956 x 992 x 40 mm",
          weight: "22 kg",
          warranty: "25 years",
          voltage: "48V",
          current: "8.33A",
        },
        rating: 4.8,
        reviewCount: 245,
        seoTags: {
          title: "Premium 400W Monocrystalline Solar Panel",
          description: "High-efficiency 400W solar panel for home and business",
          keywords: "400W solar panel, monocrystalline, high efficiency",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "Ultra-Efficient 550W Solar Panel",
        slug: "ultra-efficient-550w-solar-panel",
        description:
          "Latest generation 550W monocrystalline solar panel with highest efficiency",
        longDescription:
          "Experience the future of solar energy with our 550W ultra-efficient panels. Featuring cutting-edge technology and superior build quality, these panels deliver exceptional performance in all weather conditions.",
        category: createdCategories[0]._id,
        price: 62000,
        salePrice: 54999,
        images: ["https://via.placeholder.com/400x300?text=550W+Panel"],
        videos: [],
        stock: 100,
        sku: "PANEL-550W-001",
        specifications: {
          power: "550W",
          efficiency: "23.5%",
          dimensions: "2256 x 1092 x 40 mm",
          weight: "27 kg",
          warranty: "30 years",
          voltage: "48V",
          current: "11.46A",
        },
        rating: 4.9,
        reviewCount: 189,
        seoTags: {
          title: "Ultra-Efficient 550W Solar Panel - Top Tier Performance",
          description: "Premium 550W panel with 23.5% efficiency",
          keywords: "550W solar panel, high efficiency, monocrystalline",
        },
        isActive: true,
        displayOrder: 2,
      },
      {
        name: "Economy 300W Solar Panel",
        slug: "economy-300w-solar-panel",
        description:
          "Affordable 300W polycrystalline solar panel for budget-conscious buyers",
        longDescription:
          "Get started with solar energy without breaking the bank. Our economy 300W panels offer reliable performance at an unbeatable price point. Perfect for small to medium installations.",
        category: createdCategories[0]._id,
        price: 28000,
        salePrice: 23999,
        images: ["https://via.placeholder.com/400x300?text=300W+Panel"],
        videos: [],
        stock: 200,
        sku: "PANEL-300W-001",
        specifications: {
          power: "300W",
          efficiency: "18%",
          dimensions: "1765 x 992 x 40 mm",
          weight: "20 kg",
          warranty: "12 years",
          voltage: "36V",
          current: "8.33A",
        },
        rating: 4.2,
        reviewCount: 412,
        seoTags: {
          title: "Economy 300W Solar Panel - Affordable Solar Solution",
          description: "Budget-friendly 300W polycrystalline panel",
          keywords: "300W solar panel, polycrystalline, affordable",
        },
        isActive: true,
        displayOrder: 3,
      },

      // Inverters
      {
        name: "5kW Hybrid Inverter",
        slug: "5kw-hybrid-inverter",
        description:
          "Intelligent 5kW hybrid inverter with battery charging capability",
        longDescription:
          "Advanced 5kW hybrid inverter designed for maximum efficiency. Features MPPT charging, grid tie capability, and seamless battery integration. Ideal for homes and small businesses transitioning to solar.",
        category: createdCategories[1]._id,
        price: 85000,
        salePrice: 74999,
        images: ["https://via.placeholder.com/400x300?text=5kW+Inverter"],
        videos: [],
        stock: 50,
        sku: "INV-5KW-001",
        specifications: {
          power: "5kW",
          inputVoltage: "48V DC",
          outputVoltage: "230V AC",
          frequency: "50Hz",
          efficiency: "97%",
          features: "MPPT, Battery Charging, Grid Tie",
        },
        rating: 4.7,
        reviewCount: 98,
        seoTags: {
          title: "5kW Hybrid Solar Inverter - Smart Power Management",
          description: "Efficient 5kW hybrid inverter with battery capability",
          keywords: "hybrid inverter, 5kW, MPPT, solar inverter",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "10kW Three-Phase Inverter",
        slug: "10kw-three-phase-inverter",
        description:
          "Commercial-grade 10kW three-phase inverter for large installations",
        longDescription:
          "Professional 10kW three-phase inverter built for demanding commercial and industrial applications. Features advanced monitoring, high reliability, and superior performance.",
        category: createdCategories[1]._id,
        price: 180000,
        salePrice: 159999,
        images: ["https://via.placeholder.com/400x300?text=10kW+Inverter"],
        videos: [],
        stock: 25,
        sku: "INV-10KW-001",
        specifications: {
          power: "10kW",
          phase: "Three-Phase",
          inputVoltage: "400V AC",
          outputVoltage: "400V AC",
          frequency: "50Hz",
          efficiency: "98.5%",
        },
        rating: 4.9,
        reviewCount: 67,
        seoTags: {
          title: "10kW Three-Phase Solar Inverter - Commercial Grade",
          description: "Professional 10kW inverter for large solar systems",
          keywords: "three-phase inverter, 10kW, commercial, industrial",
        },
        isActive: true,
        displayOrder: 2,
      },
      {
        name: "3kW String Inverter",
        slug: "3kw-string-inverter",
        description:
          "Compact 3kW string inverter for residential installations",
        longDescription:
          "Perfect for small to medium residential solar systems. Our compact 3kW string inverter features smart monitoring, weather-resistant design, and wall-mounted installation option.",
        category: createdCategories[1]._id,
        price: 45000,
        salePrice: 38999,
        images: ["https://via.placeholder.com/400x300?text=3kW+Inverter"],
        videos: [],
        stock: 80,
        sku: "INV-3KW-001",
        specifications: {
          power: "3kW",
          inputVoltage: "400V AC",
          outputVoltage: "230V AC",
          frequency: "50Hz",
          efficiency: "96.8%",
          features: "WiFi Monitoring, Grid Tie",
        },
        rating: 4.5,
        reviewCount: 156,
        seoTags: {
          title: "3kW String Solar Inverter - Residential Solution",
          description: "Efficient 3kW string inverter for homes",
          keywords: "string inverter, 3kW, residential, solar",
        },
        isActive: true,
        displayOrder: 3,
      },

      // Batteries
      {
        name: "10kWh Lithium Battery Pack",
        slug: "10kwh-lithium-battery-pack",
        description:
          "High-capacity 10kWh lithium-ion battery for energy storage",
        longDescription:
          "Store your solar energy efficiently with our 10kWh lithium battery pack. Features advanced BMS, 98% round-trip efficiency, and 10+ year lifespan. Perfect for off-grid or backup power.",
        category: createdCategories[2]._id,
        price: 420000,
        salePrice: 379999,
        images: ["https://via.placeholder.com/400x300?text=10kWh+Battery"],
        videos: [],
        stock: 15,
        sku: "BATT-LI-10-001",
        specifications: {
          capacity: "10kWh",
          type: "Lithium-ion",
          voltage: "48V",
          cycleLlife: "5000+ cycles",
          efficiency: "98%",
          warranty: "10 years",
        },
        rating: 4.8,
        reviewCount: 78,
        seoTags: {
          title: "10kWh Lithium Battery - High Capacity Energy Storage",
          description: "Advanced lithium battery for solar storage",
          keywords: "lithium battery, 10kWh, energy storage, solar battery",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "5kWh Modular Battery System",
        slug: "5kwh-modular-battery-system",
        description:
          "Scalable 5kWh modular battery system that can be expanded",
        longDescription:
          "Build your energy storage solution with our modular 5kWh batteries. Start small and expand as needed. Each module is independently managed for maximum flexibility and reliability.",
        category: createdCategories[2]._id,
        price: 210000,
        salePrice: 185999,
        images: ["https://via.placeholder.com/400x300?text=5kWh+Battery"],
        videos: [],
        stock: 35,
        sku: "BATT-MOD-5-001",
        specifications: {
          capacity: "5kWh per module",
          type: "Lithium LiFePO4",
          voltage: "48V",
          modular: true,
          efficiency: "97%",
          warranty: "8 years",
        },
        rating: 4.6,
        reviewCount: 112,
        seoTags: {
          title: "5kWh Modular Battery System - Scalable Storage",
          description: "Expandable modular battery for solar systems",
          keywords: "modular battery, 5kWh, expandable, LiFePO4",
        },
        isActive: true,
        displayOrder: 2,
      },

      // Mounting Systems
      {
        name: "Aluminum Roof Mounting Kit",
        slug: "aluminum-roof-mounting-kit",
        description: "Complete aluminum roof mounting system for solar panels",
        longDescription:
          "Professional-grade aluminum mounting kit suitable for pitched or flat roofs. Includes all hardware, adjustable angles, and installation guides. Supports up to 12 panels.",
        category: createdCategories[3]._id,
        price: 28000,
        salePrice: 23999,
        images: ["https://via.placeholder.com/400x300?text=Roof+Mount"],
        videos: [],
        stock: 45,
        sku: "MOUNT-ROOF-ALU-001",
        specifications: {
          material: "Aluminum Alloy",
          capacity: "Up to 12 panels",
          adjustableAngle: "5° to 40°",
          windLoad: "Up to 150 km/h",
          warranty: "10 years",
          installation: "Professional recommended",
        },
        rating: 4.4,
        reviewCount: 89,
        seoTags: {
          title: "Aluminum Roof Mounting Kit - Professional Installation",
          description: "Quality mounting system for roof installation",
          keywords: "roof mount, aluminum, mounting kit, solar installation",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "Steel Ground Mounting System",
        slug: "steel-ground-mounting-system",
        description: "Heavy-duty steel ground mounting for large installations",
        longDescription:
          "Industrial-strength steel mounting system designed for ground installations. Perfect for large residential systems, commercialinstallations, or solar farms. Includes concrete foundation specifications.",
        category: createdCategories[3]._id,
        price: 45000,
        salePrice: 39999,
        images: ["https://via.placeholder.com/400x300?text=Ground+Mount"],
        videos: [],
        stock: 20,
        sku: "MOUNT-GROUND-STEEL-001",
        specifications: {
          material: "Hot-dip Galvanized Steel",
          capacity: "20+ panels",
          adjustableAngle: "0° to 60°",
          windLoad: "Up to 200 km/h",
          warranty: "15 years",
          foundation: "Concrete required",
        },
        rating: 4.7,
        reviewCount: 65,
        seoTags: {
          title: "Steel Ground Mounting - Industrial Solar Installation",
          description: "Heavy-duty ground mounting for large systems",
          keywords: "ground mount, steel, industrial mounting, solar farm",
        },
        isActive: true,
        displayOrder: 2,
      },

      // Complete Kits
      {
        name: "5kW Complete Solar Kit",
        slug: "5kw-complete-solar-kit",
        description: "All-in-one 5kW solar system kit - everything you need",
        longDescription:
          "Complete 5kW solar solution including panels, inverter, mounting, cables, and installation guide. Ideal for homes with high energy consumption. Everything pre-matched for optimal performance.",
        category: createdCategories[5]._id,
        price: 385000,
        salePrice: 329999,
        images: ["https://via.placeholder.com/400x300?text=5kW+Kit"],
        videos: [],
        stock: 12,
        sku: "KIT-5KW-COMPLETE-001",
        specifications: {
          systemSize: "5kW",
          panelCount: "13 x 400W panels",
          inverter: "5kW Hybrid",
          mounting: "Roof or Ground",
          includes: "Panels, Inverter, Cables, Brackets, Installation Guide",
          warranty: "25 year panel + 10 year inverter",
        },
        rating: 4.9,
        reviewCount: 156,
        seoTags: {
          title: "5kW Complete Solar Kit - Ready to Install",
          description: "All-in-one solar system for homes",
          keywords: "solar kit, 5kW, complete system, ready to install",
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "3kW Starter Solar Kit",
        slug: "3kw-starter-solar-kit",
        description: "Perfect starter kit for small residential installations",
        longDescription:
          "Start your solar journey with our affordable 3kW starter kit. Includes everything needed for a basic solar setup. Easy to install and perfect for first-time users.",
        category: createdCategories[5]._id,
        price: 198000,
        salePrice: 165999,
        images: ["https://via.placeholder.com/400x300?text=3kW+Kit"],
        videos: [],
        stock: 25,
        sku: "KIT-3KW-STARTER-001",
        specifications: {
          systemSize: "3kW",
          panelCount: "8 x 400W panels",
          inverter: "3kW String",
          mounting: "Roof Mount",
          includes: "Panels, Inverter, Cables, Brackets, Installation Guide",
          warranty: "25 year panel + 5 year inverter",
        },
        rating: 4.3,
        reviewCount: 234,
        seoTags: {
          title: "3kW Starter Solar Kit - Affordable Beginning",
          description: "Budget-friendly solar system for beginners",
          keywords: "starter kit, 3kW, solar beginner, affordable",
        },
        isActive: true,
        displayOrder: 2,
      },
      {
        name: "10kW Premium Solar Kit with Battery",
        slug: "10kw-premium-solar-kit-with-battery",
        description: "Premium 10kW system with battery storage and monitoring",
        longDescription:
          "Ultimate solar solution for maximum energy independence. Includes premium panels, hybrid inverter, 10kWh battery storage, smart monitoring system, and professional installation support.",
        category: createdCategories[5]._id,
        price: 850000,
        salePrice: 749999,
        images: ["https://via.placeholder.com/400x300?text=10kW+Kit"],
        videos: [],
        stock: 5,
        sku: "KIT-10KW-PREMIUM-BATT-001",
        specifications: {
          systemSize: "10kW",
          panelCount: "20 x 550W panels",
          inverter: "10kW Hybrid",
          battery: "10kWh Lithium",
          monitoring: "WiFi + App",
          warranty: "Full system coverage",
        },
        rating: 5.0,
        reviewCount: 45,
        seoTags: {
          title: "10kW Premium Solar Kit with Battery - Complete Independence",
          description: "Premium solar system with energy storage",
          keywords:
            "10kW solar kit, premium, battery storage, energy independence",
        },
        isActive: true,
        displayOrder: 3,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log("\n📊 Seeding Summary:");
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log("\n✅ Database seeding completed successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
