// Health Nutra - Production React JSX Application
// Features: Dynamic Catalog, Priority Search Optimization (Relevance Ranking & Auto-Scroll to Top), Direct Order Checkout, and Modal Controls.

const { useState, useEffect, useMemo, useRef } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const catalogRef = useRef(null);
  const searchInputRef = useRef(null);

  // Category Icon Mapping
  const categoryIcons = {
    All: "layers",
    Multivitamin: "pill",
    Syrup: "droplet",
    "Omega-3": "heart-pulse",
    "Green Tea": "leaf",
    Ayurvedic: "sparkles",
    Immunity: "shield-check",
    General: "package",
  };

  // Fetch initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success && Array.isArray(prodData.data)) {
          setProducts(prodData.data);
        }
        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data.includes("All") ? catData.data : ["All", ...catData.data]);
        }
      } catch (err) {
        console.error("Failed to load formulations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Re-run Lucide icons on any state/DOM update
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      setTimeout(() => window.lucide.createIcons(), 20);
    }
  }, [products, selectedCategory, searchQuery, selectedProduct, checkoutProduct, orderSuccess, mobileMenuOpen]);

  // -------------------------------------------------------------
  // Search Optimization & Priority Relevance Ranking
  // ("search optmization kr do search kre to top pr aa jaye")
  // -------------------------------------------------------------
  const filteredAndRankedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // Step 1: Filter by category first
    let baseList = products;
    if (selectedCategory && selectedCategory !== "All") {
      baseList = baseList.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // If no search query, return list sorted by recent
    if (!q) {
      return baseList;
    }

    // Step 2: Compute relevance score for each product
    const scoredList = [];
    for (const p of baseList) {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const shortDesc = (p.shortDescription || "").toLowerCase();
      const fullDesc = (p.fullDescription || "").toLowerCase();

      let score = 0;

      // Exact title match gets absolute highest priority (score: 1000)
      if (name === q) {
        score += 1000;
      }
      // Name starts with the search query (score: 500)
      else if (name.startsWith(q)) {
        score += 500;
      }
      // Name has word starting with query (e.g. "9G" in "Health Nutra 9G") (score: 300)
      else if (new RegExp(`\\b${escapeRegExp(q)}`, "i").test(name)) {
        score += 300;
      }
      // Name contains query anywhere (score: 150)
      else if (name.includes(q)) {
        score += 150;
      }

      // Category matches query (score: 80)
      if (cat.includes(q)) {
        score += 80;
      }

      // Short benefit description contains query (score: 40)
      if (shortDesc.includes(q)) {
        score += 40;
      }

      // Full clinical description contains query (score: 20)
      if (fullDesc.includes(q)) {
        score += 20;
      }

      // If scored, add to candidates
      if (score > 0) {
        scoredList.push({ ...p, _searchScore: score });
      }
    }

    // Step 3: Sort by score descending (Top matching formulation appears #1 at the TOP!)
    scoredList.sort((a, b) => b._searchScore - a._searchScore);

    return scoredList;
  }, [products, selectedCategory, searchQuery]);

  // Handle Search Input Change with Smooth Scroll to Top of Catalog
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    // If query has at least 1 character, smoothly scroll the catalog into top view
    if (val.trim().length > 0 && catalogRef.current) {
      const rect = catalogRef.current.getBoundingClientRect();
      // Only scroll if catalog is not already at the top of the viewport
      if (rect.top < -50 || rect.top > 250) {
        catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Open Checkout Modal
  const openCheckout = (product) => {
    setSelectedProduct(null); // close details if open
    setCheckoutProduct(product);
    setCheckoutQty(1);
    setOrderSuccess(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. Dynamic Responsive Navigation Bar                          */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-700 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <i data-lucide="leaf" className="w-6 h-6"></i>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none block">
                HEALTH <span className="text-accent-600">NUTRA</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Pharmaceuticals
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <a href="#hero" className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition-colors">
              Home
            </a>
            <a href="#products" className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition-colors">
              Products Catalog
            </a>
            <a href="#about" className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition-colors">
              Quality Standards
            </a>
            <a href="#contact" className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition-colors">
              Contact & Order
            </a>
          </nav>

          {/* Admin Portal Button */}
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <i data-lucide="lock" className="w-3.5 h-3.5"></i>
              <span>Admin Portal</span>
            </a>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              <i data-lucide={mobileMenuOpen ? "x" : "menu"} className="w-5 h-5"></i>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">Home</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">Products Catalog</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">Quality Standards</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">Contact & Order</a>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Hero Section                                               */}
      {/* ------------------------------------------------------------- */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 text-xs font-extrabold uppercase tracking-wider border border-brand-200/80">
              <i data-lucide="shield-check" className="w-4 h-4 text-brand-700"></i>
              <span>ISO 9001:2015 & WHO-GMP Certified Formulations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Science-Backed <span className="text-brand-800">Nutraceuticals</span> For Vital Living
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Empowering proactive well-being through advanced bioavailable multivitamins, syrups, and molecularly distilled omega formulations.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products"
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-brand-800 hover:bg-brand-900 shadow-lg shadow-brand-900/20 transition-all flex items-center gap-2"
              >
                <i data-lucide="shopping-bag" className="w-4 h-4"></i>
                <span>Explore Formulations</span>
              </a>
              <a
                href="#about"
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
              >
                Quality Assurance
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 flex flex-col items-center">
              <img
                src="/images/hero-showcase.png"
                alt="Health Nutra Showcase"
                className="w-full h-64 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/uploads/9g.png";
                }}
              />
              <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <i data-lucide="check-circle" className="w-4 h-4"></i> 100% Active Ingredients
                </span>
                <span className="text-slate-400">Zero Added Sugars</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. Products Catalog with Optimized Priority Search             */}
      {/* ------------------------------------------------------------- */}
      <section id="products" ref={catalogRef} className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <i data-lucide="layers" className="w-3.5 h-3.5"></i>
            <span>Live Inventory Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            OUR ACTIVE FORMULATIONS & <span className="text-accent-600">PRODUCTS</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Search by formulation name, active vitamins, or clinical benefit. Best matches automatically float to the top.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            {/* Search Input with Auto-Scroll & Clear */}
            <div className="relative w-full sm:max-w-xl">
              <i data-lucide="search" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name (e.g. 9G, 10Q, Omega, Green Tea), benefit, or ingredient..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs sm:text-sm font-medium placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  title="Clear Search"
                >
                  <i data-lucide="x" className="w-4 h-4"></i>
                </button>
              )}
            </div>

            {/* Inventory Count Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-end sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700">
                <i data-lucide="package" className="w-4 h-4 text-brand-700"></i>
                <span>
                  {searchQuery
                    ? `${filteredAndRankedProducts.length} Match(es) found`
                    : `${filteredAndRankedProducts.length} Active Formulations`}
                </span>
              </span>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
            {categories.map((cat) => {
              const isSelected = cat.toLowerCase() === selectedCategory.toLowerCase();
              const icon = categoryIcons[cat] || "package";
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-brand-700 text-white shadow-sm shadow-brand-700/30 scale-105"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <i data-lucide={icon} className="w-3.5 h-3.5"></i>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Live Search Status Alert Bar */}
          {searchQuery && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/80 border border-brand-200 text-xs font-bold text-brand-900">
              <span className="flex items-center gap-2">
                <i data-lucide="sparkles" className="w-4 h-4 text-amber-500"></i>
                <span>
                  Showing priority matches for <span className="underline font-black">"{searchQuery}"</span>. Most relevant result is displayed at the top!
                </span>
              </span>
              <button onClick={clearSearch} className="text-xs text-brand-700 hover:underline">
                Clear & Show All
              </button>
            </div>
          )}

        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <i data-lucide="loader-2" className="w-8 h-8 animate-spin mx-auto text-brand-700 mb-2"></i>
            <p className="text-xs font-bold text-slate-500">Loading pharmaceutical formulations...</p>
          </div>
        ) : filteredAndRankedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
              <i data-lucide="package-search" className="w-8 h-8"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Formulations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products match "{searchQuery}". Try searching by broader terms like "vitamin", "syrup", or "box".
            </p>
            <button
              onClick={clearSearch}
              className="px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndRankedProducts.map((p, index) => {
              const isTopMatch = searchQuery.trim().length > 0 && index === 0;
              const catIcon = categoryIcons[p.category] || "package";

              return (
                <article
                  key={p.id || p._id}
                  className={`group bg-white rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border ${
                    isTopMatch
                      ? "border-emerald-500 ring-2 ring-emerald-500/30 relative"
                      : "border-slate-200/80 hover:border-brand-500/40"
                  }`}
                >
                  {/* Top Match Badge for Search Optimization */}
                  {isTopMatch && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-brand-700 shadow-md">
                        <i data-lucide="check" className="w-3 h-3"></i> Top Match
                      </span>
                    </div>
                  )}

                  {/* Thumbnail Box */}
                  <div className="relative w-full h-52 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 overflow-hidden mb-4 group-hover:bg-brand-50/30 transition-colors">
                    <img
                      src={p.image || "/uploads/9g.png"}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/uploads/9g.png";
                      }}
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-brand-800 shadow-xs border border-slate-200/60">
                      <i data-lucide={catIcon} className="w-3 h-3 text-emerald-600"></i>
                      {p.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.shortDescription || "Pure bioavailable nutraceutical formulation."}
                    </p>
                  </div>

                  {/* Pricing & Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-brand-800">₹{p.price}</span>
                        <span className="text-xs font-semibold text-slate-400">/ {p.unit || "Strip"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                      >
                        <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => openCheckout(p)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-sm shadow-orange-500/20 transition-all inline-flex items-center gap-1"
                      >
                        <i data-lucide="shopping-bag" className="w-3.5 h-3.5"></i>
                        <span>Order</span>
                      </button>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. Trust Pillars & Quality Standards                          */}
      {/* ------------------------------------------------------------- */}
      <section id="about" className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              The Health Nutra Standard
            </span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Why Trust Our Formulations?</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Every formulation is produced under strict pharmaceutical protocols ensuring purity and cellular bioavailability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-700 flex items-center justify-center">
                <i data-lucide="leaf" className="w-6 h-6"></i>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Pure Botanical Extracts</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Standardized botanical concentrates without artificial binders or heavy metals.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-accent-600 flex items-center justify-center">
                <i data-lucide="flask-conical" className="w-6 h-6"></i>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Scientific Bioavailability</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Formulated with synergistic nutrient ratios to maximize cellular absorption.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <i data-lucide="shield-check" className="w-6 h-6"></i>
              </div>
              <h4 className="font-black text-slate-900 text-sm">GMP & ISO Certified</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Manufactured in certified cleanroom environments with multi-stage QC testing.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <i data-lucide="clock" className="w-6 h-6"></i>
              </div>
              <h4 className="font-black text-slate-900 text-sm">Instant Live Sync</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Whenever staff update formulations in our admin portal, the website updates immediately.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. Product Detail Modal                                       */}
      {/* ------------------------------------------------------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="w-full h-56 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedProduct.image || "/uploads/9g.png"}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain p-4"
                />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <i data-lucide={categoryIcons[selectedProduct.category] || "package"} className="w-3.5 h-3.5"></i>
                  <span>{selectedProduct.category}</span>
                </span>
                <h3 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedProduct.shortDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Price</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-brand-800">₹{selectedProduct.price}</span>
                    <span className="text-xs text-slate-400">/ {selectedProduct.unit || "Strip"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Dispatch Status</span>
                  <span className="text-xs font-bold text-emerald-700">Ready for Dispatch (24 Hrs)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Formulation Details & Benefits</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.fullDescription || selectedProduct.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => openCheckout(selectedProduct)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md flex items-center gap-2"
                >
                  <i data-lucide="shopping-bag" className="w-4 h-4"></i>
                  <span>Order Formulation Now</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. Direct Order Checkout Modal                                */}
      {/* ------------------------------------------------------------- */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <i data-lucide="shopping-bag" className="w-5 h-5"></i>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Direct Order Checkout</h3>
                  <p className="text-[11px] text-slate-500">Fast delivery across India with Cash on Delivery</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutProduct(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <i data-lucide="check" className="w-8 h-8"></i>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Order Placed Successfully!</h3>
                  <p className="text-xs text-slate-500">
                    Thank you for ordering with Health Nutra. Our dispatch team will verify and ship your order.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Tracking ID:</span>
                    <span className="font-black text-brand-800 font-mono">#{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="font-bold text-slate-700">{orderSuccess.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-bold text-emerald-700">2-4 Business Days</span>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <CheckoutForm
                product={checkoutProduct}
                qty={checkoutQty}
                setQty={setCheckoutQty}
                onSuccess={(data) => setOrderSuccess(data)}
              />
            )}

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. Footer                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white">
                <i data-lucide="leaf" className="w-5 h-5"></i>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                HEALTH <span className="text-accent-500">NUTRA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Premium nutraceutical formulations dedicated to community vitality, cellular resilience, and balanced wellness.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <p className="flex items-center gap-2">
                <i data-lucide="map-pin" className="w-4 h-4 text-emerald-400"></i>
                <span>123, Health Nutra House, Lucknow - 226001</span>
              </p>
              <p className="flex items-center gap-2">
                <i data-lucide="phone" className="w-4 h-4 text-emerald-400"></i>
                <span>+91 98765 43210</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Products Catalog</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">Quality Standard</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Customer Care</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Staff Management</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/admin/login" className="inline-flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <i data-lucide="lock" className="w-3.5 h-3.5"></i>
                  <span>Admin Sign In</span>
                </a>
              </li>
              <li>
                <a href="/admin" className="inline-flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <i data-lucide="layout-dashboard" className="w-3.5 h-3.5"></i>
                  <span>Product & Order Panel</span>
                </a>
              </li>
              <li>
                <a href="/api/products" target="_blank" className="inline-flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <i data-lucide="code" className="w-3.5 h-3.5"></i>
                  <span>Public API JSON</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Health Nutra. All Rights Reserved. Built with React JSX, Node.js & SQLite/MongoDB.
        </div>
      </footer>

    </div>
  );
}

// -------------------------------------------------------------
// Checkout Form Sub-Component
// -------------------------------------------------------------
function CheckoutForm({ product, qty, setQty, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentOption, setPaymentOption] = useState("Cash on Delivery (COD)");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const totalAmount = Number(product.price) * qty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMsg("Please fill in all mandatory delivery fields.");
      return;
    }

    const payload = {
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      shippingAddress: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      paymentMethod: paymentOption,
      items: [
        {
          productId: product.id || product._id,
          name: product.name,
          price: Number(product.price),
          quantity: qty,
          unit: product.unit || "Strip",
          image: product.image || "/uploads/9g.png",
        },
      ],
    };

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        onSuccess({ orderId: result.orderId, paymentMethod: paymentOption });
      } else {
        setErrorMsg(result.message || "Order submission failed.");
      }
    } catch {
      setErrorMsg("Network error. Please try placing your order again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Product Summary Box */}
      <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/60 flex items-center gap-3">
        <img
          src={product.image || "/uploads/9g.png"}
          alt={product.name}
          className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-brand-200/80"
        />
        <div className="flex-grow min-w-0">
          <h4 className="text-sm font-black text-slate-900 truncate">{product.name}</h4>
          <p className="text-[11px] text-slate-500">{product.unit || "Strip"} &bull; ₹{product.price}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold text-slate-600">Qty:</span>
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-xs">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-2.5 py-0.5 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-l-lg"
              >
                -
              </button>
              <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(50, qty + 1))}
                className="px-2.5 py-0.5 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
          <span className="text-base font-black text-brand-800">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Form Inputs */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">WhatsApp / Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email Address (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Complete Shipping Address *</label>
          <textarea
            required
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House/Flat No., Building Name, Street / Landmark..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">City / District *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lucknow, Delhi"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">PIN Code *</label>
            <input
              type="text"
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 226001"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <label className="text-xs font-bold text-slate-700 block">Payment Option</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${paymentOption === "Cash on Delivery (COD)" ? "border-brand-500 bg-brand-50/50" : "border-slate-200 bg-slate-50/50"}`}>
              <input
                type="radio"
                name="reactPaymentOption"
                value="Cash on Delivery (COD)"
                checked={paymentOption === "Cash on Delivery (COD)"}
                onChange={() => setPaymentOption("Cash on Delivery (COD)")}
                className="accent-brand-700"
              />
              <span className="font-bold text-slate-800">Cash on Delivery</span>
            </label>
            <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${paymentOption === "UPI / Online" ? "border-brand-500 bg-brand-50/50" : "border-slate-200 bg-slate-50/50"}`}>
              <input
                type="radio"
                name="reactPaymentOption"
                value="UPI / Online"
                checked={paymentOption === "UPI / Online"}
                onChange={() => setPaymentOption("UPI / Online")}
                className="accent-brand-700"
              />
              <span className="font-bold text-slate-800">UPI on Delivery</span>
            </label>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Payable Total</span>
          <span className="text-lg font-black text-brand-800">₹{totalAmount.toFixed(2)}</span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <i data-lucide="loader-2" className="w-4 h-4 animate-spin"></i>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <i data-lucide="check-circle" className="w-4 h-4"></i>
              <span>Confirm Order</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Helper: Escape Regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Mount React Root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
