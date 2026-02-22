# Project Issues & Solutions

## Critical Issues Found

### ❌ Issue #1: MongoDB Authentication Required
**Severity**: 🔴 CRITICAL - Blocks all tests  
**Status**: NEEDS MANUAL CONFIGURATION  

**Problem**:
```
❌ Seeding error: bad auth : Authentication failed.
```

The `.env` file has a placeholder MongoDB URI that needs actual credentials.

**Current Config** (Invalid):
```
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@wegro.ssjqljr.mongodb.net/?appName=WeGro?retryWrites=true&w=majority
```

**Solution**:

#### Option A: Use Local MongoDB
```bash
# Install MongoDB locally (macOS)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Update .env
MONGODB_URI=mongodb://localhost:27017/solar-store
```

#### Option B: Use MongoDB Atlas (Cloud)
```bash
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create a free tier cluster
# 3. Get connection string from Atlas Dashboard
# 4. Update .env with actual credentials:
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/solar-store?retryWrites=true&w=majority
```

#### Option C: Use Test Database
```bash
# Create a local test database
MONGODB_URI=mongodb://localhost:27017/solar-store-test
```

**Workaround**:  
Without MongoDB, tests will fail. You must set up MongoDB before running:
```bash
npm run db:admin-seeder  # WILL FAIL without valid MONGODB_URI
npm test                 # Tests requiring DB will fail
```

**Action Required**: 
- [ ] Set up MongoDB Atlas or local MongoDB
- [ ] Get actual connection credentials  
- [ ] Update `.env` with real `MONGODB_URI`
- [ ] Run `npm run db:admin-seeder` to confirm it works

---

### ❌ Issue #2: Session Middleware Configuration
**Severity**: 🟡 HIGH - Admin login may not work  
**Status**: NEEDS VERIFICATION

**Problem**:  
Session authentication uses `express-session` middleware, but Next.js API routes may not properly preserve sessions across requests.

**Current Setup** (Potentially Broken):
- `/src/middleware/auth.ts` - Auth middleware exists but may not be integrated
- Session storage is in-memory (lost on server restart)
- Session cookies might not be set properly between page loads

**Evidence**:
```typescript
// tests/admin-login.spec.ts - May fail on session persistence
test('session should persist across page navigations')
```

**Fix Needed**:
```typescript
// 1. Verify middleware is imported in route handlers
// 2. Use connect-mongo for persistent session storage
npm install connect-mongo

// 3. Update session configuration in API routes to use MongoStore:
import MongoStore from 'connect-mongo';

const sessionConfig = {
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
  }),
  // ... rest of session config
};
```

**Workaround**:  
Run tests with `--reuseExistingServer` to avoid server restarts:
```bash
npx playwright test --no-reuse-existing-server
```

---

### ❌ Issue #3: Swagger UI Not Properly Configured
**Severity**: 🟡 HIGH - API docs may not display  
**Status**: NEEDS TESTING

**Problem**:  
`GET /api/docs` returns HTML but Swagger UI may not render correctly

**Current Implementation**:
```typescript
// src/app/api/docs/route.ts
export async function GET(request: NextRequest) {
  const html = `<!DOCTYPE html>...
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
    ...
  `;
}
```

**Potential Issues**:
- CDN scripts may be blocked
- Base path configuration missing
- `swagger-ui-express` import was removed but reference might still exist

**Test Command**:
```bash
# Check if endpoint returns valid HTML
curl http://localhost:3000/api/docs | head -20

# Check if Swagger JSON is valid
curl http://localhost:3000/api/swagger.json | jq .

# Check for JavaScript errors in browser
npm run dev
# Open http://localhost:3000/api/docs in browser
# Check console for errors
```

**Fix Required**:
```typescript
// Update docs/route.ts to include proper config:
window.ui = SwaggerUIBundle({
  url: "/api/swagger.json",
  dom_id: '#swagger-ui',
  deepLinking: true,
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  layout: "StandaloneLayout",
  onComplete: function() {
    console.log('✅ Swagger UI loaded');
  }
})
```

**Action Required**:
- [ ] Test `/api/docs` endpoint in browser
- [ ] Check browser console for errors
- [ ] Verify `/api/swagger.json` returns valid OpenAPI schema
- [ ] Fix any CDN or configuration issues

---

### ❌ Issue #4: CRUD Form Elements Not Found
**Severity**: 🟡 HIGH - Tests may fail on form operations  
**Status**: NEEDS VERIFICATION

**Problem**:  
Tests look for form inputs like:
```javascript
const nameInput = page.locator('input[placeholder*="name"]');
```

But forms may not be rendered or selectors may be incorrect.

**Test Output** (Potential Error):
```
❌ should create a new category
  Timeout waiting for locator
```

**Root Cause**:
- Form inputs might not have placeholders
- Forms might be inside modals
- Form elements dynamically generated
- CSS selectors don't match actual DOM

**Check** (Manual):
```bash
npm run dev
# Open browser to http://localhost:3000/admin/products
# Inspect HTML for actual form structure
# Check if input elements have name, id, or placeholder attributes
```

**Fix**:
```typescript
// Update test selectors to be more flexible:
// Instead of:
const input = page.locator('input[placeholder*="name"]');

// Use:
const input = page.locator('input').first(); // Get first input
const input = page.locator('form').locator('input').first();
const input = page.locator('[name="productName"]'); // Exact name

// Or use text matching:
const input = page.locator('input', { has: page.locator('label:has-text("Name")') });
```

**Action Required**:
- [ ] Manually inspect admin forms in browser
- [ ] Document actual form structure
- [ ] Update test selectors with correct attributes
- [ ] Verify form inputs are properly labeled

---

### ⚠️ Issue #5: Email/SMS Notifications Not Tested
**Severity**: 🟡 MEDIUM - Feature not covered  
**Status**: NO TEST CASES

**Problem**:  
Tests don't verify email sending or SMS notifications

**Missing Tests**:
- Email sent on quote creation
- Email sent on order confirmation
- SMS sent on order update
- Nodemailer integration
- Twilio integration

**Current State**:
```typescript
// src/utils/email.ts - Exists but not tested
export async function sendEmail(options: EmailOptions): Promise<boolean>

// src/utils/sms.ts - Exists but not tested  
export async function sendSMS(phone: string, message: string)
```

**What's Needed**:
```typescript
// tests/notifications.spec.ts - NEW FILE NEEDED
test('should send quote email to customer', async ({ page }) => {
  // Login as admin
  // Create quote
  // Click "Send Email"
  // Verify email was sent (check via API or mock)
});

test('should send SMS on order confirmation', async ({ page }) => {
  // Create order
  // Verify SMS sent to customer phone
});
```

**Solution**:
Install Ethereal Email for testing:
```bash
npm install nodemailer-ethereal --save-dev

# Use in tests:
import nodemailer from "nodemailer";

export async function createTestEmailAccount() {
  const account = await nodemailer.createTestAccount();
  return {
    user: account.user,
    pass: account.pass,
    host: 'smtp.ethereal.email',
  };
}
```

**Action Required**:
- [ ] Create `tests/notifications.spec.ts`
- [ ] Add email tests with Ethereal
- [ ] Mock Twilio for SMS tests
- [ ] Add test assertions for email/SMS

---

### ⚠️ Issue #6: API Error Handling Not Comprehensive
**Severity**: 🟡 MEDIUM - Error responses may be inconsistent  
**Status**: PARTIAL TESTING

**Problem**:  
API routes may not return consistent error formats

**Current Issue**:
```typescript
// Some routes might use different error formats:
// Route 1: { statusCode: 400, message: "error" }
// Route 2: { error: "error message" }
// Route 3: status 500 with no body
```

**Test Coverage Missing**:
- Invalid input validation
- Missing required fields
- Malformed JSON
- Large payloads
- Rate limiting

**Example Fix**:
```typescript
// All routes should return same format
export const APIResponse = {
  error: (statusCode: number, message: string, error?: any) => {
    return NextResponse.json(
      { statusCode, message, error: error?.message },
      { status: statusCode }
    );
  }
};

// Usage:
if (!email) {
  return APIResponse.error(400, 'Email required');
}
```

**Test Case**:
```typescript
test('API should return 400 for missing required fields', async ({ request }) => {
  const response = await request.post('/api/products', {
    data: { price: 100 } // missing name
  });
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toContain('required');
});
```

**Action Required**:
- [ ] Review all API routes for consistent error handling
- [ ] Add validation tests for each endpoint
- [ ] Document expected error formats
- [ ] Create error response schema

---

### ⚠️ Issue #7: Customer User Registration Not Implemented
**Severity**: 🟡 MEDIUM - Feature gap  
**Status**: NO ENDPOINT

**Problem**:  
No way for customers to create accounts. Only admin can create customer records.

**Missing**:
- `POST /api/auth/register` endpoint  
- Customer signup form
- Email verification
- Password reset flow

**Current Flow**:
```
Admin creates customer → Customer login? (No endpoint!)
```

**What's Needed**:
```typescript
// src/app/api/auth/register/route.ts - NEW FILE
export async function POST(request: NextRequest) {
  const { email, password, name, phone } = await request.json();
  
  // Create customer user
  const user = new User({
    email,
    password: await hashPassword(password),
    role: 'customer',
    name,
    phone,
  });
  
  await user.save();
  
  // Send verification email
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: getVerificationEmailTemplate(email, token)
  });
  
  return APIResponse.success({ user });
}
```

**Action Required**:
- [ ] Create customer signup endpoint
- [ ] Create registration form page
- [ ] Add email verification
- [ ] Add password reset flow
- [ ] Add tests for registration

---

### ⚠️ Issue #8: Role-Based Access Control (RBAC) Not Enforced
**Severity**: 🟡 MEDIUM - Security risk  
**Status**: PARTIALLY IMPLEMENTED

**Problem**:  
Admin middleware exists but may not be applied to all routes

**Current**:
```typescript
// src/middleware/auth.ts exists but:
// 1. Not imported in all API routes
// 2. May not prevent customer from calling admin endpoints
// 3. No role checking in route handlers
```

**Vulnerable Endpoints** (Potentially):
```
POST /api/products         → Should require admin
POST /api/categories       → Should require admin
GET /api/customers         → Should require admin
POST /api/quotes/send      → Should require admin
```

**Test Case** (Currently Missing):
```typescript
test('customer should not be able to create product', async ({ request }) => {
  // Login as customer
  // Try to POST /api/products
  // Should get 403 Forbidden
});
```

**Fix**:
```typescript
// All admin routes should check:
const { user } = await getSessionUser(request);

if (!user || user.role !== 'admin') {
  return APIResponse.forbidden('Admin access required');
}
```

**Action Required**:
- [ ] Add role checking to all admin routes
- [ ] Add RBAC test cases
- [ ] Document which routes require admin
- [ ] Test customer trying to access admin endpoints

---

### ⚠️ Issue #9: File Upload Security Not Verified
**Severity**: 🟡 MEDIUM - Potential security issue  
**Status**: NO VALIDATION TESTS

**Problem**:  
File upload endpoint may accept any file type

**Missing Validations**:
- File size limits
- File type validation
- Malicious file detection
- Path traversal prevention

**Test Missing**:
```typescript
test('should reject non-image files', async ({ request }) => {
  const response = await request.post('/api/upload', {
    multipart: {
      file: fs.createReadStream('test-executable.exe')
    }
  });
  
  expect(response.status()).toBe(400);
});

test('should reject oversized files', async ({ request }) => {
  // Create 100MB file
  // Should reject with 413 Payload Too Large
});
```

**Action Required**:
- [ ] Add file type validation to upload handler
- [ ] Set file size limits (e.g., 10MB)
- [ ] Add antivirus scanning (optional)
- [ ] Add security tests for file upload

---

### ⚠️ Issue #10: Database Seeding Not Idempotent
**Severity**: 🟡 MEDIUM - Tests may fail on re-run  
**Status**: PARTIALLY FIXED

**Problem**:  
Running `npm run db:seed` twice may cause issues:
```
E11000 duplicate key error: email already exists
```

**Current Scripts**:
```bash
npm run db:seed          # Creates sample data (may fail if exists)
npm run db:admin-seeder  # Overwrites admin users (✓ works)
```

**Workaround**:
```bash
# Delete database before seeding
npm run db:clear && npm run db:seed

# Or use idempotent seeder
npm run db:admin-seeder  # First, admin users only
```

**Fix Needed**:
```bash
# Add new script to clear database
"db:clear": "node scripts/clear-db.js"

# Create scripts/clear-db.js
```

**Action Required**:
- [ ] Create `scripts/clear-db.js` to safely clear database
- [ ] Add `db:clear` npm script
- [ ] Make `db:seed` idempotent (upsert instead of insert)
- [ ] Update test setup to clear database before each run

---

## Summary of Required Actions

### 🔴 Critical (Blocks Testing)
- **MongoDB Configuration**: Set up valid MONGODB_URI in .env
- **Session Middleware**: Verify session persistence works

### 🟡 High Priority (Blocks Some Tests)
- **Swagger UI**: Verify `/api/docs` displays correctly
- **Form Selectors**: Update CRUD test selectors to match actual forms
- **Error Handling**: Enforce consistent API error responses
- **RBAC**: Add role checking to all protected routes

### 🟠 Medium Priority (Feature Gaps)
- **Customer Registration**: Implement signup endpoint
- **Email/SMS Tests**: Add notification tests
- **File Upload Security**: Add validation and security tests
- **Database Seeding**: Make scripts idempotent

### 🔵 Low Priority (Nice to Have)
- **Performance Testing**: Measure page load times
- **Accessibility**: Check WCAG compliance
- **Load Testing**: Stress test API endpoints

---

## Quick Fix Checklist

```bash
# 1. Configure MongoDB
# Edit .env with valid MONGODB_URI
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/solar-store" >> .env

# 2. Install missing packages
npm install dotenv --save-dev

# 3. Create test database with admin users
npm run db:admin-seeder

# 4. Run development server
npm run dev

# 5. Test Swagger API docs
curl http://localhost:3000/api/docs

# 6. Run test suite
npm test

# 7. Check for failures and fix issues
# See specific issue sections above for fixes
```

---

**Document Version**: 1.0  
**Last Updated**: February 23, 2026  
**Status**: 10 Issues Identified, Solutions Provided
