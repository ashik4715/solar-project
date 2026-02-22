# ⚡ Quick Start Guide

Get Solar Store running in 3 minutes!

## Step 1: Setup MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new cluster
4. Click "Connect" → "Drivers"
5. Copy the connection string
6. Replace `<password>` with your actual password

## Step 2: Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solar-store

# For Gmail (optional, for email features):
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Get from: https://myaccount.google.com/apppasswords

ADMIN_EMAIL=admin@solarstore.com
ADMIN_PASSWORD=ChangeMe123!
```

## Step 3: Start Development (instant!)

```bash
# Install dependencies (if not already done)
npm install

# Seed database with sample data
npm run db:seed

# Start dev server
npm run dev
```

**That's it!** 🎉

## 🔗 Access Points

| Page        | URL                               | Purpose         |
| ----------- | --------------------------------- | --------------- |
| Homepage    | http://localhost:3000             | Main website    |
| Admin Login | http://localhost:3000/admin       | Admin panel     |
| Products    | http://localhost:3000/products    | Product catalog |
| Get Quote   | http://localhost:3000/quotes      | Quote request   |
| After-Sales | http://localhost:3000/after-sales | Services        |
| API Docs    | http://localhost:3000/api/docs    | Swagger UI      |

## 👨‍💼 Admin Login Credentials

After running `npm run db:seed`, you'll see this output:

```
Admin Credentials:
Email: admin@solarstore.com
Password: ChangeMe123!
```

Use these to login at [http://localhost:3000/admin](http://localhost:3000/admin)

## ✨ What You Can Do Now

### As an Admin:

- ✅ Create products and categories
- ✅ View customer list
- ✅ Generate and send quotes
- ✅ View contact submissions
- ✅ Upload product images
- ✅ Manage site settings

### As a Customer:

- ✅ Browse products
- ✅ Request free quotes
- ✅ Submit contact forms
- ✅ View after-sales services
- ✅ Contact customer support

## 📊 Test the APIs

Use the Swagger documentation at http://localhost:3000/api/docs

Example: Try the **Create Product** endpoint:

1. Click on "Products" → "POST /api/products"
2. Click "Try it out"
3. Enter product data and click "Execute"

## 🆘 Common Issues

### Port 3000 Already in Use

```bash
# Kill the process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### MongoDB Connection Failed

```
✓ Check MONGODB_URI in .env.local
✓ Ensure your IP is whitelisted in MongoDB Atlas
✓ Verify password doesn't have special chars (or URL encode them)
```

### Email Not Sending

```
✓ Check SMTP credentials are correct
✓ Gmail users: Use app-specific password (not regular password)
✓ Check that "Less secure app access" is enabled (if not using app password)
```

### Admin Login Not Working

```bash
# Reset admin user
npm run db:seed

# Clear browser cookies
# Try again
```

## 📚 Next Steps

1. **Customize Homepage**: Edit `src/app/page.tsx`
2. **Add Products**: Use admin dashboard at `/admin/products`
3. **Change Colors**: Update color codes in component files (search for `#2d5016` for green, `#4CAF50` for primary)
4. **Configure Email**: Set up SendGrid or Gmail SMTP
5. **Enable Payments**: Add Stripe keys to `.env.local`
6. **Deploy**: Follow Vercel deployment guide in README.md

## 🚀 Deploy to Production

When ready to go live:

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel (see README.md for detailed steps)
git push origin main
```

## 💡 Tips

- **Edit Styles**: Global styles in `src/app/globals.css`
- **Change URLs**: Update links in `src/app/page.tsx`
- **Add New Categories**: Use admin dashboard or API
- **View Logs**: Check browser console and terminal for errors
- **Debug API**: Use curl or Postman with `/api/docs`

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Review **API Documentation** at `/api/docs`
3. Check browser console for error messages
4. Look at terminal output for server errors

---

**You're all set!** Start building your solar business platform! ☀️

Questions? Check the full README.md for comprehensive documentation.
