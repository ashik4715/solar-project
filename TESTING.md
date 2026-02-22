# Testing Guide & Known Issues

## Quick Start

### 1. Setup Test Environment

```bash
# Install seed data with admin users
npm run db:admin-seeder

# Start development server
npm run dev
```

### 2. Run Tests

```bash
# Run all tests with browser
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests in background (CI mode)
npm test

# Run specific test file
npx playwright test tests/admin-login.spec.ts
```

## Test Coverage

### ✅ Implemented Tests

#### 1. Admin Login Tests (`tests/admin-login.spec.ts`)

- **Valid login**: Tests successful authentication with correct email/password
- **Invalid credentials**: Tests rejection of wrong password
- **Empty credentials**: Validates form submission with no data
- **Missing password**: Tests email-only submission
- **Case sensitivity**: Tests email case handling
- **SQL injection**: Tests security against malicious input
- **Logout**: Tests session destruction
- **Brute force**: Tests multiple invalid attempts

**Credentials**:

- Email: `admin@solarstore.com`
- Password: `ChangeMe123!`

#### 2. Admin Access Control Tests (`tests/admin-access-control.spec.ts`)

- **Unauthenticated access**: Tests redirect to login for protected pages
- **Protected routes**: `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/customers`, `/admin/quotes`
- **Session persistence**: Tests cookie-based session across navigations
- **Role-based navigation**: Tests access to admin-specific pages

#### 3. CRUD Operations Tests (`tests/crud-operations.spec.ts`)

- **Create category**: Tests category creation with validation
- **Create product**: Tests product creation with name and price
- **Read operations**: Tests listing of categories, products, customers
- **Form validation**: Tests required field validation
- **Duplicate handling**: Tests handling of duplicate entries
- **Error handling**: Tests graceful error display

#### 4. API Endpoints Tests (`tests/api-endpoints.spec.ts`)

- **Auth endpoints**: POST `/api/auth/login`, GET `/api/auth/me`
- **Product endpoints**: GET `/api/products`, POST `/api/products`
- **Category endpoints**: GET `/api/categories`, POST `/api/categories`
- **Customer endpoints**: GET `/api/customers`
- **Quote endpoints**: POST `/api/quotes`, POST `/api/quotes/send`, POST `/api/quotes/accept`
- **Contact endpoint**: POST `/api/contact`
- **Upload endpoint**: POST `/api/upload`
- **Documentation**: GET `/api/docs`, GET `/api/swagger.json`
- **Security**: Tests proper authentication requirements
- **Concurrency**: Tests handling of concurrent requests
- **Response headers**: Tests proper Content-Type headers

#### 5. Customer User Flow Tests (`tests/customer-flow.spec.ts`)

- **Homepage access**: Tests public page access
- **Product browsing**: Tests `/products` page
- **Quote form**: Tests quote request form submission
- **Contact form**: Tests contact form on homepage
- **After-sales access**: Tests `/after-sales` page
- **Form validation**: Tests required field validation
- **Mobile responsive**: Tests responsive design on mobile viewport
- **Error handling**: Tests graceful handling of network errors
- **404 handling**: Tests behavior on invalid pages

## Known Issues & Workarounds

### 🐛 Issue #1: Swagger UI Layout Breaks

**Status**: NEEDS FIX  
**Problem**: Swagger documentation at `/api/docs` may have layout issues or not load properly  
**Root Cause**: Swagger UI CDN dependency or styling conflicts

**Workaround**:

```bash
# Check if Swagger endpoint returns HTML
curl http://localhost:3000/api/docs

# Kill dev server and restart
npm run dev
```

**Fix Needed**:

- [ ] Review `/src/app/api/docs/route.ts` for proper HTML structure
- [ ] Verify Swagger UI CDN links are accessible
- [ ] Check for CSS conflicts with Bulma framework
- [ ] Consider using `swagger-ui-react` package instead

---

### 🐛 Issue #2: MongoDB Connection in Tests

**Status**: CONFIGURATION REQUIRED  
**Problem**: Tests may fail if MongoDB is not configured

**Solution**:

```bash
# Make sure .env has valid MONGODB_URI
echo "MONGODB_URI=mongodb://localhost:27017/solar-store-test" >> .env.local

# Or use MongoDB Atlas
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solar-store-test" >> .env.local
```

---

### 🐛 Issue #3: Session Authentication in Browser Tests

**Status**: WORKING  
**Current State**: Session-based auth works with cookies

**Note**: Unlike JWT, sessions require:

- `httpOnly` cookies enabled
- Session store configured (currently in-memory)
- Database connection for production

**For Production Test**:

```bash
# Use connect-mongo for session persistence
npm install connect-mongo --save
```

Then update `/src/lib/mongodb.ts` to integrate MongoStore.

---

### 🐛 Issue #4: API Tests May Need Authentication

**Status**: PARTIAL IMPLEMENTATION  
**Problem**: Some API routes expect authentication but tests don't send session cookies

**Fix Needed**:

```javascript
// Update tests/api-endpoints.spec.ts to include:
test("API with session authentication", async ({ request }) => {
  // First login to get session cookie
  const loginResponse = await request.post("/api/auth/login", {
    data: { email: "admin@solarstore.com", password: "ChangeMe123!" },
  });

  // Get cookies from response
  const cookies = loginResponse.headers()["set-cookie"];

  // Use cookies in subsequent requests
  const response = await request.get("/api/customers", {
    headers: { Cookie: cookies },
  });
});
```

---

### 🐛 Issue #5: File Upload Testing

**Status**: NOT FULLY TESTED  
**Problem**: POST `/api/upload` endpoint needs proper form-data handling

**Fix Needed**:

```javascript
test("POST /api/upload - file upload", async ({ request }) => {
  const formData = new FormData();
  // Add file from tests/fixtures/sample.jpg

  const response = await request.post("/api/upload", {
    multipart: formData,
  });

  expect(response.status()).toBe(200);
});
```

---

### 🐛 Issue #6: Admin Seeder Not Running in Tests

**Status**: MANUAL STEP REQUIRED  
**Problem**: Tests expect admin users but seeder must run manually first

**Fix**:

```bash
# Before running tests, always execute:
npm run db:admin-seeder

# Or update playwright.config.ts to run seeder:
webServer: {
  command: 'npm run db:admin-seeder && npm run dev',
  ...
}
```

---

### 🐛 Issue #7: Customer CRUD Operations Not Visible

**Status**: DESIGN ISSUE  
**Problem**: Tests for customer CRUD might not find form elements

**Reason**: Forms may be generated dynamically or hidden behind modals

**Workaround**: Use `page.locator()` with flexible selectors:

```javascript
// Instead of exact selectors
const input = page.locator('input[name="productName"]');

// Use flexible queries
const input = page.locator("input").filter({ hasText: /name/i });
```

---

### 🐛 Issue #8: Swagger JSON Format

**Status**: NEEDS VERIFICATION  
**Problem**: `/api/swagger.json` might return malformed or missing schema

**Check**:

```bash
curl http://localhost:3000/api/swagger.json | jq .

# Should return valid JSON with:
# - openapi or swagger version
# - paths object
# - definitions/components
```

**Fix if Needed**: Review [swagger.ts config](src/config/swagger.ts)

---

## Test Execution Flow

### 1. Pre-Test Setup (REQUIRED)

```bash
# Setup database with admin users
npm run db:admin-seeder

# Verify database connection
npm run db:seed
```

### 2. Start Development Server

```bash
npm run dev
# Waits for http://localhost:3000 to be ready
```

### 3. Run Test Suites

```bash
# Sequential execution
npm test

# Expected output:
# ✓ Admin Login Tests (10 tests)
# ✓ Admin Access Control Tests (8 tests)
# ✓ CRUD Operations Tests (7 tests)
# ✓ API Endpoints Tests (12 tests)
# ✓ Customer User Flow Tests (12 tests)
# Total: 49 tests
```

### 4. Review Results

```bash
# HTML Report
npx playwright show-report

# JSON Results
cat test-results.json
```

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run db:admin-seeder
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Timeout

```bash
# Increase Playwright timeout
export PLAYWRIGHT_TEST_TIMEOUT=30000
npm test
```

### Cannot Connect to Server

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Restart dev server
npm run dev
```

### MongoDB Connection Error

```bash
# Verify MONGODB_URI in .env
cat .env | grep MONGODB_URI

# Test connection manually
mongosh "mongodb+srv://..."
```

### Session Cookie Not Set

```bash
# Check if SESSION_SECRET is configured
cat .env | grep SESSION_SECRET

# Should be a random string, not empty
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
```

## Performance Notes

- Tests run **sequentially** (not parallel) to avoid session conflicts
- Each test takes ~2-5 seconds with page load time
- Total test suite: ~2-3 minutes
- Use `--workers=1` to prevent race conditions

## Next Steps to Fix Remaining Issues

1. **Fix Swagger UI** - Test `/api/docs` endpoint thoroughly
2. **Add session auth to API tests** - Use login response cookies
3. **Test file uploads** - Add sample images to tests/fixtures
4. **Verify all CRUD forms** - Check form selectors work as expected
5. **Add E2E quote workflow** - Quote creation → sending → acceptance
6. **Test email notifications** - Mock Nodemailer or use test email service
7. **Add performance tests** - Measure page load times
8. **Add accessibility tests** - WCAG compliance checks

## Build Check Integration

The `npm run check` command now includes:

```bash
npm run lint        # ESLint validation
npm run build       # Production build
npm run test        # Playwright tests ← NEW
```

### Pre-Push Hook

The Husky `pre-push` hook runs:

```bash
npm run check
# All tests must pass before pushing to git
```

## Test Environment Variables

Recommended `.env` for testing:

```
MONGODB_URI=mongodb://localhost:27017/solar-store-test
NEXTAUTH_SECRET=test-secret-key-for-development-only
SESSION_SECRET=test-session-secret-key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=test@test.com
SMTP_PASS=test-password
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

**Last Updated**: February 23, 2026  
**Test Framework**: Playwright 1.40+  
**Next.js Version**: 14.1.0  
**Node Version**: 18+
