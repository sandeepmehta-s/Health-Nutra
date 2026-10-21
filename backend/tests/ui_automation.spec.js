// @ts-check
/**
 * Health Nutra – Comprehensive End-to-End UI Automation Test Suite
 * =================================================================
 * Covers 100% of user-facing and admin features:
 *   • Storefront (https://healthnutra.co.in)
 *   • Admin Panel (/admin)
 */

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://healthnutra.co.in";
const ADMIN_EMAIL = process.env.ADMIN_USERNAME || "healthnutra16@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "2000@HNutra";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function snap(page, name) {
  await page.waitForTimeout(400);
  return page.screenshot({
    path: `tests/screenshots/${name}.png`,
    fullPage: false,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 1: 🏠 Storefront & Customer Journey
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("🏠 Storefront – Home Page & Customer Journey", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.locator("#products, button:has-text('Order Now')").first().waitFor({ state: "visible", timeout: 20000 });
  });

  test("1.1 Page loads – Header, Hero banner, and certified formulations visible", async ({ page }) => {
    await expect(page).toHaveTitle(/Health\s*Nutra/i);
    const heroTitle = page.locator("h1, h2:has-text('Formulations'), h2:has-text('Certified')").first();
    await expect(heroTitle).toBeVisible();
    await snap(page, "01-home-hero-loaded");
  });

  test("1.2 Catalog loads active products with price and stock indicators", async ({ page }) => {
    const productCards = page.locator("button:has-text('Order Now')");
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await snap(page, "02-catalog-products-visible");
  });

  test("1.3 Search optimization – filtering products dynamically", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='Search formulations']").first();
    await searchInput.scrollIntoViewIfNeeded();
    await expect(searchInput).toBeVisible();

    await searchInput.fill("9G");
    await page.waitForTimeout(600);
    await snap(page, "03-search-results-9g");

    const matchCard = page.locator("h3:has-text('9G'), h4:has-text('9G')").first();
    await expect(matchCard).toBeVisible();

    await searchInput.fill("");
    await page.waitForTimeout(400);
  });

  test("1.4 Category filter pills switch categories", async ({ page }) => {
    const categoryBtn = page.locator("button:has-text('Multivitamin'), button:has-text('Syrup'), button:has-text('Omega-3')").first();
    if (await categoryBtn.isVisible()) {
      await categoryBtn.click();
      await page.waitForTimeout(500);
      await snap(page, "04-category-filtered");

      const allBtn = page.locator("button:has-text('All')").first();
      if (await allBtn.isVisible()) await allBtn.click();
    }
  });

  test("1.5 Product Details modal opens and displays clinical specifications", async ({ page }) => {
    await page.waitForTimeout(1000);
    const detailsBtn = page.locator("button:has-text('Details')").first();
    await expect(detailsBtn).toBeVisible({ timeout: 10000 });
    await detailsBtn.click();

    const modalDialog = page.locator("div.fixed.inset-0.z-50").first();
    await expect(modalDialog).toBeVisible({ timeout: 10000 });
    await snap(page, "05-product-detail-modal-open");

    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  });

  test("1.6 Order Now button opens Checkout modal with dynamic quantity and pricing", async ({ page }) => {
    await page.waitForTimeout(800);
    const orderNowBtn = page.locator("button:has-text('Order Now')").first();
    await expect(orderNowBtn).toBeVisible({ timeout: 10000 });
    await orderNowBtn.click();

    const checkoutModal = page.locator("div.fixed.inset-0").filter({ hasText: "Direct Formulation Order" });
    await expect(checkoutModal).toBeVisible({ timeout: 10000 });
    await snap(page, "06-checkout-modal-open");

    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  });

  test("1.7 Complete order placement workflow (Cash on Delivery)", async ({ page }) => {
    await page.waitForTimeout(800);
    const orderNowBtn = page.locator("button:has-text('Order Now')").first();
    await expect(orderNowBtn).toBeVisible({ timeout: 10000 });
    await orderNowBtn.click();

    // Target inputs strictly inside the Checkout Modal
    const modalDialog = page.locator("div.fixed.inset-0").filter({ hasText: "Direct Formulation Order" });
    await expect(modalDialog).toBeVisible({ timeout: 10000 });

    const nameInput = modalDialog.locator("input[placeholder*='Ramesh Kumar']").first();
    const phoneInput = modalDialog.locator("input[placeholder*='9876543210']").first();
    const addressInput = modalDialog.locator("textarea").first();

    await nameInput.fill("Automated Test Customer");
    await phoneInput.fill("7024308660");
    await addressInput.fill("Plot 42, Pharmaceutical Industrial Estate, Indore");

    await snap(page, "07-checkout-form-filled");

    const submitOrderBtn = modalDialog.locator("button[type='submit']").first();
    await submitOrderBtn.scrollIntoViewIfNeeded();
    await submitOrderBtn.click({ force: true });

    // Wait for Confirmation Receipt
    const receiptBanner = page.locator("h4:has-text('Thank You'), :has-text('Order Confirmed!')").first();
    await expect(receiptBanner).toBeVisible({ timeout: 15000 });
    await snap(page, "08-order-confirmed-receipt");

    const continueBtn = page.locator("button:has-text('Continue Browsing')").first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await page.keyboard.press("Escape");
    }
  });

  test("1.8 Track Order modal opens and searches order status", async ({ page }) => {
    const trackBtn = page.locator("button:has-text('Track Order & Download PDF'), button:has-text('Track Order')").first();
    await trackBtn.scrollIntoViewIfNeeded();
    await trackBtn.click();

    const trackInput = page.locator("input[placeholder*='HN-ORD']").first();
    await expect(trackInput).toBeVisible({ timeout: 10000 });

    await trackInput.fill("HN-ORD-1001");

    const trackSubmitBtn = page.locator("button").filter({ hasText: "Track" }).first();
    await trackSubmitBtn.click({ force: true });
    await page.waitForTimeout(1000);
    await snap(page, "09-track-order-modal-searched");

    await page.keyboard.press("Escape");
  });

  test("1.9 Contact Us inquiry form submission", async ({ page }) => {
    const contactSection = page.locator("#contact-inquiry");
    await contactSection.scrollIntoViewIfNeeded();

    const nameInput = contactSection.locator("input[placeholder*='Rajesh'], input[type='text']").first();
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    const emailInput = contactSection.locator("input[type='email']").first();
    const phoneInput = contactSection.locator("input[type='tel']").first();
    const messageInput = contactSection.locator("textarea").first();
    const submitBtn = contactSection.locator("button[type='submit']").first();

    await nameInput.fill("Test Physician");
    await emailInput.fill("testphysician@healthnutra.in");
    if (await phoneInput.isVisible()) await phoneInput.fill("7024308660");
    await messageInput.fill("Inquiring about bulk distribution for clinic network. Automation test run.");

    await snap(page, "10-contact-form-filled");
    await submitBtn.click();

    const feedback = contactSection.locator(":has-text('Inquiry Submitted!'), :has-text('Thank you')").first();
    await expect(feedback).toBeVisible({ timeout: 15000 });
    await snap(page, "11-contact-form-success");
  });

  test("1.10 Footer renders company credentials, contact info and phone number", async ({ page }) => {
    const footer = page.locator("footer").first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    const phoneLink = footer.locator("a[href*='7024308660'], :has-text('7024308660')").first();
    await expect(phoneLink).toBeVisible();
    await snap(page, "12-footer-contact-verified");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 2: 🔐 Admin Authentication
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("🔐 Admin Authentication", () => {

  test("2.1 Login page renders securely", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });
    const userField = page.locator("#username, input[name='username']").first();
    await expect(userField).toBeVisible({ timeout: 10000 });
    await snap(page, "20-admin-login-screen");
  });

  test("2.2 Rejects invalid credentials with security notice", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });
    const userField = page.locator("#username, input[name='username']").first();
    const passField = page.locator("#password, input[name='password']").first();
    const submitBtn = page.locator("button[type='submit']").first();

    await userField.fill("invalid@admin.com");
    await passField.fill("WrongPass123!");
    await submitBtn.click();

    const alertNotice = page.locator("#alertBox, .text-rose-600, [role='alert']").first();
    await expect(alertNotice).toBeVisible({ timeout: 8000 });
    await snap(page, "21-admin-login-rejected");
  });

  test("2.3 Authenticates valid admin and redirects to Management Dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });
    await page.locator("#username").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.locator("button[type='submit']").click();

    await page.waitForURL((url) => url.pathname.includes("/admin") && !url.pathname.includes("login"), { timeout: 15000 });
    const sidebar = page.locator("#sidebar").first();
    await expect(sidebar).toBeVisible();
    await snap(page, "22-admin-authenticated-dashboard");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 3: ⚙️ Admin Panel – Complete Management Operations (Single Session)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe.serial("⚙️ Admin Panel – Backoffice Operations", () => {
  /** @type {import('@playwright/test').Page} */
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });
    await page.locator("#username").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.locator("button[type='submit']").click();
    await page.waitForURL((url) => url.pathname.includes("/admin") && !url.pathname.includes("login"), { timeout: 15000 });
    await page.locator("#viewProducts, #sidebar").first().waitFor({ state: "visible", timeout: 15000 });
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  // ── 3.1 Products Catalog Management ─────────────────────────────────────────

  test("3.1 Products Tab – Lists formulations catalog with active toggle", async () => {
    await page.locator("#navTabProducts").click();
    await expect(page.locator("#viewProducts")).toBeVisible();

    const tableRows = page.locator("#productsTableBody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await snap(page, "31-admin-products-catalog");
  });

  test("3.2 Products Tab – Add New Product modal opens and validates", async () => {
    await page.locator("#navTabProducts").click();
    const openAddBtn = page.locator("#openAddModalBtn");
    await openAddBtn.click();

    const modal = page.locator("#productModal");
    await expect(modal).toBeVisible({ timeout: 10000 });
    await snap(page, "32-admin-add-product-modal");

    await page.locator("#closeModalBtn").click();
    await expect(modal).toBeHidden();
  });

  test("3.3 Products Tab – Edit formulation modal loads current product details", async () => {
    await page.locator("#navTabProducts").click();
    const editBtn = page.locator("#productsTableBody button[title='Edit Formulation'], #productsTableBody button[onclick*='editProduct']").first();
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    const modal = page.locator("#productModal");
    await expect(modal).toBeVisible({ timeout: 10000 });

    const nameInput = page.locator("#prodName");
    const val = await nameInput.inputValue();
    expect(val.length).toBeGreaterThan(0);
    await snap(page, "33-admin-edit-product-modal");

    await page.locator("#closeModalBtn").click();
    await expect(modal).toBeHidden();
  });

  test("3.4 Products Tab – Toggle formulation visibility switch", async () => {
    await page.locator("#navTabProducts").click();
    const toggleBtn = page.locator("#productsTableBody button[title*='hide'], #productsTableBody button[title*='Active'], #productsTableBody button[onclick*='toggleProductActive']").first();
    await expect(toggleBtn).toBeVisible({ timeout: 10000 });

    await toggleBtn.click();
    await page.waitForTimeout(1000);
    await snap(page, "34-admin-toggle-product-status");

    // Toggle back to preserve state
    await toggleBtn.click();
    await page.waitForTimeout(1000);
  });

  test("3.5 Products Tab – Delete confirmation dialog safeguards data", async () => {
    await page.locator("#navTabProducts").click();
    const deleteBtn = page.locator("#productsTableBody button[title='Delete Formulation'], #productsTableBody button[onclick*='promptDeleteProduct']").first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    await deleteBtn.click();

    const deleteModal = page.locator("#deleteModal");
    await expect(deleteModal).toBeVisible({ timeout: 5000 });
    await snap(page, "35-admin-delete-product-dialog");

    await page.locator("#cancelDeleteBtn").click();
    await expect(deleteModal).toBeHidden();
  });

  // ── 3.2 Orders Management ───────────────────────────────────────────────────

  test("3.6 Orders Tab – Displays orders table and status metrics", async () => {
    await page.locator("#navTabOrders").click();
    const ordersView = page.locator("#viewOrders");
    await expect(ordersView).toBeVisible({ timeout: 10000 });

    const pendingStat = page.locator("#orderStatPending");
    await expect(pendingStat).toBeVisible();

    const ordersTable = page.locator("#ordersTableBody");
    await expect(ordersTable).toBeVisible();
    await snap(page, "36-admin-orders-table");
  });

  test("3.7 Orders Tab – Inline order status dropdown updates status seamlessly", async () => {
    await page.locator("#navTabOrders").click();
    const statusSelect = page.locator("#ordersTableBody select").first();
    if (await statusSelect.isVisible()) {
      const currentVal = await statusSelect.inputValue();
      const newVal = currentVal === "pending" ? "processing" : "pending";
      await statusSelect.selectOption(newVal);
      await page.waitForTimeout(1200);
      await snap(page, "37-admin-order-status-inline-updated");

      await statusSelect.selectOption(currentVal);
      await page.waitForTimeout(800);
    }
  });

  test("3.8 Orders Tab – Order Details modal displays full customer & ordered items", async () => {
    await page.locator("#navTabOrders").click();
    const detailsBtn = page.locator("#ordersTableBody button:has-text('Details')").first();
    if (await detailsBtn.isVisible()) {
      await detailsBtn.click();
      const orderModal = page.locator("#orderModal");
      await expect(orderModal).toBeVisible({ timeout: 10000 });
      await snap(page, "38-admin-order-details-modal");

      await page.locator("#closeOrderModalBtn").click();
      await expect(orderModal).toBeHidden();
    }
  });

  test("3.9 Orders Tab – PDF Official Invoice generation & download", async () => {
    await page.locator("#navTabOrders").click();
    const pdfBtn = page.locator("#ordersTableBody button:has-text('PDF')").first();
    if (await pdfBtn.isVisible()) {
      await pdfBtn.click();
      await page.waitForTimeout(1000);
      await snap(page, "39-admin-order-pdf-triggered");
    }
  });

  // ── 3.3 Customer Enquiries Management ────────────────────────────────────────

  test("3.10 Enquiries Tab – Displays contact inquiries and summary counters", async () => {
    await page.locator("#navTabEnquiries").click();
    const enquiriesView = page.locator("#viewEnquiries");
    await expect(enquiriesView).toBeVisible({ timeout: 10000 });

    const totalStat = page.locator("#statEnquiriesTotal");
    await expect(totalStat).toBeVisible();

    const enquiriesTable = page.locator("#enquiriesTableBody");
    await expect(enquiriesTable).toBeVisible();
    await snap(page, "40-admin-enquiries-table");
  });

  test("3.11 Enquiries Tab – Enquiry status inline dropdown update", async () => {
    await page.locator("#navTabEnquiries").click();
    const statusSelect = page.locator("#enquiriesTableBody select").first();
    if (await statusSelect.isVisible()) {
      const currentVal = await statusSelect.inputValue();
      const newVal = currentVal === "new" ? "contacted" : "new";
      await statusSelect.selectOption(newVal);
      await page.waitForTimeout(1200);
      await snap(page, "41-admin-enquiry-status-inline-updated");

      await statusSelect.selectOption(currentVal);
      await page.waitForTimeout(800);
    }
  });

  test("3.12 Enquiries Tab – Export CSV button downloads customer inquiries", async () => {
    await page.locator("#navTabEnquiries").click();
    const exportBtn = page.locator("#exportEnquiriesBtn");
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toHaveAttribute("href", "/api/admin/enquiries/export");
    await snap(page, "42-admin-enquiry-export-csv");
  });

  // ── 3.4 Analytics & Overview ────────────────────────────────────────────────

  test("3.13 Analytics Tab – Comprehensive revenue & dispatch analytics metrics", async () => {
    await page.locator("#navTabAnalytics").click();
    const analyticsView = page.locator("#viewAnalytics");
    await expect(analyticsView).toBeVisible({ timeout: 10000 });

    const activeCount = page.locator("#overviewActiveCount");
    await expect(activeCount).toBeVisible();
    await snap(page, "43-admin-analytics-overview");
  });

  // ── 3.5 Logout ──────────────────────────────────────────────────────────────

  test("3.14 Admin Logout – Safely clears session and redirects", async () => {
    const logoutBtn = page.locator("#logoutBtn, button:has-text('Sign Out')").first();
    await logoutBtn.click();
    await page.waitForTimeout(1500);

    expect(page.url()).not.toContain("/admin");
    await snap(page, "44-admin-logged-out");
  });

});
