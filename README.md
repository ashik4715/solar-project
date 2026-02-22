# Solar Store - E-Commerce Platform

A comprehensive Next.js-based e-commerce platform for solar energy products and services, featuring admin dashboard, customer quotes, invoicing, and after-sales service management.

## 🚀 Features

### Frontend

- **Homepage**: Hero section, product showcase, testimonials, FAQ section
- **Product Catalog**: Browse products by category, detailed product pages
- **Quotes System**: Free quote generation and request submission
- **After-Sales Services**: Service booking and support information
- **Responsive Design**: Bulma CSS framework for beautiful UI
- **SEO Optimized**: Meta tags, structured data for all pages

### Admin Dashboard

- **Authentication**: Session-based role-based access control
- **Products**: CRUD operations, bulk management, image/video upload
- **Categories**: Organize products with nested category support
- **Customers**: CRM interface, customer segmentation
- **Quotes**: Generate, track, and email quotes to customers
- **Orders**: Order management, payment tracking
- **Analytics**: Dashboard with key metrics and statistics

### Backend APIs

- **RESTful API**: Complete API for all operations
- **Swagger Documentation**: Interactive API documentation at `/api/docs`
- **Authentication**: Session-based login system
- **Email Notifications**: Quote confirmations, order updates
- **SMS Notifications**: Order and service alerts via Twilio
- **File Uploads**: Image/video handling with optional AWS S3 sync

### Database

- **MongoDB**: Flexible NoSQL database with complete schema
- **Mongoose ODM**: Type-safe schema definitions
- **Collections**:
  - Users, Customers
  - Products, Categories
  - Quotes, Orders, Invoices
  - FAQs, Testimonials, Blog Posts
  - After-Sales Services, Service Bookings
  - Contact Submissions, SEO Tags, Hero Sections

## 📋 Prerequisites

- Node.js 18+ (or use `nvm install 18`)
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone & Setup Environment

```bash
cd /path/to/solar-store
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Required variables to configure**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solar-store
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@solarstore.com
ADMIN_PASSWORD=ChangeMe123!
```

**Optional variables** (for advanced features):

- AWS S3 (image CDN)
- Stripe (payment processing)
- Twilio (SMS notifications)
- SendGrid (email API)

### 3. Initialize Database

```bash
npm run db:seed
```

This will:

- Create admin user with credentials from `.env.local`
- Populate sample categories and products
- Set up database indexes

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Quick Start

### Admin Dashboard

- Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
- Login with credentials printed during seed process
- Start adding products, categories, and managing quotes

### Public Pages

- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Products**: [http://localhost:3000/products](http://localhost:3000/products)
- **Get Quote**: [http://localhost:3000/quotes](http://localhost:3000/quotes)
- **After-Sales**: [http://localhost:3000/after-sales](http://localhost:3000/after-sales)

### API Documentation

- **Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **OpenAPI Schema**: [http://localhost:3000/api/swagger.json](http://localhost:3000/api/swagger.json)

## 📁 Project Structure

```
solar-store/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── customers/     # Customer management
│   │   │   ├── quotes/        # Quote generation
│   │   │   ├── contact/       # Contact form
│   │   │   └── docs/          # Swagger documentation
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── products/          # Public product pages
│   │   ├── quotes/            # Public quote pages
│   │   └── after-sales/       # After-sales service pages
│   ├── models/                # MongoDB Mongoose schemas
│   ├── components/            # React components
│   ├── utils/                 # Utility functions
│   │   ├── helpers.ts         # Password, slug, ID generation
│   │   ├── email.ts           # Email templates and sending
│   │   ├── sms.ts             # SMS notifications
│   │   ├── s3.ts              # AWS S3 integration
│   │   ├── pdf.ts             # PDF generation
│   │   └── response.ts        # API response wrapper
│   ├── lib/                   # Library functions
│   │   └── mongodb.ts         # MongoDB connection
│   ├── middleware/            # Auth and custom middleware
│   └── config/                # Configuration
│       └── swagger.ts         # Swagger/OpenAPI config
├── public/
│   └── uploads/               # Local file uploads
├── scripts/
│   └── seed.js               # Database seeding script
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── next.config.js            # Next.js config
```

## 🔐 Authentication

The platform uses **session-based authentication**:

1. User logs in with email/password
2. System creates encrypted session stored in browser cookie
3. Session cookie sent with every request
4. Admin role validated for protected routes

### Admin Roles

- **admin**: Full access to dashboard and all features
- **customer**: Can view quotes, orders, and profile

### Protecting Routes

```typescript
// Check session in API:
const session = request.cookies.get("session")?.value;
if (!session) return Unauthorized;

// Client-side:
const response = await fetch("/api/auth/me");
if (response.status === 401) router.push("/admin");
```

## 📧 Email Configuration

### Using Gmail SMTP

1. Enable 2-factor authentication on Gmail
2. Generate app-specific password: https://myaccount.google.com/apppasswords
3. Set in `.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

### Using SendGrid (Alternative)

1. Get API key from SendGrid
2. Set in `.env.local`:

```
SENDGRID_API_KEY=SG.xxxxx
```

## 📱 SMS Notifications (Optional)

Setup Twilio for SMS alerts:

1. Create Twilio account: https://www.twilio.com/
2. Get Account SID, Auth Token, and phone number
3. Set in `.env.local`:

```
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

## 💳 Payment Integration

### Stripe Setup

1. Create Stripe account: https://stripe.com/
2. Get publishable and secret keys
3. Set in `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
```

## 📦 Image & Video Upload

### Local Upload (Default)

Files are stored in `public/uploads/`. Works offline but not suitable for production.

### AWS S3 (Recommended for Production)

1. Create AWS S3 bucket
2. Enable CloudFront CDN
3. Set in `.env.local`:

```
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

The system automatically syncs local uploads to S3 when configured.

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Connect to Vercel

1. Visit vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET` / `SESSION_SECRET`
   - `STRIPE_SECRET_KEY`
   - All other keys from `.env.example`
5. Click "Deploy"

### 3. Post-Deployment

- Update `NEXT_PUBLIC_API_URL` to your Vercel domain
- Run seed script in production (via Vercel CLI)
- Configure custom domain in Vercel settings

## 📊 API Endpoints Summary

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - List products with pagination
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Customers

- `GET /api/customers` - List customers (admin)
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details (admin)

### Quotes

- `GET /api/quotes` - List quotes
- `POST /api/quotes` - Create quote
- `POST /api/quotes/send` - Send quote via email (admin)
- `POST /api/quotes/accept` - Accept quote and create order

### Contact

- `POST /api/contact` - Submit contact form

### Upload

- `POST /api/upload` - Upload file (multipart/form-data)

### Documentation

- `GET /api/docs` - Swagger UI
- `GET /api/swagger.json` - OpenAPI schema

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database
npm run db:seed
```

## 🎓 Database Schema Examples

### User Document

```json
{
  "_id": "ObjectId",
  "email": "admin@solarstore.com",
  "password": "hashed_password",
  "name": "Admin User",
  "role": "admin",
  "isActive": true,
  "lastLogin": "2024-02-22T10:30:00Z",
  "createdAt": "2024-02-22T10:30:00Z"
}
```

### Product Document

```json
{
  "_id": "ObjectId",
  "name": "6.6kW Solar Package",
  "slug": "6-6kw-solar-package",
  "category": "ObjectId",
  "price": 390000,
  "salePrice": 365000,
  "sku": "SOL-6.6KW-001",
  "stock": 50,
  "images": ["url1", "url2"],
  "videos": ["video-url"],
  "rating": 4.5,
  "reviewCount": 12,
  "seoTags": {
    "title": "6.6kW Solar Panel System",
    "description": "Best solar package for residential homes",
    "keywords": "solar, 6.6kw, renewable energy"
  }
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check `MONGODB_URI` is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### Email Not Sending

- Check SMTP credentials in `.env.local`
- Verify app password for Gmail
- Check admin email in logs

### Admin Login Failed

- Reset with `npm run db:seed`
- Clear browser cookies
- Check SESSION_SECRET in `.env.local`

### API 401 Unauthorized

- Ensure session cookie is sent with request
- Check session expiration (7 days)
- Try logging out and logging back in

## 📝 License

MIT License - feel free to use this for your projects

## 🤝 Support

For issues or questions:

1. Check existing GitHub issues
2. Review API documentation at `/api/docs`
3. Contact support@solarstore.com

---

**Built with ❤️ using Next.js, MongoDB, and Stripe**

Version 1.0.0 - February 2024
>>>>>>> 1c5268c (Initial solar store setup with Husky build checks)
