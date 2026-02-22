# Getting Started with Testing

## 5-Minute Quick Start

### Step 1: Configure MongoDB (2 min)

**Option A: Local MongoDB**

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Copy string to `.env`

**Step 2: Update .env File**

```bash
# Edit .env - find MONGODB_URI line and update it:

# Local:
MONGODB_URI=mongodb://localhost:27017/solar-store

# OR Cloud (MongoDB Atlas):
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/solar-store?retryWrites=true&w=majority
```

### Step 2: Create Test Users (1 min)

```bash
npm run db:admin-seeder

# Output should show:
# ✓ Created admin: admin@solarstore.com (password: ChangeMe123!)
# ✓ Created test customer: customer@solarstore.com
```

### Step 3: Start Development Server (1 min)

```bash
npm run dev

# Should see:
# ▲ Next.js 14.1.0
# ✓ Ready on http://localhost:3000
```

### Step 4: Run Tests (1 min)

**In a new terminal**:

```bash
npm test

# Or with visual feedback:
npm run test:headed

# Or interactive UI:
npm run test:ui
```

---

## Step-by-Step Setup Guide

### Complete Setup (Full Instructions)

#### A. Prerequisites Check

```bash
# Check Node.js version
node --version
# Should be v18+

# Check npm
npm --version
# Should be v10+

# Check MongoDB availability
# If using local:
mongosh --version

# If using cloud:
# Just need internet connection
```

#### B. Install Dependencies

```bash
cd /Users/mdashikurrahman/Downloads/wegro/solar-store

# Already done, but confirm:
npm install

# Should output:
# added 609 packages

# Check Playwright is installed:
npx playwright --version
# Should be 1.40+
```

#### C. Database Configuration

**Edit `.env` file:**

```bash
# Open in editor
nano .env
# or
code .env
```

Find the `MONGODB_URI` line and replace completely:

**For Local MongoDB:**

```
MONGODB_URI=mongodb://localhost:27017/solar-store
```

**For MongoDB Atlas:**

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/solar-store?retryWrites=true&w=majority
```

Example with real values:

```
MONGODB_URI=mongodb+srv://john_user:SecurePass123!@myapp-cluster.mongodb.net/solar-store-db?retryWrites=true&w=majority
```

**Save and verify:**

```bash
# Check it's correct
cat .env | grep MONGODB_URI

# Should show your actual connection string
```

#### D. Create Test Database

**Option 1: Run Seeder (Recommended)**

```bash
# This creates admin users automatically
npm run db:admin-seeder

# Expected output:
# ✓ Connected to MongoDB
# ✓ Cleared existing admin users
# ✓ Created admin: admin@solarstore.com
# ✓ Created admin: admin2@solarstore.com
# ✓ Created admin: superadmin@solarstore.com
# ✓ Created test customer: customer@solarstore.com
# ✓ Database seeding completed
```

\*\*Option 2: Run Full Seed (Alternative)

```bash
# This creates sample products, categories, etc.
npm run db:seed

# Then also create admins:
npm run db:admin-seeder
```

#### E. Verify Everything Works

**Check MongoDB Connection:**

```bash
# Test with a simple query
npm run dev

# In browser, go to:
# http://localhost:3000/admin

# Try login with:
# Email: admin@solarstore.com
# Password: ChangeMe123!

# Should see admin dashboard if working!
```

---

## Running Tests

### Development Testing

#### Mode 1: Interactive UI (Recommended for Development)

```bash
npm run test:ui

# Opens browser UI where you can:
# - Click to run individual tests
# - See pass/fail status
# - Watch tests execute
# - Debug immediately
```

#### Mode 2: Headed (See Browser)

```bash
npm run test:headed

# Watch browser as tests run
# See what clicks/inputs are happening
# ~3 minutes total

# Perfect for visual debugging
```

#### Mode 3: Headed + Debug

```bash
npm run test:debug

# Starts debugger
# Step through test execution
# Inspect variables at each step
```

### Production Testing (CI/CD)

#### Mode 4: Background (Silent)

```bash
npm test

# Runs all tests in background
# No browser window
# ~2-3 minutes
# Perfect for CI/CD pipelines
```

#### Mode 5: With Build Checks

```bash
npm run check

# Runs: lint → build → test
# All must pass
# Used in pre-push hook
```

---

## Understanding Test Results

### Success Output

```
✓ admin-login.spec.ts (10 tests)
✓ admin-access-control.spec.ts (8 tests)
✓ crud-operations.spec.ts (7 tests)
✓ api-endpoints.spec.ts (12 tests)
✓ customer-flow.spec.ts (12 tests)

Summary: 49 passed (2-3 min)
```

### Failure Output

```
✗ admin-login.spec.ts (1 failed)
  - Admin Login Page Load (TIMEOUT)
    at line 15

1 failed, 48 passed
```

**What to do:**

1. Read the error message
2. Check TESTING.md for the specific test
3. Check ISSUES.md for known problems
4. Run with `npm run test:ui` to debug
5. Check browser console for errors

### View Detailed Report

```bash
# After tests complete:
npx playwright show-report

# Opens HTML report with:
# - Screenshots
# - Videos (if configured)
# - Error details
# - Stack traces
```

---

## Troubleshooting

### "Tests Timeout"

```bash
# Problem: Taking too long to connect
# Solution 1: Make sure dev server is running
npm run dev

# Solution 2: In another terminal
npm test

# Solution 3: Increase timeout
export PLAYWRIGHT_TEST_TIMEOUT=60000
npm test

# Solution 4: Kill port and restart
lsof -i :3000
kill -9 <PID>
npm run dev
```

### "Cannot Connect to http://localhost:3000"

```bash
# Check if server is running
curl http://localhost:3000

# Start server explicitly
npm run dev

# Wait for "Ready on" message
# Then in another terminal, run tests
```

### "MONGODB_URI not found" or "Authentication failed"

```bash
# Check .env file
cat .env | grep MONGODB_URI

# Should output your connection string
# If blank or has <placeholder>, update it:
nano .env

# Make sure values are actual credentials, not templates
# Then test connection:
npm run db:admin-seeder

# Should succeed without auth errors
```

### "Test Times Out on Login Page"

```bash
# Problem: Form elements not found
# Check what's actually on page:
npm run dev

# Open browser: http://localhost:3000/admin
# Use DevTools to inspect form structure
# Check for email input, password input, submit button

# Then update test selectors if needed
# See ISSUES.md Issue #4 for details
```

### "Session Lost Between Page Navigations"

```bash
# Problem: Session cookie not persisting
# See ISSUES.md Issue #2
# Solution: May need system configuration change
# Workaround: Run tests individually first
npm run test:ui
# Select one test file to run
```

---

## Running Specific Tests

```bash
# Run only admin login tests
npx playwright test tests/admin-login.spec.ts

# Run only one test
npx playwright test tests/admin-login.spec.ts -g "should login successfully"

# Run tests matching pattern
npx playwright test -g "login"

# Run in specific project (browser)
npx playwright test --project=chromium

# List all tests without running
npx playwright test --list
```

---

## Continuous Integration (CI)

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm ci
      - run: npm run db:admin-seeder
      - run: npm test

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Performance Notes

| Operation              | Time           |
| ---------------------- | -------------- |
| Test setup             | ~10 seconds    |
| Single test            | 2-5 seconds    |
| All tests (49)         | 2-3 minutes    |
| HTML Report generation | ~30 seconds    |
| **Total**              | **~3 minutes** |

**Tips to Speed Up:**

```bash
# Run specific suite only
npx playwright test tests/admin-login.spec.ts
# Much faster than all 49 tests

# Run in parallel (use with caution)
# Default is sequential (avoid session conflicts)
npx playwright test --workers=2
# Only safe for stateless tests
```

---

## Maintenance

### Adding New Tests

1. **Create test file:**

```bash
# Create new file in tests/
touch tests/my-feature.spec.ts
```

2. **Write test:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("My Feature", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/");
    // ... your test
  });
});
```

3. **Run to verify:**

```bash
npx playwright test tests/my-feature.spec.ts
```

### Updating Existing Tests

```bash
# If selectors change, update them in the test file
# Use browser DevTools to find new selectors

# Re-run to verify fix
npx playwright test tests/admin-login.spec.ts -g "specific test"
```

### Debugging a Failed Test

```bash
# 1. View HTML report
npx playwright show-report

# 2. Run with UI for interactive debugging
npm run test:ui

# 3. Run with debug mode
npm run test:debug

# 4. Check console output
npm test 2>&1 | grep -A 10 "FAIL"
```

---

## Environment Variables for Testing

```bash
# .env file variables used in tests:
MONGODB_URI=...              # Database connection
SESSION_SECRET=test-secret   # Session encryption
NEXTAUTH_SECRET=test-secret  # NextAuth secret
NEXT_PUBLIC_API_URL=http://localhost:3000  # API URL
```

### Test User Credentials

```
Admin User:
  Email: admin@solarstore.com
  Password: ChangeMe123!

Customer User:
  Email: customer@solarstore.com
  Password: Customer123!
```

These are created by `npm run db:admin-seeder`

---

## Next: Reading the Tests

Check out the actual test files to understand:

1. **Login tests** → `tests/admin-login.spec.ts`
   - How to fill forms
   - How to test authentication

2. **Access control** → `tests/admin-access-control.spec.ts`
   - How to verify redirects
   - How to test authorization

3. **CRUD operations** → `tests/crud-operations.spec.ts`
   - How to work with forms
   - How to test validations

4. **API tests** → `tests/api-endpoints.spec.ts`
   - How to test REST endpoints
   - How to verify responses

5. **User flows** → `tests/customer-flow.spec.ts`
   - How to test complete journeys
   - How to test responsive design

---

## Questions?

- **Testing issues**: See [TESTING.md](TESTING.md)
- **Project issues**: See [ISSUES.md](ISSUES.md)
- **Test examples**: Look at test files in `/tests/`
- **Playwright docs**: https://playwright.dev/docs/intro

---

**Happy Testing!** 🎉
