/**
 * Health Nutra - Dedicated Products Page
 * Complete storefront catalog at /products matching the official brand design.
 */

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name: "Health Nutra 9G",
    category: "Multivitamin",
    shortDescription: "Multivitamin and multimineral tablets with omega-3 from flaxseed oil, lycopene, botanical extracts, amino acids, vitamins, minerals and trace elements.",
    fullDescription:
      "Health Nutra 9G is a multivitamin, multimineral and antioxidant tablet formulation. The package lists omega-3 fatty acids from flaxseed oil, lycopene, L-carnitine L-tartrate, green tea and grape seed extracts, ginkgo biloba, ginseng, garlic and ginger extracts, green coffee bean, glycyrrhiza glabra, guggul, essential amino acids, cyanocobalamin, vitamins, minerals and trace elements. The packaging presents it for energy and stamina, immunity, brain and heart health, antioxidant support and overall wellness. Follow the directions on the pack.",
    price: 235,
    unit: "Strip",
    image: "/images/9g.png",
    status: "active",
  },
  {
    id: "2",
    name: "Health Nutra Q10+ Syrup",
    category: "Syrup",
    shortDescription: "200 ml sugar-free mango-flavoured multivitamin and multimineral syrup with lycopene and amino acids.",
    fullDescription:
      "Health Nutra Q10+ is a 200 ml sugar-free mango-flavoured multivitamin and multimineral syrup. The package lists Coenzyme Q10, L-lysine and cyanocobalamin with lycopene and amino acids. The packaging presents it for energy, growth, immunity, brain function and overall wellness. Shake well and follow the directions on the pack.",
    price: 210,
    unit: "200ml",
    image: "/images/10q.png",
    status: "active",
  },
  {
    id: "3",
    name: "Health Nutra Liv+ Syrup",
    category: "Liver Care",
    shortDescription: "200 ml sugar-free mixed-fruit liver, enzyme and appetizer syrup with natural herbs.",
    fullDescription:
      "Health Nutra Liv+ is a 200 ml sugar-free, mixed-fruit liver, enzyme and appetizer syrup. The packaging describes it as an advanced liver-care formula and presents it for supporting healthy liver function, appetite and digestion, enzyme activity, and general wellness. Enriched with natural herbs. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/livplus.jpeg",
    status: "hidden",
  },
  {
    id: "4",
    name: "Health Nutra NariA+ Syrup",
    category: "Women's Wellness",
    shortDescription: "200 ml sugar-free Ayurvedic women's wellness syrup with 1800 mg Ashoka root extract.",
    fullDescription:
      "Health Nutra NariA+ is a 200 ml sugar-free, mixed-fruit Ayurvedic wellness syrup featuring 1800 mg Ashoka root extract. The packaging presents it for women's wellness, hormonal balance, strength and energy, healthy menstruation, and overall wellbeing. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/naria-plus.jpeg",
    status: "hidden",
  },
  {
    id: "5",
    name: "Health Nutra Lipron+ Syrup",
    category: "Iron Supplement",
    shortDescription: "200 ml sugar-free mixed-fruit syrup with liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine.",
    fullDescription:
      "Health Nutra Lipron+ is a 200 ml sugar-free, mixed-fruit syrup containing liposomal ferric pyrophosphate, folic acid, cyanocobalamin and L-lysine. The packaging highlights iron absorption using liposomal technology, red blood cell formation, fatigue and weakness, and overall wellbeing. Follow the directions on the pack.",
    price: 1,
    mrp: 1,
    unit: "200ml",
    image: "/images/lipron-plus.jpeg",
    status: "hidden",
  },
];

const DEFAULT_CATEGORIES = ["All", "Multivitamin", "Liver Care", "Women's Wellness", "Iron Supplement"];

function ProductsPage() {
  const [products, setProducts] = React.useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = React.useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [checkoutProduct, setCheckoutProduct] = React.useState(null);
  const [trackModalOpen, setTrackModalOpen] = React.useState(false);
  const [trackOrderId, setTrackOrderId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Initialize filters from URL parameters (?search=... &category=...)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || "";
      const cat = params.get("category") || "";
      if (q) setSearchQuery(q);
      if (cat) setSelectedCategory(cat);
    } catch (e) {
      // Ignore query parsing errors
    }
  }, []);

  const handleOpenTrackModal = (id = "") => {
    setTrackOrderId(id);
    setTrackModalOpen(true);
  };

  // Register on window for child modals to call
  React.useEffect(() => {
    window.onOpenTrackModalWithId = handleOpenTrackModal;
  }, []);

  // Fetch initial catalog from API
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

  // Filter & Search Priority Algorithm
  const filteredAndRankedProducts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Filter by category
    let baseList = products.filter((product) => product.status !== "hidden" || product.pricePending);
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

    if (!q) {
      return baseList;
    }

    // 2. Rank by relevance
    const scoredList = [];
    for (const p of baseList) {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const shortDesc = (p.shortDescription || "").toLowerCase();
      const fullDesc = (p.fullDescription || "").toLowerCase();

      let score = 0;
      if (name === q) score += 1000;
      else if (name.startsWith(q)) score += 500;
      else if (name.split(/\s+/).some((w) => w.startsWith(q))) score += 300;
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        initialSearchQuery={searchQuery}
        onSearchQueryChange={(query) => setSearchQuery(query)}
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Breadcrumb Header */}
      <div className="bg-emerald-900/5 border-b border-emerald-900/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <a href="/" className="hover:text-[#166534] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#166534] font-bold">Products</span>
          {selectedCategory !== "All" && (
            <>
              <span>/</span>
              <span className="text-slate-700">{selectedCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Catalog Container */}
      <main className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        
        {/* Section Header: Leaf Icon + OUR PRODUCTS */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-1">
            <span className="text-emerald-700 text-xl">🌿</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            <span className="text-[#166534]">OUR </span>
            <span className="text-[#F97316]">PRODUCTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto mt-1">
            Explore certified nutraceutical formulations crafted with scientific research and clinical quality standards.
          </p>
        </div>

        {/* Category Filter Pills (No search bar here, search is in the navbar) */}
        <div className="mb-8">
          <SearchFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        </div>

        {/* Active Search Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs">
            <span className="text-emerald-900 font-semibold">
              Showing results for: <span className="font-black text-[#166534]">"{searchQuery}"</span> ({filteredAndRankedProducts.length} formulations)
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

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
                setSearchQuery("");
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
                  if (n.includes("lipron+")) window.location.href = "/lipron-plus";
                  else if (n.includes("naria+")) window.location.href = "/naria-plus";
                  else if (n.includes("liv+")) window.location.href = "/liv-plus";
                  else if (n.includes("q10+") || n.includes("10q")) window.location.href = "/q10-plus";
                  else if (n.includes("9g")) window.location.href = "/9g";
                  else window.location.href = `/product/${prod.id || "1"}`;
                }}
                onOrderNow={(prod) => setCheckoutProduct(prod)}
              />
            ))}
          </div>
        )}

      </main>

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
  window.ProductsPage = ProductsPage;
}
if (typeof exports !== "undefined") {
  exports.ProductsPage = ProductsPage;
}

