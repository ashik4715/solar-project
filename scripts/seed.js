const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Simple schema definitions for seed script
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  category: mongoose.Schema.Types.ObjectId,
  price: Number,
  salePrice: Number,
  sku: String,
});

const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const adminPassword = await bcryptjs.hash(
      process.env.ADMIN_PASSWORD || "ChangeMe123!",
      10,
    );
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || "admin@solarstore.com",
      password: adminPassword,
      name: "Admin User",
      role: "admin",
    });
    console.log("✓ Admin user created:", admin.email);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: "Solar Panels",
        slug: "solar-panels",
        description:
          "High-efficiency solar panels for residential and commercial use",
      },
      {
        name: "Inverters",
        slug: "inverters",
        description: "Solar inverters and power conversion equipment",
      },
      {
        name: "Batteries & Storage",
        slug: "batteries-storage",
        description: "Energy storage solutions for solar systems",
      },
      {
        name: "Installation Service",
        slug: "installation-service",
        description: "Professional solar installation and setup services",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Solar system accessories and components",
      },
    ]);
    console.log(`✓ Created ${categories.length} categories`);

    // Create products
    const products = await Product.insertMany([
      {
        name: "6.6kW Solar Package",
        slug: "6-6kw-solar-package",
        description: "6x 1.1kW panels with 6.6kW inverter",
        category: categories[0]._id,
        price: 390000,
        salePrice: 365000,
        sku: "SOL-6.6KW-001",
      },
      {
        name: "10kW Solar Package",
        slug: "10kw-solar-package",
        description: "10x 1kW panels with 10kW inverter",
        category: categories[0]._id,
        price: 540000,
        salePrice: 515000,
        sku: "SOL-10KW-001",
      },
      {
        name: "13.3kW Solar Package",
        slug: "13-3kw-solar-package",
        description: "13x 1kW panels with 13.3kW inverter",
        category: categories[0]._id,
        price: 695000,
        salePrice: 665000,
        sku: "SOL-13.3KW-001",
      },
      {
        name: "20kW Solar Package",
        slug: "20kw-solar-package",
        description: "20x 1kW panels with 20kW inverter",
        category: categories[0]._id,
        price: 980000,
        salePrice: 950000,
        sku: "SOL-20KW-001",
      },
      {
        name: "5kW Hybrid Inverter",
        slug: "5kw-hybrid-inverter",
        description: "Grid-tie hybrid inverter with battery backup",
        category: categories[1]._id,
        price: 95000,
        salePrice: 90000,
        sku: "INV-5KW-HY-001",
      },
      {
        name: "Lithium Battery 10kWh",
        slug: "lithium-battery-10kwh",
        description: "High-capacity lithium energy storage",
        category: categories[2]._id,
        price: 350000,
        salePrice: 330000,
        sku: "BAT-10KWH-LI-001",
      },
    ]);
    console.log(`✓ Created ${products.length} products`);

    console.log("\n✅ Seed completed successfully!");
    console.log("\nAdmin Credentials:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "ChangeMe123!"}`);
    console.log("\nTest Admin Login at: http://localhost:3000/admin");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
