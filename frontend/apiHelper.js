/**
 * Health Nutra - Centralized API Helper Client
 * Consumes api.json configuration and provides robust, standardized API calls
 * with error handling, credentials, and full support for Storefront and Admin portals.
 */

// Load or fallback configuration
const DEFAULT_CONFIG = {
  apiBaseUrl: "/api",
  endpoints: {
    products: "/api/products",
    productDetail: "/api/products/:id",
    categories: "/api/categories",
    ping: "/api/ping",
    health: "/health",
    orders: "/api/orders",
    orderDetail: "/api/orders/:id",
    adminLogin: "/api/admin/login",
    adminLogout: "/api/admin/logout",
    adminMe: "/api/admin/me",
    adminProducts: "/api/admin/products",
    adminProductToggle: "/api/admin/products/:id/toggle-status",
    adminOrders: "/api/admin/orders",
    adminOrderStatus: "/api/admin/orders/:id/status",
    contact: "/api/contact",
  },
  categoryIcons: {
    All: "layers",
    Multivitamin: "pill",
    Syrup: "droplet",
    "Omega-3": "heart-pulse",
    "Green Tea": "leaf",
    Ayurvedic: "sparkles",
    Immunity: "shield-check",
    General: "package",
  },
};

class ApiHelper {
  constructor() {
    this.config = DEFAULT_CONFIG;
    this.isLoaded = false;
    this.initPromise = this.loadConfig();
  }

  /**
   * Asynchronously load api.json
   */
  async loadConfig() {
    try {
      const res = await fetch("/api.json");
      if (res.ok) {
        const json = await res.json();
        this.config = { ...DEFAULT_CONFIG, ...json };
        this.isLoaded = true;
      }
    } catch {
      // Fallback to DEFAULT_CONFIG silently
      this.config = DEFAULT_CONFIG;
    }
    return this.config;
  }

  /**
   * Helper to resolve endpoint URLs with parameter replacements
   */
  resolveUrl(endpointKey, params = {}) {
    let endpoint = (this.config.endpoints && this.config.endpoints[endpointKey]) || `/api/${endpointKey}`;
    Object.keys(params).forEach((key) => {
      endpoint = endpoint.replace(`:${key}`, encodeURIComponent(params[key]));
    });
    return endpoint;
  }

  /**
   * Generic Fetch Wrapper with JSON handling and credentials
   */
  async request(url, options = {}) {
    await this.initPromise;
    const defaultHeaders = {};
    if (!(options.body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const config = {
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({
        success: false,
        message: `HTTP ${response.status} - Non-JSON response`,
      }));

      if (!response.ok && !data.message) {
        data.message = `HTTP Error ${response.status}: ${response.statusText}`;
      }

      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        data: {
          success: false,
          message: err.message || "Network error. Please check your internet connection.",
        },
      };
    }
  }

  // ==========================================
  // PUBLIC STOREFRONT APIS
  // ==========================================

  /**
   * Get all active products with optional category and search query
   */
  async getProducts(category = "", query = "") {
    let url = this.resolveUrl("products");
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (query) params.append("q", query);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Get single product detail by ID
   */
  async getProductById(id) {
    const url = this.resolveUrl("productDetail", { id });
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Get all available categories
   */
  async getCategories() {
    const url = this.resolveUrl("categories");
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Create customer order
   */
  async createOrder(orderData) {
    const url = this.resolveUrl("orders");
    const res = await this.request(url, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return res.data;
  }

  /**
   * Track / Get Order by ID
   */
  async getOrder(orderId) {
    const url = this.resolveUrl("orderDetail", { id: orderId });
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Ping / Health check
   */
  async ping() {
    const url = this.resolveUrl("ping");
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Submit customer contact inquiry
   */
  async submitContact(formData) {
    const url = this.resolveUrl("contact");
    const res = await this.request(url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return res.data;
  }

  // ==========================================
  // ADMIN AUTHENTICATION & MANAGEMENT APIS
  // ==========================================

  /**
   * Check current admin session
   */
  async checkAdminAuth() {
    const url = this.resolveUrl("adminMe");
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Admin Login
   */
  async loginAdmin(username, password) {
    const url = this.resolveUrl("adminLogin");
    const res = await this.request(url, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return res.data;
  }

  /**
   * Admin Logout
   */
  async logoutAdmin() {
    const url = this.resolveUrl("adminLogout");
    const res = await this.request(url, { method: "POST" });
    return res.data;
  }

  /**
   * Get all products for Admin (including inactive)
   */
  async getAdminProducts() {
    const url = this.resolveUrl("adminProducts");
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Create new product (Accepts FormData for image upload or JSON)
   */
  async createProduct(formDataOrJson) {
    const url = this.resolveUrl("adminProducts");
    const isForm = formDataOrJson instanceof FormData;
    const res = await this.request(url, {
      method: "POST",
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return res.data;
  }

  /**
   * Update existing product
   */
  async updateProduct(id, formDataOrJson) {
    const url = `${this.resolveUrl("adminProducts")}/${id}`;
    const isForm = formDataOrJson instanceof FormData;
    const res = await this.request(url, {
      method: "PUT",
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return res.data;
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    const url = `${this.resolveUrl("adminProducts")}/${id}`;
    const res = await this.request(url, { method: "DELETE" });
    return res.data;
  }

  /**
   * Toggle product visibility status
   */
  async toggleProductStatus(id) {
    const url = this.resolveUrl("adminProductToggle", { id });
    const res = await this.request(url, { method: "PATCH" });
    return res.data;
  }

  /**
   * Get Admin Orders with optional status filter
   */
  async getAdminOrders(status = "") {
    let url = this.resolveUrl("adminOrders");
    if (status && status !== "All") {
      url += `?status=${encodeURIComponent(status)}`;
    }
    const res = await this.request(url, { method: "GET" });
    return res.data;
  }

  /**
   * Update Order Status (Pending, Confirmed, Shipped, Delivered, Cancelled)
   */
  async updateOrderStatus(orderId, status) {
    const url = this.resolveUrl("adminOrderStatus", { id: orderId });
    const res = await this.request(url, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res.data;
  }

  /**
   * Delete Order
   */
  async deleteOrder(orderId) {
    const url = `${this.resolveUrl("adminOrders")}/${orderId}`;
    const res = await this.request(url, { method: "DELETE" });
    return res.data;
  }

  /**
   * Get Lucide icon name for category
   */
  getCategoryIcon(category) {
    return this.config.categoryIcons[category] || this.config.categoryIcons.General || "pill";
  }
}

// Instantiate Singleton
const apiHelper = new ApiHelper();

// Expose on global window object for browser scripts
if (typeof window !== "undefined") {
  window.apiHelper = apiHelper;
}

// Export for ES modules and CommonJS
export default apiHelper;
export { ApiHelper, apiHelper };

