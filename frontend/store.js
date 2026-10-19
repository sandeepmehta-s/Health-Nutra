/**
 * Health Nutra - Centralized Frontend Store
 * Reads configuration from api.json, manages reactive state for products,
 * categories, search filters, and product details modal.
 */

export class FrontendStore {
  constructor() {
    this.config = null;
    this.state = {
      products: [],
      categories: ["All"],
      selectedCategory: "All",
      searchQuery: "",
      selectedProduct: null,
      loading: false,
      error: null,
    };
    this.listeners = new Set();
  }

  async init() {
    this.setState({ loading: true, error: null });
    try {
      // Load API configuration from api.json
      const configRes = await fetch("/api.json");
      if (configRes.ok) {
        this.config = await configRes.json();
      }
    } catch {
      // Fallback config if api.json cannot be read
      this.config = {
        apiBaseUrl: "/api",
        endpoints: {
          products: "/api/products",
          productDetail: "/api/products/:id",
          categories: "/api/categories",
        },
      };
    }

    // Fetch initial data
    await Promise.all([this.fetchCategories(), this.fetchProducts()]);
    this.setState({ loading: false });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("[Store Listener Error]", err);
      }
    }
    // Refresh Lucide vector icons whenever DOM re-renders
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      setTimeout(() => window.lucide.createIcons(), 10);
    }
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  async fetchCategories() {
    try {
      const url = this.config?.endpoints?.categories || "/api/categories";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.setState({ categories: json.data });
      }
    } catch (err) {
      console.warn("[Store] Categories fetch error:", err);
    }
  }

  async fetchProducts(category = null) {
    this.setState({ loading: true, error: null });
    try {
      const baseUrl = this.config?.endpoints?.products || "/api/products";
      const cat = category || this.state.selectedCategory;
      const url = cat && cat !== "All" ? `${baseUrl}?category=${encodeURIComponent(cat)}` : baseUrl;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        this.setState({ products: json.data, loading: false });
      } else {
        this.setState({ error: json.message || "Failed to load products", loading: false });
      }
    } catch (err) {
      this.setState({ error: "Network error loading formulations.", loading: false });
    }
  }

  setCategory(category) {
    this.setState({ selectedCategory: category });
    this.fetchProducts(category);
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: query });
  }

  getFilteredProducts() {
    const q = this.state.searchQuery.trim().toLowerCase();
    return this.state.products.filter((p) => {
      const matchesCat =
        this.state.selectedCategory === "All" ||
        p.category.toLowerCase() === this.state.selectedCategory.toLowerCase();
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  }

  async openProductModal(productId) {
    const found = this.state.products.find((p) => p.id === productId || p._id === productId);
    if (found) {
      this.setState({ selectedProduct: found });
      return;
    }

    // Otherwise fetch by ID
    try {
      const base = this.config?.endpoints?.products || "/api/products";
      const res = await fetch(`${base}/${productId}`);
      const json = await res.json();
      if (json.success && json.data) {
        this.setState({ selectedProduct: json.data });
      }
    } catch (err) {
      console.error("[Store] Product detail fetch error:", err);
    }
  }

  closeProductModal() {
    this.setState({ selectedProduct: null });
  }

  getCategoryIcon(category) {
    const icons = this.config?.categoryIcons || {
      All: "layers",
      Multivitamin: "pill",
      Syrup: "droplet",
      "Omega-3": "heart-pulse",
      "Green Tea": "leaf",
      Ayurvedic: "sparkles",
      Immunity: "shield-check",
    };
    return icons[category] || "package";
  }
}

// Global instance
export const store = new FrontendStore();
