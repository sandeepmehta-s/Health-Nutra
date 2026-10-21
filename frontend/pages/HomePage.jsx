/**
 * Health Nutra - HomePage View
 * Complete storefront page matching the official product showcase mockup.
 */

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name: "Health Nutra 9G",
    category: "Multivitamin",
    shortDescription: "Complete daily nutrition with vitamins & minerals.",
    fullDescription:
      "Multivitamin, multimineral & antioxidant tablets formulated with 9 essential vitality blends. 10 x 10 tablets. Take one tablet daily after meals or as advised by your healthcare professional.",
    price: 235,
    unit: "Strip",
    image: "/images/9g.png",
    status: "active",
  },
  {
    id: "2",
    name: "Health Nutra 10Q Syrup",
    category: "Multivitamin",
    shortDescription: "Energy booster syrup for daily health.",
    fullDescription:
      "200ml multivitamin, CoQ10 & antioxidant syrup. Helps combat fatigue, support cardiac health, and revitalize natural stamina. Shake well before use.",
    price: 210,
    unit: "200ml",
    image: "/images/10q.png",
    status: "active",
  },
  {
    id: "3",
    name: "Omega-3 Capsules",
    category: "Omega-3",
    shortDescription: "Supports heart, brain & joint health.",
    fullDescription:
      "Ultra-strength molecularly distilled fish oil softgels providing 1000mg EPA/DHA. Supports clear focus, cardiovascular circulation, and joint flexibility.",
    price: 499,
    unit: "Strip",
    image: "/images/omega3.png",
    status: "active",
  },
  {
    id: "4",
    name: "Green Tea Extract",
    category: "Green Tea",
    shortDescription: "Helps in weight management & antioxidant support.",
    fullDescription:
      "Standardised green tea botanical extract rich in natural polyphenols and 50% EGCG. Promotes healthy metabolic rate, gentle weight balance, and antioxidant protection.",
    price: 299,
    unit: "Box",
    image: "/images/greentea.png",
    status: "active",
  },
];

const DEFAULT_CATEGORIES = ["All", "Multivitamin", "Omega-3", "Green Tea"];

function HomePage() {
  const [products, setProducts] = React.useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = React.useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [checkoutProduct, setCheckoutProduct] = React.useState(null);
  const [trackModalOpen, setTrackModalOpen] = React.useState(false);
  const [trackOrderId, setTrackOrderId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const catalogRef = React.useRef(null);

  const handleOpenTrackModal = (id = "") => {
    setTrackOrderId(id);
    setTrackModalOpen(true);
  };

  // Register on window for child modals (like CheckoutModal) to call
  React.useEffect(() => {
    window.onOpenTrackModalWithId = handleOpenTrackModal;
  }, []);

  // Load initial products from apiHelper
  React.useEffect(() => {
    async function loadData() {
      try {
        if (!window.apiHelper) return;
        const prodData = await window.apiHelper.getProducts();

        if (prodData && prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          setProducts(prodData.data);
        }
      } catch (err) {
        console.warn("Catalog fetch notice, using fallback starter formulations:", err);
      }
    }
    loadData();
  }, []);

  // -------------------------------------------------------------
  // Filter & Search Priority Algorithm
  // -------------------------------------------------------------
  const filteredAndRankedProducts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Filter by category
    let baseList = products;
    if (selectedCategory && selectedCategory !== "All") {
      baseList = baseList.filter((p) => {
        const c = (p.category || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (target === "multivitamin") {
          return c.includes("multivitamin") || c.includes("syrup") || (p.name || "").toLowerCase().includes("9g") || (p.name || "").toLowerCase().includes("10q");
        }
        if (target === "omega-3") {
          return c.includes("omega") || (p.name || "").toLowerCase().includes("omega");
        }
        if (target === "green tea") {
          return c.includes("tea") || c.includes("green") || (p.name || "").toLowerCase().includes("green");
        }
        return c === target;
      });
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

      if (name === q) score += 1000;
      else if (name.startsWith(q)) score += 500;
      else if (name.split(/\s+/).some((word) => word.startsWith(q))) score += 300;
      else if (name.includes(q)) score += 150;

      if (cat.includes(q)) score += 80;
      if (shortDesc.includes(q)) score += 40;
      if (fullDesc.includes(q)) score += 20;

      if (score > 0) {
        scoredList.push({ ...p, _searchScore: score });
      }
    }

    scoredList.sort((a, b) => b._searchScore - a._searchScore);
    return scoredList;
  }, [products, selectedCategory, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
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
      
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Hero Showcase Matching Mockup */}
      <Hero onExploreClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Main Catalog Section */}
      <main id="products" ref={catalogRef} className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow scroll-mt-16">
        
        {/* Section Header: Leaf Icon + OUR PRODUCTS */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-1">
            <span className="text-emerald-700 text-xl">🌿</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            <span className="text-[#166534]">OUR </span>
            <span className="text-[#F97316]">PRODUCTS</span>
          </h2>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-8">
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

        {/* Products Grid: 4 Columns */}
        {loading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center mx-auto animate-spin">
              <Icon name="refresh-cw" className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-500">Loading formulations catalog...</p>
          </div>
        ) : filteredAndRankedProducts.length === 0 ? (
          <div className="py-16 px-6 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Icon name="search-x" className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">No Formulations Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery.trim()
                  ? `We couldn't find any match for "${searchQuery}". Try searching for "9G", "10Q", "Green Tea", or "Omega".`
                  : "No formulations currently found under this category."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                handleClearSearch();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#166534] hover:bg-[#14532d] transition-colors shadow-sm"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quality Standards & About Us Banner */}
      <section id="about" className="py-16 sm:py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Icon name="shield-check" className="w-3.5 h-3.5 text-emerald-700" />
              <span>ABOUT HEALTH NUTRA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Certified Pharmaceutical Excellence & Clinical Purity
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Health Nutra is dedicated to elevating human wellness through scientifically validated formulations, stringent WHO-GMP manufacturing standards, and direct batch integrity verification.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Icon name="shield-check" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">WHO-GMP Quality Certified</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every formulation follows stringent World Health Organization Good Manufacturing Practices with end-to-end sterility and clean-room air filtration.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                <Icon name="check-circle" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Heavy Metal & Purity Tested</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Raw nutraceutical extracts are rigorously tested via HPLC spectrometry to guarantee zero heavy metal contamination and optimal bioavailability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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

      {/* Leadership & Clinical Advisory ("Our Team") Section */}
      <section id="team" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Icon name="users" className="w-3.5 h-3.5 text-emerald-700" />
              <span>LEADERSHIP & ADVISORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Meet Our Executive Leadership
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Guided by seasoned clinical researchers, pharmaceutical chemists, and wellness visionaries committed to preventive healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Founder / Managing Director */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-emerald-600/30">
                <img
                  src="/images/ashutosh.jpg"
                  alt="Ashutosh Sharma"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                  }}
                />
              </div>
              <h3 className="text-lg font-black text-slate-900">Ashutosh Sharma</h3>
              <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider mt-0.5">Founder & Managing Director</p>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Pioneering pharmaceutical and nutraceutical research, driving formulation purity and nationwide healthcare distribution.
              </p>
            </div>

            {/* Medical Director */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-emerald-600/30">
                <img
                  src="/images/director.jpg"
                  alt="Dr. Rajesh Patel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                  }}
                />
              </div>
              <h3 className="text-lg font-black text-slate-900">Dr. Rajesh Patel</h3>
              <p className="text-xs font-bold text-[#166534] uppercase tracking-wider mt-0.5">Director & Clinical Advisor</p>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Specializing in metabolic wellness and evidence-based nutritional therapeutics to ensure maximum patient safety.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Contact Us Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
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

if (typeof window !== "undefined") {
  window.HomePage = HomePage;
}
if (typeof exports !== "undefined") {
  exports.HomePage = HomePage;
}
