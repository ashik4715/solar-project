/**
 * Admin Seeder for Testing - Creates admin users with unlimited access
 * Run with: node scripts/admin-seeder.js
 */

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

// Define User schema inline for testing
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  phone: String,
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

// Define Customer schema inline for testing
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  segment: {
    type: String,
    enum: ["residential", "commercial", "industrial"],
    default: "residential",
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Customer = mongoose.model("Customer", customerSchema);

async function seedAdmins() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    // Delete existing admin users
    await User.deleteMany({ role: "admin" });
    console.log("✓ Cleared existing admin users");

    // Create multiple admin users for testing
    const adminUsers = [
      {
        email: "admin@solarstore.com",
        password: "admin123!",
        role: "admin",
        phone: "9876543210",
      },
      {
        email: "superadmin@solarstore.com",
        password: "superAdmin123!",
        role: "admin",
        phone: "9876543212",
      },
    ];

    // Hash passwords and create users
    for (const adminData of adminUsers) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(adminData.password, salt);

      const admin = new User({
        ...adminData,
        password: hashedPassword,
      });

      await admin.save();
      console.log(
        `✓ Created admin: ${adminData.email} (password: ${adminData.password})`,
      );
    }

    // Create test customer
    const customerSalt = await bcryptjs.genSalt(10);
    const customerPassword = await bcryptjs.hash("customer123!", customerSalt);

    const customer = new User({
      name: "Test Customer",
      email: "customer@solarstore.com",
      password: customerPassword,
      role: "customer",
      phone: "9876543213",
    });

    await customer.save();

    // Also create a Customer record for the test customer
    const customerRecord = new Customer({
      name: "Test Customer",
      email: "customer@solarstore.com",
      phone: "9876543213",
      segment: "residential",
      isActive: true,
    });

    try {
      await customerRecord.save();
      console.log("✓ Created customer record: customer@solarstore.com");
    } catch (e) {
      console.warn("⚠️  Customer record may already exist");
    }

    console.log(
      "✓ Created test customer user: customer@solarstore.com (password: customer123!)",
    );

    console.log("\n📋 Admin Users Created Successfully!");
    console.log("Test Credentials:");
    console.log("  Email: admin@solarstore.com");
    console.log("  Password: admin123!");
    console.log("\n📋 Super Admin Users Created Successfully!");
    console.log("Test Credentials:");
    console.log("  Email: superadmin@solarstore.com");
    console.log("  Password: superAdmin123!");
    console.log("  Role: Admin (Full Access)");
    console.log("\n  Email: customer@solarstore.com");
    console.log("  Password: customer123!");
    console.log("  Role: Customer (Limited Access)");

    await mongoose.disconnect();
    console.log("\n✓ Database seeding completed");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
}

seedAdmins();
