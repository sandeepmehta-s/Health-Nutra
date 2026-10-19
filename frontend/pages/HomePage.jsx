/**
 * Health Nutra - HomePage View
 * Complete storefront page with Search Optimization (relevance ranking & scroll-to-top),
 * dynamic formulations catalog, modal controls, Order Tracking, and Contact Us form.
 */

function HomePage() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState(["All"]);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [checkoutProduct, setCheckoutProduct] = React.useState(null);
  const [trackModalOpen, setTrackModalOpen] = React.useState(false);
  const [trackOrderId, setTrackOrderId] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const catalogRef = React.useRef(null);

  const handleOpenTrackModal = (id = "") => {
    setTrackOrderId(id);
    setTrackModalOpen(true);
  };

  // Register on window for child modals (like CheckoutModal) to call
  React.useEffect(() => {
    window.onOpenTrackModalWithId = handleOpenTrackModal;
  }, []);

  // Load initial products and categories from apiHelper
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          window.apiHelper.getProducts(),
          window.apiHelper.getCategories(),
        ]);

        if (prodData && prodData.success && Array.isArray(prodData.data)) {
          setProducts(prodData.data);
        }
        if (catData && catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data.includes("All") ? catData.data : ["All", ...catData.data]);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  // -------------------------------------------------------------
  // Search Optimization & Priority Relevance Ranking Algorithm
  // ("search optmization kr do search kre to top pr aa jaye")
  // -------------------------------------------------------------
  const filteredAndRankedProducts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Filter by category
    let baseList = products;
    if (selectedCategory && selectedCategory !== "All") {
      baseList = baseList.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // If query is empty, return category list
    if (!q) {
      return baseList;
    }

    // 2. Compute relevance scores
    const scoredList = [];
    for (const p of baseList) {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const shortDesc = (p.shortDescription || "").toLowerCase();
      const fullDesc = (p.fullDescription || "").toLowerCase();

      let score = 0;

      // Exact title match gets absolute #1 highest priority (score: 1000)
      if (name === q) {
        score += 1000;
      }
      // Name starts with query (score: 500)
      else if (name.startsWith(q)) {
        score += 500;
      }
      // Word inside name starts with query (score: 300)
      else if (name.split(/\s+/).some((word) => word.startsWith(q))) {
        score += 300;
      }
      // Name contains query anywhere (score: 150)
      else if (name.includes(q)) {
        score += 150;
      }

      // Category match (score: 80)
      if (cat.includes(q)) {
        score += 80;
      }

      // Short benefit description match (score: 40)
      if (shortDesc.includes(q)) {
        score += 40;
      }

      // Full clinical description match (score: 20)
      if (fullDesc.includes(q)) {
        score += 20;
      }

      if (score > 0) {
        scoredList.push({ ...p, _searchScore: score });
      }
    }

    // 3. Sort by score descending (Highest score is guaranteed #1 at the TOP of the grid)
    scoredList.sort((a, b) => b._searchScore - a._searchScore);

    return scoredList;
  }, [products, selectedCategory, searchQuery]);

  // Handle Search Input Change & Auto-Scroll to Top of Catalog
  const handleSearchChange = (query) => {
    setSearchQuery(query);

    // Auto-scroll catalog into view when user searches
    if (query.trim().length > 0 && catalogRef.current) {
      const rect = catalogRef.current.getBoundingClientRect();
      if (rect.top < -50 || rect.top > 300) {
        catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Navbar with Track Order Button */}
      <Navbar
        onOpenSearch={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Hero Showcase */}
      <Hero onExploreClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Quick Track Order Banner */}
      <div className="bg-brand-900 text-white py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">
              Already ordered? Enter your Order Reference number to check live courier & dispatch status.
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenTrackModal()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-black bg-brand-700 hover:bg-brand-600 text-white shadow-xs transition-colors shrink-0"
          >
            <Icon name="truck" className="w-3.5 h-3.5" />
            <span>Track Order & Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Section */}
      <main id="products" ref={catalogRef} className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-800 border border-brand-200">
            <Icon name="sparkles" className="w-3.5 h-3.5 text-accent-600" />
            <span>PHARMACEUTICAL EXCELLENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Certified Formulations
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Search by brand name or category. Formulations are intelligently prioritized with top matches at the top.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            totalResults={filteredAndRankedProducts.length}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto animate-spin">
              <Icon name="refresh-cw" className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-500">Loading formulations catalog...</p>
          </div>
        ) : filteredAndRankedProducts.length === 0 ? (
          <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-accent-600 flex items-center justify-center mx-auto">
              <Icon name="search-x" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">No Formulations Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any match for "{searchQuery}". Try searching for "9G", "10Q", "Green Tea", or "Omega".
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-sm"
            >
              Clear Search & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndRankedProducts.map((product, idx) => (
              <ProductCard
                key={product.id || idx}
                product={product}
                isTopMatch={searchQuery.trim().length > 0 && idx === 0}
                onViewDetails={(prod) => setSelectedProduct(prod)}
                onOrderNow={(prod) => setCheckoutProduct(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Quality Standards & Trust Banner */}
      <section id="about" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-black">
                <Icon name="shield-check" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">WHO-GMP Quality Certified</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every formulation follows stringent World Health Organization Good Manufacturing Practices with end-to-end sterility and air control.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-accent-600 flex items-center justify-center font-black">
                <Icon name="check-circle" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Heavy Metal & Purity Tested</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Raw nutraceutical extracts are rigorously tested via HPLC spectrometry to guarantee zero heavy metal contamination and optimal bioavailability.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Icon name="truck" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Direct From Warehouse</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By ordering directly through our portal, you receive 100% genuine formulation stock with maximum shelf-life and tamper-proof security seals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Us Section */}
      <section id="contact-inquiry" className="py-20 bg-slate-100/60 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOrderProduct={(prod) => {
          setSelectedProduct(null);
          setCheckoutProduct(prod);
        }}
      />

      {/* Instant Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        isOpen={Boolean(checkoutProduct)}
        onClose={() => setCheckoutProduct(null)}
        onOrderCompleted={(order) => {
          console.log("Order placed:", order);
        }}
      />

      {/* Track Order Status & Download PDF Modal */}
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialOrderId={trackOrderId}
      />

    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.HomePage = HomePage;
}

if (typeof exports !== "undefined") {
  exports.HomePage = HomePage;
}
