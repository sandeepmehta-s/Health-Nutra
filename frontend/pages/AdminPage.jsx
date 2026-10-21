/**
 * Health Nutra - AdminPage View
 * Enterprise Admin Portal featuring Left Sidebar, Products Management (Dual File / Image URL),
 * Orders Management (Status workflows, filters, delete), and System Health Monitoring.
 */

function AdminPage() {
  const [activeTab, setActiveTab] = React.useState("products"); // 'products' | 'orders' | 'enquiries' | 'system'
  const [adminUser, setAdminUser] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [orderFilter, setOrderFilter] = React.useState("All");
  const [enquiries, setEnquiries] = React.useState([]);
  const [enquiryFilter, setEnquiryFilter] = React.useState("All");
  const [enquirySearch, setEnquirySearch] = React.useState("");
  const [enquiryStats, setEnquiryStats] = React.useState({ total: 0, new: 0, contacted: 0, resolved: 0 });
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Modal State for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [productForm, setProductForm] = React.useState({
    name: "",
    category: "Multivitamin",
    unit: "Strip",
    price: "",
    shortDescription: "",
    fullDescription: "",
    status: "active",
    imageUrl: "",
  });
  const [productImageFile, setProductImageFile] = React.useState(null);
  const [imageInputMode, setImageInputMode] = React.useState("url"); // 'url' | 'file'
  const [modalSubmitting, setModalSubmitting] = React.useState(false);
  const [modalError, setModalError] = React.useState("");

  // System Stats
  const [systemInfo, setSystemInfo] = React.useState({
    dbEngine: "MONGODB",
    uptime: 0,
    timestamp: new Date().toISOString(),
  });

  // Verify Admin Session on mount
  React.useEffect(() => {
    async function initAdmin() {
      try {
        setLoading(true);
        const meRes = await window.apiHelper.checkAdminAuth();
        if (!meRes || !meRes.success || !meRes.admin) {
          window.location.href = "/admin/login";
          return;
        }
        setAdminUser(meRes.admin);

        // Fetch products, orders, enquiries and system health
        await Promise.all([loadProducts(), loadOrders(), loadEnquiries(), loadSystemHealth()]);
      } catch (err) {
        console.error("Admin init error:", err);
      } finally {
        setLoading(false);
      }
    }
    initAdmin();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await window.apiHelper.getAdminProducts();
      if (data && data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error("Failed to load admin products:", e);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await window.apiHelper.getAdminOrders();
      if (data && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error("Failed to load admin orders:", e);
    }
  };

  const loadEnquiries = async (search = enquirySearch, status = enquiryFilter) => {
    try {
      if (window.apiHelper && typeof window.apiHelper.getAdminEnquiries === "function") {
        const data = await window.apiHelper.getAdminEnquiries({ search, status });
        if (data && data.success) {
          setEnquiries(data.data || []);
          if (data.counts) {
            setEnquiryStats(data.counts);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load admin enquiries:", e);
    }
  };

  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      const res = await window.apiHelper.updateEnquiryStatus(id, status);
      if (res && res.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        loadEnquiries(enquirySearch, enquiryFilter);
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleDeleteEnquiry = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;
    try {
      const res = await window.apiHelper.deleteEnquiry(id);
      if (res && res.success) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        loadEnquiries(enquirySearch, enquiryFilter);
      }
    } catch (e) {
      console.error("Delete enquiry error:", e);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const res = await fetch("/health");
      if (res.ok) {
        const data = await res.json();
        setSystemInfo(data);
      }
    } catch {}
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Multivitamin",
      unit: "Strip",
      price: "",
      shortDescription: "",
      fullDescription: "",
      status: "active",
      imageUrl: "",
    });
    setProductImageFile(null);
    setImageInputMode("url");
    setModalError("");
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || "",
      category: prod.category || "Multivitamin",
      unit: prod.unit || "Strip",
      price: prod.price || "",
      shortDescription: prod.shortDescription || "",
      fullDescription: prod.fullDescription || "",
      status: prod.status || "active",
      imageUrl: prod.image || "",
    });
    setProductImageFile(null);
    setImageInputMode(prod.image && prod.image.startsWith("http") ? "url" : "url");
    setModalError("");
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!productForm.name.trim() || !productForm.price) {
      setModalError("Please provide product name and price.");
      return;
    }

    setModalSubmitting(true);
    try {
      let res;
      if (imageInputMode === "file" && productImageFile) {
        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("category", productForm.category);
        formData.append("unit", productForm.unit);
        formData.append("price", productForm.price);
        formData.append("shortDescription", productForm.shortDescription);
        formData.append("fullDescription", productForm.fullDescription);
        formData.append("status", productForm.status);
        formData.append("image", productImageFile);

        if (editingProduct) {
          res = await window.apiHelper.updateProduct(editingProduct.id, formData);
        } else {
          res = await window.apiHelper.createProduct(formData);
        }
      } else {
        const payload = {
          name: productForm.name,
          category: productForm.category,
          unit: productForm.unit,
          price: productForm.price,
          shortDescription: productForm.shortDescription,
          fullDescription: productForm.fullDescription,
          status: productForm.status,
          imageUrl: productForm.imageUrl,
        };

        if (editingProduct) {
          res = await window.apiHelper.updateProduct(editingProduct.id, payload);
        } else {
          res = await window.apiHelper.createProduct(payload);
        }
      }

      if (res && res.success) {
        setIsProductModalOpen(false);
        await loadProducts();
      } else {
        setModalError(res?.message || "Failed to save product.");
      }
    } catch (err) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // Toggle Product Status
  const handleToggleProductStatus = async (id) => {
    try {
      const res = await window.apiHelper.toggleProductStatus(id);
      if (res && res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: res.product.status } : p))
        );
      }
    } catch (e) {
      console.error("Status toggle error:", e);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await window.apiHelper.deleteProduct(id);
      if (res && res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Delete product error:", e);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await window.apiHelper.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error("Update order status error:", e);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    try {
      const res = await window.apiHelper.deleteOrder(orderId);
      if (res && res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (e) {
      console.error("Delete order error:", e);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await window.apiHelper.logoutAdmin();
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  // Filtered Orders
  const filteredOrders = React.useMemo(() => {
    if (orderFilter === "All") return orders;
    return orders.filter(
      (o) => (o.status || "").toLowerCase() === orderFilter.toLowerCase()
    );
  }, [orders, orderFilter]);

  const pendingOrdersCount = orders.filter((o) => (o.status || "Pending").toLowerCase() === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================================
          LEFT SIDEBAR (Responsive, sticky on desktop)
          ============================================================ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:shadow-none"
        }`}
      >
        <div className="flex flex-col flex-grow overflow-y-auto">
          {/* Logo Header */}
          <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
            <a href="/admin" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={(typeof window !== "undefined" && window?.apiHelper?.config?.brand?.logoUrl) || "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg"}
                  alt="Health Nutra"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                  }}
                />
                <Icon name="leaf" className="w-5 h-5 text-brand-700 hidden" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-none">
                  HEALTH <span className="text-accent-600">NUTRA</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Console</span>
              </div>
            </a>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-grow">
            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Management
            </div>

            {/* Tab: Products */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("products");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "products"
                  ? "bg-brand-50 text-brand-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon name="package" className={`w-4 h-4 ${activeTab === "products" ? "text-brand-700" : "text-slate-400"}`} />
                <span>Products Catalog</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-200/70 text-brand-900">
                {products.length}
              </span>
            </button>

            {/* Tab: Orders */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("orders");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-brand-50 text-brand-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon name="shopping-bag" className={`w-4 h-4 ${activeTab === "orders" ? "text-brand-700" : "text-slate-400"}`} />
                <span>Orders Management</span>
              </span>
              {pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            {/* Tab: Enquiries */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("enquiries");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "enquiries"
                  ? "bg-brand-50 text-brand-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon name="message-square" className={`w-4 h-4 ${activeTab === "enquiries" ? "text-brand-700" : "text-slate-400"}`} />
                <span>Customer Enquiries</span>
              </span>
              {enquiryStats.new > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                  {enquiryStats.new}
                </span>
              )}
            </button>

            {/* Tab: System Health */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("system");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "system"
                  ? "bg-brand-50 text-brand-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon name="activity" className={`w-4 h-4 ${activeTab === "system" ? "text-brand-700" : "text-slate-400"}`} />
                <span>Health & Keep-Alive</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: User Profile & Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-black text-xs">
              {(adminUser?.username || "A")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black text-slate-900 truncate">
                {adminUser?.username || "Admin"}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Session</span>
              </div>
            </div>
          </div>

          <a
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
          >
            <Icon name="external-link" className="w-4 h-4" />
            <span>View Public Storefront</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Icon name="log-out" className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN ADMIN CONTENT AREA
          ============================================================ */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Icon name="menu" className="w-6 h-6" />
            </button>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
              {activeTab === "products" && "Products Management"}
              {activeTab === "orders" && "Customer Orders Management"}
              {activeTab === "enquiries" && "Customer Enquiries & Form Submissions"}
              {activeTab === "system" && "System & Keep-Alive Diagnostics"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "products" && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-md shadow-brand-800/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Icon name="plus-circle" className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === "enquiries" && (
              <a
                href="/api/admin/enquiries/export"
                download="HealthNutra_Enquiries.csv"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Icon name="download" className="w-4 h-4" />
                <span>Export CSV</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                if (activeTab === "products") loadProducts();
                if (activeTab === "orders") loadOrders();
                if (activeTab === "enquiries") loadEnquiries();
                if (activeTab === "system") loadSystemHealth();
              }}
              title="Refresh Data"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Icon name="refresh-cw" className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab View Contents */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          
          {/* TAB 1: PRODUCTS CATALOG */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {/* Products Table Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Formulations Inventory</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage live formulations, image assets, pricing, and visibility</p>
                  </div>
                  <span className="text-xs font-black text-brand-800 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200/60 self-start sm:self-auto">
                    {products.length} Total Formulations
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Product Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Visibility</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {products.map((p) => {
                        const imageSrc = p.image
                          ? p.image.startsWith("http") || p.image.startsWith("/")
                            ? p.image
                            : `/${p.image}`
                          : "/images/10q.png";

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 p-1 flex items-center justify-center shrink-0 border border-slate-200">
                                  <img
                                    src={imageSrc}
                                    alt={p.name}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/images/10q.png";
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="font-black text-slate-900 text-sm">{p.name}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{p.shortDescription}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200/60">
                                {p.category || "General"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-black text-slate-900 text-sm">₹{p.price}</span>
                              <span className="text-[11px] text-slate-400 block font-normal">per {p.unit || "unit"}</span>
                            </td>

                            <td className="px-6 py-4">
                              <button
                                type="button"
                                onClick={() => handleToggleProductStatus(p.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                  p.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${p.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                                <span>{p.status === "active" ? "Active" : "Inactive"}</span>
                              </button>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-2 rounded-xl text-slate-500 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                                  title="Edit Product"
                                >
                                  <Icon name="edit-3" className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete Product"
                                >
                                  <Icon name="trash-2" className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      orderFilter.toLowerCase() === status.toLowerCase()
                        ? "bg-brand-700 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Orders Grid */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Icon name="inbox" className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">No Orders in "{orderFilter}" Status</h4>
                  <p className="text-xs text-slate-400">Customer orders submitted through the storefront will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Ref</span>
                          <div className="text-base font-black text-slate-900">#{ord.id}</div>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={ord.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                            ord.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : ord.status === "Cancelled"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : ord.status === "Shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-orange-50 text-orange-800 border-orange-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-900">{ord.productName}</span>
                            <span className="font-black text-brand-700">₹{ord.totalAmount}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Quantity: {ord.quantity} | Mode: {ord.paymentMethod || "COD"}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1 pt-1">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Icon name="user" className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ord.customerName}</span>
                          </div>
                          <div className="text-slate-600 flex items-center gap-1.5">
                            <Icon name="phone" className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ord.customerPhone}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-start gap-1.5 pt-0.5">
                            <Icon name="map-pin" className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{ord.shippingAddress}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.downloadOrderInvoicePDF) {
                                window.downloadOrderInvoicePDF(ord);
                              }
                            }}
                            title="Download / Print PDF Invoice"
                            className="text-slate-600 hover:text-brand-800 font-bold p-1.5 rounded-lg hover:bg-brand-50 flex items-center gap-1 text-[11px]"
                          >
                            <Icon name="download" className="w-3.5 h-3.5 text-brand-700" />
                            <span>PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="text-red-500 hover:text-red-700 font-bold p-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 text-[11px]"
                          >
                            <Icon name="trash-2" className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: ENQUIRIES MANAGEMENT */}
          {activeTab === "enquiries" && (
            <div className="space-y-6">

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Total Enquiries</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{enquiryStats.total || enquiries.length}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Icon name="message-square" className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-blue-600 block tracking-wider">New Enquiries</span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 block">{enquiryStats.new || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon name="inbox" className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-amber-600 block tracking-wider">Contacted</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 block">{enquiryStats.contacted || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon name="phone" className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-emerald-600 block tracking-wider">Resolved</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">{enquiryStats.resolved || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon name="check-circle" className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Toolbar: Search, Status Filter & Export Button */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-xl">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Icon name="search" className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search inquiries by name, email, phone, message..."
                      value={enquirySearch}
                      onChange={(e) => {
                        setEnquirySearch(e.target.value);
                        loadEnquiries(e.target.value, enquiryFilter);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10"
                    />
                  </div>

                  <select
                    value={enquiryFilter}
                    onChange={(e) => {
                      setEnquiryFilter(e.target.value);
                      loadEnquiries(enquirySearch, e.target.value);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-brand-600"
                  >
                    <option value="All">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/api/admin/enquiries/export"
                    download="HealthNutra_Enquiries.csv"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Icon name="download" className="w-4 h-4" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Enquiries Table Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Customer Inquiries & Form Leads</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Submissions via Contact Us form stored in MongoDB Atlas</p>
                  </div>
                  <span className="text-xs font-black text-brand-800 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200/60 self-start sm:self-auto">
                    {enquiries.length} Enquiries
                  </span>
                </div>

                {enquiries.length === 0 ? (
                  <div className="py-16 text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Icon name="message-square" className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-black text-slate-900">No Enquiries Found</h4>
                    <p className="text-xs text-slate-400">Customer contact inquiries will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-4">Date & Time</th>
                          <th className="px-5 py-4">Contact Person</th>
                          <th className="px-5 py-4">Contact Info</th>
                          <th className="px-5 py-4">Subject</th>
                          <th className="px-5 py-4">Message</th>
                          <th className="px-5 py-4 text-center">Status</th>
                          <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enquiries.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                                  {(item.name || "A")[0].toUpperCase()}
                                </div>
                                <div className="font-bold text-slate-900 whitespace-nowrap">{item.name}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                {item.email && (
                                  <a href={`mailto:${item.email}`} className="text-brand-700 hover:underline font-semibold flex items-center gap-1.5">
                                    <Icon name="mail" className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{item.email}</span>
                                  </a>
                                )}
                                {item.phone && (
                                  <a href={`tel:${item.phone}`} className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                                    <Icon name="phone" className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{item.phone}</span>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {item.subject || "General"}
                              </span>
                            </td>
                            <td className="px-5 py-4 max-w-xs sm:max-w-md">
                              <p className="text-xs text-slate-700 font-normal leading-relaxed break-words whitespace-pre-line line-clamp-3">
                                {item.message}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-center whitespace-nowrap">
                              <select
                                value={item.status || "new"}
                                onChange={(e) => handleUpdateEnquiryStatus(item.id, e.target.value)}
                                className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                                  item.status === "resolved"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : item.status === "contacted"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-blue-50 text-blue-800 border-blue-200"
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleDeleteEnquiry(item.id, item.name)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Enquiry"
                              >
                                <Icon name="trash-2" className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: SYSTEM DIAGNOSTICS & CRON */}
          {activeTab === "system" && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Database Engine</div>
                  <div className="text-xl font-black text-brand-700">{systemInfo.dbEngine || "MONGODB"}</div>
                  <div className="text-xs text-slate-500">MongoDB Atlas Enterprise Cluster</div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Keep-Alive Cron</div>
                  <div className="text-xl font-black text-emerald-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Active (5m)</span>
                  </div>
                  <div className="text-xs text-slate-500">Pings server every 5 minutes to prevent sleep</div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Render Primary URL</div>
                  <div className="text-sm font-black text-slate-900 truncate">health-nutra.onrender.com</div>
                  <div className="text-xs text-slate-500">Live Production</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Icon name="shield-check" className="w-4 h-4 text-emerald-600" />
                  <span>Architecture & Integration Standards</span>
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>• <strong>Frontend Architecture:</strong> Clean modular separation with <code className="bg-slate-100 px-1 py-0.5 rounded">components/ui/*</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">pages/*</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">apiHelper.js</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded">navigation.js</code>.</p>
                  <p>• <strong>Search Optimization:</strong> Exact matches score 1000, prefix matches score 500, word boundaries score 300, and top matches are sorted to the very top with instant scroll.</p>
                  <p>• <strong>Dual Asset Support:</strong> Products support both direct image URL references (e.g. Unsplash, CDN) and direct file upload through Multer storage.</p>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ============================================================
          ADD / EDIT PRODUCT MODAL (Image URL & File Upload Supported!)
          ============================================================ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 my-8">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon name="package" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingProduct ? "Edit Formulation" : "Add New Product"}
                  </h3>
                  <p className="text-xs text-slate-500">Provide formulation details, clinical benefits, and image</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs font-semibold">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold">
                  {modalError}
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Health Nutra 9G"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600 bg-white"
                  >
                    <option value="Multivitamin">Multivitamin</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Omega-3">Omega-3</option>
                    <option value="Green Tea">Green Tea</option>
                    <option value="Ayurvedic">Ayurvedic</option>
                    <option value="Immunity">Immunity</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Unit Measure *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. Strip, 200ml, Box"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Price & Visibility */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Price in ₹ *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 235"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Initial Visibility *
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600 bg-white"
                  >
                    <option value="active">Active (Visible Publicly)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Image Input Options: URL vs File Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Product Image (URL or File)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                        imageInputMode === "url" ? "bg-brand-700 text-white" : "bg-white text-slate-600 border"
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("file")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                        imageInputMode === "file" ? "bg-brand-700 text-white" : "bg-white text-slate-600 border"
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageInputMode === "url" ? (
                  <div>
                    <input
                      type="url"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/product-image.jpg or /images/9g.png"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600 bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Paste any direct image URL or local path</p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductImageFile(e.target.files[0])}
                      className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Short Summary * (Card Highlight)
                </label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  placeholder="Brief 1-line key benefit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Full Description & Clinical Benefits
                </label>
                <textarea
                  rows={3}
                  value={productForm.fullDescription}
                  onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                  placeholder="Dosage, clinical indications, ingredients breakdown..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/20 disabled:opacity-60"
                >
                  {modalSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Formulation"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.AdminPage = AdminPage;
}

if (typeof exports !== "undefined") {
  exports.AdminPage = AdminPage;
}

