# 📊 Database Schemas - Complete Reference

This document details all database schemas as per your requirements.

## 🔐 Users Collection

```typescript
{
  _id: ObjectId,
  email: String (required, unique, lowercase, indexed),
  hashedPassword: String (required, minimum 6 chars),
  name: String (optional),
  phone: String (optional),
  role: String (enum: "admin" | "customer", default: "customer"),
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Fully implemented in `/src/models/User.ts`

---

## 📝 Sessions Collection

```typescript
{
  _id: String (session ID),
  session: Object (serialized session data),
  expires: Date (session expiration)
}
```

**Current Implementation**: ✅ Cookie-based sessions with MongoDB support

- Stored in express-session
- connect-mongo integration available
- To enable: install `connect-mongo` and configure in middleware

**Configuration (when needed)**:

```typescript
import MongoStore from "connect-mongo";

app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }),
);
```

---

## 🏷️ Categories Collection

```typescript
{
  _id: ObjectId,
  name: String (required, indexed),
  slug: String (required, unique, lowercase),
  description: String (optional),
  image: String (optional, URL),
  videoUrl: String (optional, URL),
  parentId: ObjectId (optional, ref: Category for nested categories),
  seoMetaTags: {
    title: String (optional),
    description: String (optional),
    keywords: String (optional)
  },
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0, for sorting),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Fully implemented in `/src/models/Category.ts`

**Example Document**:

```json
{
  "_id": "ObjectId",
  "name": "Solar Panels",
  "slug": "solar-panels",
  "description": "High-efficiency solar panels for residential and commercial use",
  "image": "https://via.placeholder.com/300x200?text=Solar+Panels",
  "videoUrl": "https://www.youtube.com/embed/...",
  "parentId": null,
  "seoMetaTags": {
    "title": "Solar Panels - Best Solar Energy Solutions",
    "description": "Premium solar panels for home and business",
    "keywords": "solar panels, photovoltaic, renewable energy"
  },
  "isActive": true,
  "displayOrder": 1,
  "createdAt": "2024-02-23T...",
  "updatedAt": "2024-02-23T..."
}
```

---

## 📦 Products Collection

```typescript
{
  _id: ObjectId,
  name: String (required, indexed),
  slug: String (required, unique, lowercase),
  description: String (optional, short description),
  longDescription: String (optional, detailed description),
  category: ObjectId (required, ref: Category, indexed),
  price: Number (required),
  salePrice: Number (optional, for discounted price),
  images: [String] (array of image URLs),
  videos: [String] (array of video URLs),
  stock: Number (default: 0, quantity available),
  sku: String (required, unique, for inventory),
  specifications: Mixed (JSON object with product specs),
  rating: Number (0-5, default: 0),
  reviewCount: Number (default: 0),
  seoMetaTags: {
    title: String (optional),
    description: String (optional),
    keywords: String (optional)
  },
  isActive: Boolean (default: true),
  displayOrder: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Fully implemented in `/src/models/Product.ts`

**Example Document**:

```json
{
  "_id": "ObjectId",
  "name": "Premium 400W Solar Panel",
  "slug": "premium-400w-solar-panel",
  "description": "High-efficiency monocrystalline solar panel",
  "longDescription": "Our premium 400W monocrystalline solar panels...",
  "category": "ObjectId",
  "price": 45000,
  "salePrice": 38999,
  "images": ["https://image1.com", "https://image2.com"],
  "videos": ["https://video.com"],
  "stock": 150,
  "sku": "PANEL-400W-001",
  "specifications": {
    "power": "400W",
    "efficiency": "22%",
    "dimensions": "1956 x 992 x 40 mm",
    "weight": "22 kg",
    "warranty": "25 years",
    "voltage": "48V",
    "current": "8.33A"
  },
  "rating": 4.8,
  "reviewCount": 245,
  "seoMetaTags": {
    "title": "Premium 400W Solar Panel",
    "description": "High-efficiency 400W solar panel",
    "keywords": "400W, solar panel, monocrystalline"
  },
  "isActive": true,
  "displayOrder": 1
}
```

---

## 👥 Customers Collection

```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  address: String (optional),
  companyName: String (optional),
  notes: String (optional, admin notes),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/Customer.ts`

**Note**: Customer info can be linked to User via email

---

## 💬 Quotes Collection

```typescript
{
  _id: ObjectId,
  customer: ObjectId (ref: Customer),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number (price at time of quote)
    }
  ],
  totalAmount: Number (calculated),
  status: String (enum: "draft" | "sent" | "accepted", default: "draft"),
  validUntil: Date (expiration date),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/Quote.ts`

---

## 🛒 Orders Collection

```typescript
{
  _id: ObjectId,
  customer: ObjectId (ref: Customer),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: String (enum: "pending" | "completed" | "failed"),
  orderStatus: String (enum: "pending" | "processing" | "shipped" | "delivered" | "cancelled"),
  invoiceId: ObjectId (ref: Invoice),
  shippingAddress: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/Order.ts`

---

## 📄 Invoices Collection

```typescript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  invoiceNumber: String (unique),
  dueDate: Date,
  paidDate: Date (optional),
  amount: Number,
  items: [
    {
      product: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  seoTags: {
    title: String (optional),
    description: String (optional),
    keywords: String (optional)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/Invoice.ts`

---

## 🔍 SEO Tags Collection (Optional - Can be in other documents)

```typescript
{
  _id: ObjectId,
  pageUrl: String (required, unique, the page path),
  title: String (required, 50-60 chars for SEO),
  description: String (required, 150-160 chars),
  keywords: String (required, comma-separated),
  ogImage: String (optional, URL for open graph),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Integrated into Category and Product documents

---

## ❓ FAQs Collection

```typescript
{
  _id: ObjectId,
  category: String (optional, category for grouping),
  question: String (required),
  answer: String (required),
  order: Number (for sorting),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/FAQ.ts`

---

## ⭐ Testimonials Collection

```typescript
{
  _id: ObjectId,
  customerName: String (required),
  rating: Number (1-5, required),
  text: String (required),
  image: String (optional, profile image URL),
  isPublished: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/Testimonial.ts`

---

## 📚 Blog Posts Collection

```typescript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique, lowercase),
  content: String (required, markdown or HTML),
  author: String (required),
  image: String (optional, featured image),
  publishedAt: Date (optional, null if draft),
  seoMetaTags: {
    title: String (optional),
    description: String (optional),
    keywords: String (optional)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/BlogPost.ts`

---

## 🎬 Hero Sections Collection

```typescript
{
  _id: ObjectId,
  pageLocation: String (required, page identifier),
  title: String (required),
  description: String (optional),
  image: String (required, background image URL),
  videoUrl: String (optional),
  cta: {
    text: String (button text),
    url: String (button link)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/HeroSection.ts`

---

## 🔧 After Sale Services Collection

```typescript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  image: String (optional),
  serviceType: String (enum: "maintenance" | "repair" | "upgrade" | "support"),
  pricing: {
    basePrice: Number,
    unit: String ("per visit" | "monthly" | "yearly")
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/AfterSaleService.ts`

---

## 📧 Contact Submissions Collection

```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (optional),
  message: String (required),
  type: String (enum: "inquiry" | "support" | "feedback", default: "inquiry"),
  status: String (enum: "new" | "read" | "responded", default: "new"),
  response: String (optional, admin response),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Current Implementation**: ✅ Implemented in `/src/models/ContactSubmission.ts`

---

## 📋 Schema Implementation Checklist

- ✅ Users
- ✅ Sessions (cookie-based, MongoStore ready)
- ✅ Categories
- ✅ Products
- ✅ Customers
- ✅ Quotes
- ✅ Orders
- ✅ Invoices
- ✅ SEO Tags (integrated)
- ✅ FAQs
- ✅ Testimonials
- ✅ Blog Posts
- ✅ Hero Sections
- ✅ After Sale Services
- ✅ Contact Submissions

---

## 🔄 Relationships

### Database Diagram:

```
User (admin/customer)
├── Session (one-to-one)
├── Customer (one-to-one, via email)
│   ├── Quote (one-to-many)
│   │   └── Product (many-to-many)
│   ├── Order (one-to-many)
│   │   ├── Product (many-to-many)
│   │   └── Invoice (one-to-one)
│   └── Testimonial (one-to-many)
├── BlogPost (one-to-many, if author tracking)
└── ContactSubmission (one-to-many)

Category
├── Product (one-to-many)
└── Category (self-reference, for parent)

Product
├── Category (many-to-one)
├── Quote (many-to-many, via Quote.items)
└── Order (many-to-many, via Order.items)

HeroSection (standalone)
AfterSaleService (standalone)
SEO Tags (standalone)
FAQ (standalone)
```

---

## 🚀 Usage Examples

### Create a Category:

```javascript
const category = new Category({
  name: "Solar Panels",
  slug: "solar-panels",
  description: "High-efficiency solar panels",
  seoMetaTags: {
    title: "Solar Panels",
    description: "Premium solar panels",
    keywords: "solar, panels, energy",
  },
});
await category.save();
```

### Create a Product:

```javascript
const product = new Product({
  name: "400W Solar Panel",
  slug: "400w-solar-panel",
  category: categoryId,
  price: 45000,
  salePrice: 38999,
  stock: 150,
  sku: "PANEL-400W-001",
  specifications: {
    power: "400W",
    efficiency: "22%",
  },
});
await product.save();
```

### Create a Quote:

```javascript
const quote = new Quote({
  customer: customerId,
  items: [
    {
      product: productId,
      quantity: 2,
      price: 38999,
    },
  ],
  totalAmount: 77998,
  status: "draft",
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});
await quote.save();
```

---

All schemas are production-ready and tested! 🎉
