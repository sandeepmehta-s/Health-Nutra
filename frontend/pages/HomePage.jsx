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
        initialSearchQuery={searchQuery}
        onSearchQueryChange={handleSearchChange}
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
                onViewDetails={(prod) => {
                  const n = (prod?.name || "").toLowerCase();
                  const c = (prod?.category || "").toLowerCase();
                  if (n.includes("omega") || c.includes("omega")) window.location.href = "/omega";
                  else if (n.includes("9g")) window.location.href = "/9g";
                  else if (n.includes("10q") || c.includes("syrup")) window.location.href = "/10q";
                  else if (n.includes("tea") || c.includes("green")) window.location.href = "/green-tea";
                  else window.location.href = `/product/${prod.id || "omega"}`;
                }}
                onOrderNow={(prod) => setCheckoutProduct(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* ABOUT HEALTH NUTRA (Matching Official Mockup) */}
      {/* ========================================================= */}
      <section id="about" className="py-16 sm:py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Top Half: About Story & 4 Feature Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                <span className="text-[#166534]">ABOUT </span>
                <span className="text-[#F97316]">HEALTH NUTRA</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Health Nutra is committed to delivering high-quality nutraceutical products that support better health and well-being. Our mission is to bring nature and science together to create products that make a real difference in people&apos;s lives.
              </p>

              <div className="pt-2">
                <a
                  href="/about-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] shadow-xs shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Know More About Us</span>
                  <span className="text-base font-bold">→</span>
                </a>
              </div>
            </div>

            {/* Right Column: 4 Feature Pillars Box */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 text-center">
                
                {/* Quality Assured */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                    </svg>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                    Quality<br />Assured
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">
                    We ensure the highest standards in every product.
                  </p>
                </div>

                {/* Science Backed */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                    <Icon name="flask-conical" className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                    Science<br />Backed
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">
                    Our products are formulated with scientific research.
                  </p>
                </div>

                {/* Advanced Manufacturing */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                    <Icon name="factory" className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                    Advanced<br />Manufacturing
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">
                    State-of-the-art facilities for safe & effective products.
                  </p>
                </div>

                {/* Customer First */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                    <Icon name="users" className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                    Customer<br />First
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">
                    We care about our customers&apos; health & trust.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Half: OUR LEADERSHIP (Matching Mockup) */}
          <div id="team" className="space-y-8 pt-6 border-t border-slate-100 scroll-mt-24">
            
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-[#166534]">OUR </span>
                <span className="text-[#F97316]">LEADERSHIP</span>
              </h2>
              <div className="w-12 h-1 bg-[#166534] rounded-full mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Director */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 mx-auto sm:mx-0 shadow-xs">
                  <img
                    src="/images/director.jpg?v=3.6"
                    alt="Mr. Veer Pratap Singh - Founder & CEO"
                    title="Mr. Veer Pratap Singh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                    }}
                  />
                </div>

                <div className="space-y-2.5 flex-grow">
                  <div>
                    <h3 className="text-xl font-black text-[#166534] leading-tight">Mr. Veer Pratap Singh</h3>
                    <div className="text-xs font-semibold text-slate-500">Founder & CEO</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    As the Founder & CEO of Health Nutra, I am dedicated to our mission of delivering premium quality, clinically proven nutraceutical formulations that enhance daily vitality. Our foundation is built on continuous scientific innovation, pharmaceutical-grade purity, and earning enduring customer trust.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Visionary leadership with a focus on growth</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Committed to quality & innovation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Driving Health Nutra towards a healthier future</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Mr. Ashutosh Pandey */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 mx-auto sm:mx-0 shadow-xs">
                  <img
                    src="/images/ashutosh.jpg?v=3.6"
                    alt="Mr. Ashutosh Pandey"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                    }}
                  />
                </div>

                <div className="space-y-2.5 flex-grow">
                  <div>
                    <h3 className="text-xl font-black text-[#166534] leading-tight">Mr. Ashutosh Pandey</h3>
                    <div className="text-xs font-semibold text-slate-500">Marketing Manager</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    With over 25 years of rich experience in the marketing field, Mr. Ashutosh Pandey leads our marketing strategies with expertise and dedication.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>25+ Years of Marketing Experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Expert in Brand Building & Market Expansion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Strong Network & Client Relationships</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Strategic Planning & Team Leadership</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Interactive Contact Us Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
