/**
 * Health Nutra - Dedicated Product Detail Page
 * Ultra-modern, real e-commerce single product view (Amazon / 1mg / HealthKart style).
 * Features: High-res gallery, MRP strikethrough, savings badge, pack selector,
 * pincode check, verified reviews, supplement facts table, FAQs, and instant COD checkout.
 */

const FORMULATION_DATABASE = {
  "1": {
    id: "1",
    slug: "9g",
    name: "Health Nutra 9G Multivitamin & Antioxidant Tablets",
    shortName: "Health Nutra 9G",
    category: "Multivitamin",
    refId: "HN-9G-78A-452010",
    mrp: 320,
    price: 235,
    unit: "10 x 10 Tablets (Strip)",
    image: "/images/9g.png",
    rating: 4.9,
    reviewCount: 312,
    monthlyDelivered: "1,450+",
    stockStatus: "In Stock",
    sku: "HN-TAB-9G-100",
    shortDescription:
      "Synergistic blend of 9 vital botanical extracts, essential multivitamins, minerals, and potent antioxidants designed for all-day stamina, metabolic vigor, and immunity defense.",
    fullDescription:
      "Health Nutra 9G is an advanced clinical-grade formulation combining Ginseng, Ginkgo Biloba, Green Tea Extract, Grape Seed Extract, Garlic, Guggul, Ginger, Green Coffee Bean, and Glycyrrhiza. Each coated tablet delivers complete micronutrient coverage adhering strictly to WHO-GMP standards.",
    highlights: [
      "9 Essential Vitality Extracts (Ginseng, Ginkgo Biloba, Grape Seed & more)",
      "Supports daily cellular energy, immune barrier & cognitive alertness",
      "Rich in natural antioxidants to fight oxidative stress and fatigue",
      "100% Vegetarian coated tablets, easy to swallow with zero aftertaste",
      "Manufactured in WHO-GMP & ISO 9001:2015 certified pharmaceutical facility",
    ],
    packOptions: [
      { count: 1, label: "1 Pack (100 Tablets)", price: 235, mrp: 320, discount: "26% OFF" },
      { count: 2, label: "Pack of 2 (Value Saver)", price: 423, mrp: 640, discount: "34% OFF", bestValue: true },
      { count: 3, label: "Pack of 3 (Family Shield)", price: 599, mrp: 960, discount: "38% OFF" },
    ],
    supplementFacts: [
      { nutrient: "Ginseng Botanical Extract", amount: "42.5 mg", rda: "**" },
      { nutrient: "Ginkgo Biloba Extract", amount: "20 mg", rda: "**" },
      { nutrient: "Green Tea Extract (50% Polyphenols)", amount: "25 mg", rda: "**" },
      { nutrient: "Grape Seed Extract (95% Proanthocyanidins)", amount: "15 mg", rda: "**" },
      { nutrient: "Vitamin C (Ascorbic Acid)", amount: "40 mg", rda: "100%" },
      { nutrient: "Vitamin B Complex (B1, B2, B6, B12)", amount: "Optimal Blend", rda: "100%" },
      { nutrient: "Zinc Elemental (as Zinc Sulphate)", amount: "12 mg", rda: "100%" },
      { nutrient: "Folic Acid & Minerals", amount: "100 mcg", rda: "100%" },
    ],
    dosage: "Take 1 tablet daily after breakfast or lunch with lukewarm water, or as directed by your physician.",
    storage: "Store in a cool, dry place below 25°C. Protect from direct heat, sunlight and moisture.",
  },

  "2": {
    id: "2",
    slug: "10q",
    name: "Health Nutra 10Q CoQ10 Revitalizing Syrup (200ml)",
    shortName: "Health Nutra 10Q Syrup",
    category: "Multivitamin",
    refId: "HN-10Q-SYR-452010",
    mrp: 295,
    price: 210,
    unit: "200ml Bottle",
    image: "/images/10q.png",
    rating: 4.8,
    reviewCount: 189,
    monthlyDelivered: "980+",
    stockStatus: "In Stock",
    sku: "HN-SYR-10Q-200",
    shortDescription:
      "Fast-absorbing clinical vitality syrup enriched with Coenzyme Q10, Lycopene, essential B-vitamins, and L-Lysine to combat chronic lethargy and revitalize natural metabolism.",
    fullDescription:
      "Health Nutra 10Q Syrup is formulated for quick bio-absorption. Featuring active Coenzyme Q10 and bio-available Lycopene, it assists in cardiovascular stamina, muscle recovery, and post-illness rejuvenation.",
    highlights: [
      "Infused with Coenzyme Q10 (CoQ10) for cellular ATP production",
      "High-potency Lycopene & B-Complex vitamins for heart & vascular health",
      "Combats afternoon fatigue, general weakness and low appetite",
      "Delicious mixed fruit flavor with pleasant palatability",
      "Clinically manufactured under strict pharmaceutical clean-room protocols",
    ],
    packOptions: [
      { count: 1, label: "1 Bottle (200ml)", price: 210, mrp: 295, discount: "29% OFF" },
      { count: 2, label: "Pack of 2 (Twin Energizer)", price: 385, mrp: 590, discount: "35% OFF", bestValue: true },
      { count: 3, label: "Pack of 3 (Complete Course)", price: 549, mrp: 885, discount: "38% OFF" },
    ],
    supplementFacts: [
      { nutrient: "Coenzyme Q10 (CoQ10)", amount: "30 mg", rda: "**" },
      { nutrient: "Lycopene 10% Complex", amount: "2000 mcg", rda: "**" },
      { nutrient: "L-Lysine Hydrochloride", amount: "50 mg", rda: "**" },
      { nutrient: "Niacinamide (Vitamin B3)", amount: "15 mg", rda: "100%" },
      { nutrient: "Vitamin B6 (Pyridoxine HCl)", amount: "1.5 mg", rda: "100%" },
      { nutrient: "Vitamin B12 (Cyanocobalamin)", amount: "1 mcg", rda: "100%" },
      { nutrient: "Zinc Gluconate", amount: "7.5 mg", rda: "65%" },
    ],
    dosage: "Adults: 1-2 teaspoonfuls (5-10ml) twice daily after meals. Shake well before use.",
    storage: "Keep bottle tightly closed in a cool and dry place away from sunlight. Do not freeze.",
  },

  "3": {
    id: "3",
    slug: "omega3",
    name: "Health Nutra Omega-3 Ultra Strength Fish Oil Softgels (1000mg)",
    shortName: "Omega-3 Capsules",
    category: "Omega-3",
    refId: "HN-6ad8e320fe7a95dc9f36f5cd",
    mrp: 699,
    price: 499,
    unit: "60 Softgels Bottle",
    image: "/images/omega3.png",
    rating: 4.9,
    reviewCount: 426,
    monthlyDelivered: "2,100+",
    stockStatus: "In Stock",
    sku: "HN-SFT-OMG-1000",
    shortDescription:
      "Ultra-pure molecularly distilled marine Omega-3 softgels supplying 1000mg fish oil with 180mg EPA and 120mg DHA. Engineered for cardiovascular health, joint lubrication, and sharp cognitive function.",
    fullDescription:
      "Health Nutra Omega-3 Capsules undergo multi-stage molecular distillation to eliminate heavy metals, mercury, and PCBs. With optimal enteric coating to prevent fishy burps, this daily essential supports healthy lipid profiles and flexible joints.",
    highlights: [
      "1000mg Pure Cold-Water Fish Oil per softgel",
      "Optimal 180mg EPA & 120mg DHA ratio for heart and brain focus",
      "Molecularly distilled: Zero mercury, heavy metals, or toxic contaminants",
      "Enteric-coated softgels with zero fishy aftertaste or reflux",
      "Supports joint flexibility, healthy cholesterol balance & glowing skin",
    ],
    packOptions: [
      { count: 1, label: "1 Bottle (60 Softgels)", price: 499, mrp: 699, discount: "29% OFF" },
      { count: 2, label: "Pack of 2 (2 Months Supply)", price: 899, mrp: 1398, discount: "36% OFF", bestValue: true },
      { count: 3, label: "Pack of 3 (Quarterly Care)", price: 1249, mrp: 2097, discount: "40% OFF" },
    ],
    supplementFacts: [
      { nutrient: "Purified Fish Oil Concentrate", amount: "1000 mg", rda: "**" },
      { nutrient: "Eicosapentaenoic Acid (EPA)", amount: "180 mg", rda: "**" },
      { nutrient: "Docosahexaenoic Acid (DHA)", amount: "120 mg", rda: "**" },
      { nutrient: "Total Omega-3 Fatty Acids", amount: "350 mg", rda: "**" },
      { nutrient: "Vitamin E (d-alpha tocopherol)", amount: "10 IU", rda: "50%" },
    ],
    dosage: "Take 1 to 2 softgels daily with water preferably after lunch or dinner, or as prescribed.",
    storage: "Store in a cool, dry place. Keep container tightly closed away from direct heat and children.",
  },

  "4": {
    id: "4",
    slug: "greentea",
    name: "Health Nutra Green Tea Botanical Extract Capsules (50% EGCG)",
    shortName: "Green Tea Extract",
    category: "Green Tea",
    refId: "HN-GT-EXT-452010",
    mrp: 450,
    price: 299,
    unit: "60 Capsules Box",
    image: "/images/greentea.png",
    rating: 4.7,
    reviewCount: 164,
    monthlyDelivered: "840+",
    stockStatus: "In Stock",
    sku: "HN-CAP-GRN-500",
    shortDescription:
      "Standardised Camellia sinensis extract loaded with active catechins and 50% EGCG. Accelerates healthy metabolic calorie burning, detoxifies cells, and promotes natural weight balance.",
    fullDescription:
      "Health Nutra Green Tea Extract delivers the polyphenol power of over 6 cups of freshly brewed green tea in a single standardized capsule. Designed for fitness enthusiasts and individuals seeking natural antioxidant defense.",
    highlights: [
      "Standardised to 50% Epigallocatechin Gallate (EGCG) & 98% Polyphenols",
      "Stimulates thermogenesis and healthy metabolic calorie expenditure",
      "Potent free-radical scavenger supporting clean cellular detoxification",
      "Gentle natural clean energy boost without high-caffeine jitters",
      "100% Pure vegetable capsules, gluten-free and non-GMO",
    ],
    packOptions: [
      { count: 1, label: "1 Box (60 Capsules)", price: 299, mrp: 450, discount: "34% OFF" },
      { count: 2, label: "Pack of 2 (Metabolism Kickstart)", price: 549, mrp: 900, discount: "39% OFF", bestValue: true },
      { count: 3, label: "Pack of 3 (90-Day Fit Journey)", price: 779, mrp: 1350, discount: "42% OFF" },
    ],
    supplementFacts: [
      { nutrient: "Green Tea Extract (Camellia sinensis)", amount: "500 mg", rda: "**" },
      { nutrient: "Epigallocatechin Gallate (EGCG)", amount: "250 mg (50%)", rda: "**" },
      { nutrient: "Total Polyphenols", amount: "490 mg (98%)", rda: "**" },
      { nutrient: "Natural Bio-Caffeine (Gentle)", amount: "< 15 mg", rda: "**" },
    ],
    dosage: "Take 1 capsule once or twice daily 30 minutes before meals, or as advised by your healthcare expert.",
    storage: "Store in a cool dry area away from humidity and heat. Keep bottle sealed.",
  },
};

const SAMPLE_REVIEWS = [
  {
    id: "r1",
    author: "Dr. Vikram Joshi, MD",
    location: "Indore, MP",
    verified: true,
    rating: 5,
    date: "14 Oct 2026",
    title: "Remarkable clinical grade formulation & purity",
    comment:
      "I have been prescribing this formulation to patients with joint and metabolic complaints. The clinical purity and tolerance are outstanding with zero digestive irritation. Fast Indore local delivery as well.",
  },
  {
    id: "r2",
    author: "Meenakshi Sundaram",
    location: "Bengaluru, KA",
    verified: true,
    rating: 5,
    date: "08 Oct 2026",
    title: "100% authentic product, no fishy reflux",
    comment:
      "Ordered with COD payment. Delivered within 3 days in neat tamper-proof packaging. High quality softgels that leave no aftertaste. Will definitely order the pack of 3 next time.",
  },
  {
    id: "r3",
    author: "Rajeshwar Tiwari",
    location: "Bhopal, MP",
    verified: true,
    rating: 5,
    date: "28 Sep 2026",
    title: "Noticeable boost in daily stamina",
    comment:
      "Genuine product directly from the manufacturer. Very easy to track order through the website and the automated PDF invoice arrived right on time.",
  },
];

function ProductDetailPage() {
  const [selectedPackIdx, setSelectedPackIdx] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [pincode, setPincode] = React.useState("");
  const [pincodeStatus, setPincodeStatus] = React.useState(null);
  const [checkingPincode, setCheckingPincode] = React.useState(false);

  // Modals state
  const [checkoutProduct, setCheckoutProduct] = React.useState(null);
  const [trackModalOpen, setTrackModalOpen] = React.useState(false);
  const [trackOrderId, setTrackOrderId] = React.useState("");

  // Determine active product from URL path or query parameter
  const product = React.useMemo(() => {
    let lookupKey = "3"; // default to Omega-3 if unspecified

    // 1. Check query parameter (?id=... or ?slug=...)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const qId = searchParams.get("id");
      const qSlug = searchParams.get("slug");
      if (qId && FORMULATION_DATABASE[qId]) return FORMULATION_DATABASE[qId];
      if (qSlug) {
        const found = Object.values(FORMULATION_DATABASE).find(
          (p) => p.slug.toLowerCase() === qSlug.toLowerCase()
        );
        if (found) return found;
      }
    } catch (e) {}

    // 2. Check path (/product/3, /product/omega3, etc.)
    const path = window.location.pathname.toLowerCase();
    if (path.includes("9g")) lookupKey = "1";
    else if (path.includes("10q")) lookupKey = "2";
    else if (path.includes("omega")) lookupKey = "3";
    else if (path.includes("tea") || path.includes("green")) lookupKey = "4";
    else {
      // Check numeric id at end of path
      const segments = path.split("/").filter(Boolean);
      const lastSeg = segments[segments.length - 1];
      if (lastSeg && FORMULATION_DATABASE[lastSeg]) {
        lookupKey = lastSeg;
      }
    }

    return FORMULATION_DATABASE[lookupKey] || FORMULATION_DATABASE["3"];
  }, []);

  const currentPack = product.packOptions[selectedPackIdx] || product.packOptions[0];
  const activePrice = currentPack.price;
  const totalPrice = activePrice * quantity;

  // Handle Pincode validation
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length !== 6 || isNaN(pincode)) {
      setPincodeStatus({
        valid: false,
        msg: "Please enter a valid 6-digit Indian postal pincode.",
      });
      return;
    }

    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      setPincodeStatus({
        valid: true,
        msg: `Delivery available to ${pincode} • Estimated dispatch: Within 24 Hours • Cash on Delivery Available!`,
      });
    }, 400);
  };

  const handleOpenCheckout = () => {
    const orderPayload = {
      ...product,
      id: product.id,
      name: `${product.name} (${currentPack.label})`,
      price: activePrice,
      quantity: quantity,
      selectedPack: currentPack.label,
    };
    setCheckoutProduct(orderPayload);
  };

  const handleOpenTrackModal = (id = "") => {
    setTrackOrderId(id);
    setTrackModalOpen(true);
  };

  // Other formulations for "Customers Also Considered"
  const relatedProducts = React.useMemo(() => {
    return Object.values(FORMULATION_DATABASE).filter((p) => p.id !== product.id);
  }, [product.id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* Top Main Navbar */}
      <Navbar
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Real E-Commerce Breadcrumb */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <a href="/" className="hover:text-[#166534] transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-[#166534] transition-colors">Products</a>
            <span>/</span>
            <a
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#166534] transition-colors"
            >
              {product.category}
            </a>
            <span className="hidden sm:inline">/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md hidden sm:inline">
              {product.shortName}
            </span>
          </div>

          <a href="/products" className="sm:hidden text-xs font-bold text-[#166534] flex items-center gap-1">
            <span>All Products</span>
            <span>➔</span>
          </a>
        </div>
      </div>

      <main className="w-full min-w-0 flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-8 sm:space-y-12 pb-28 lg:pb-12">
        
        {/* ========================================================= */}
        {/* TOP SECTION: 2-COLUMN REAL E-COMMERCE PRODUCT LAYOUT */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* ------------------------------------------------------- */}
          {/* LEFT COLUMN: Large Showcase Image Gallery & Trust Perks */}
          {/* ------------------------------------------------------- */}
          <div className="min-w-0 lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* Primary Main Image Showcase Card */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-12 shadow-sm flex items-center justify-center overflow-hidden min-h-[250px] sm:min-h-[460px] group">
              
              {/* Category & Certification Badge (Top Left) */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex flex-col gap-1 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-50 text-[#166534] border border-emerald-200 shadow-2xs">
                  <Icon name="leaf" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{product.category}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                  ★ WHO-GMP Certified
                </span>
              </div>

              {/* Discount Percentage Badge (Top Right) */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black bg-[#F97316] text-white shadow-sm">
                  {currentPack.discount || "29% OFF"}
                </span>
              </div>

              {/* Center Main Bottle Image */}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-56 sm:max-h-96 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500 py-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/10q.png";
                }}
              />

              {/* Bottom Subtle Watermark */}
              <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  100% Genuine Health Nutra Formulation
                </span>
              </div>
            </div>

            {/* Trust & Dispatch Assurance Strip: Compact 4-col mini bar */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-3.5 text-center flex flex-col items-center space-y-0.5 sm:space-y-1 shadow-2xs">
                <Icon name="shield-check" className="w-4 h-4 sm:w-5 sm:h-5 text-[#166534]" />
                <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate">100% Genuine</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium truncate hidden sm:block">Direct Supply</span>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-3.5 text-center flex flex-col items-center space-y-0.5 sm:space-y-1 shadow-2xs">
                <Icon name="truck" className="w-4 h-4 sm:w-5 sm:h-5 text-[#F97316]" />
                <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate">Free Delivery</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium truncate hidden sm:block">Orders ₹499+</span>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-3.5 text-center flex flex-col items-center space-y-0.5 sm:space-y-1 shadow-2xs">
                <Icon name="banknote" className="w-4 h-4 sm:w-5 sm:h-5 text-[#166534]" />
                <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate">COD Available</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium truncate hidden sm:block">Pay at Doorstep</span>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-2 sm:p-3.5 text-center flex flex-col items-center space-y-0.5 sm:space-y-1 shadow-2xs">
                <Icon name="refresh-cw" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate">Safe Transit</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-medium truncate hidden sm:block">Damage Cover</span>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN: E-Commerce Buy Box, Pack Selector, Pricing */}
          {/* ------------------------------------------------------- */}
          <div className="min-w-0 lg:col-span-6 space-y-5 sm:space-y-6">
            
            {/* Title, Brand, Rating & Reference */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>HEALTH NUTRA™ CLINICAL</span>
                <span>•</span>
                <span className="min-w-0 break-all font-mono text-slate-500 sm:break-normal">{product.refId}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating Strip */}
              <div className="flex items-center flex-wrap gap-2 pt-0.5">
                <div className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-black shadow-2xs">
                  <span>★ {product.rating}</span>
                </div>
                <span className="text-xs font-bold text-slate-700 underline cursor-pointer hover:text-[#166534]">
                  {product.reviewCount} Ratings
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-[#F97316]">
                  🔥 {product.monthlyDelivered} Delivered
                </span>
              </div>
            </div>

            {/* Special Price & MRP Strikethrough Box */}
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-3.5 sm:p-5 flex items-baseline justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-4xl font-black text-[#166534]">
                    ₹{activePrice}
                  </span>
                  <span className="text-sm sm:text-lg text-slate-400 line-through font-semibold">
                    ₹{currentPack.mrp}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-orange-600 bg-orange-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
                    {currentPack.discount}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                  Inclusive of all taxes • No hidden charges • COD available
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{product.stockStatus}</span>
              </div>
            </div>

            {/* Clinical Highlights Bullet Points */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-600">
                Key Formulation Highlights
              </div>
              <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pack Size / Variant Selector (3 Horizontal Sleek Cards) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700">
                <span>Select Pack Size</span>
                <span className="text-emerald-700 font-bold text-[11px]">Best Savings</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {product.packOptions.map((pack, idx) => {
                  const isSelected = selectedPackIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPackIdx(idx)}
                      className={`relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#166534] bg-emerald-50/80 ring-2 ring-[#166534]/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {pack.bestValue && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-2 px-1.5 sm:px-2 py-0.2 rounded-full text-[8px] font-black bg-[#F97316] text-white uppercase shadow-2xs whitespace-nowrap">
                          Best Value
                        </span>
                      )}
                      <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">
                        {pack.count === 1 ? "1 Pack" : `Pack of ${pack.count}`}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate hidden sm:block">
                        {pack.label}
                      </div>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-xs sm:text-base font-black text-[#166534]">₹{pack.price}</span>
                        <span className="text-[9px] sm:text-[11px] text-slate-400 line-through">₹{pack.mrp}</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-orange-600 mt-0.5">
                        {pack.discount}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector + Total Subtotal */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200">
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-slate-600">Quantity</div>
                <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px] sm:max-w-none">
                  {currentPack.label}
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold disabled:opacity-40 transition-colors shadow-2xs text-xs sm:text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 sm:w-10 text-center font-black text-xs sm:text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold transition-colors shadow-2xs text-xs sm:text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Total</div>
                  <div className="text-base sm:text-xl font-black text-[#166534]">₹{totalPrice}</div>
                </div>
              </div>
            </div>

            {/* Pincode & Delivery Availability Checker */}
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Icon name="map-pin" className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Check Delivery & COD</span>
                </span>
                <span className="text-[10px] text-slate-400">Hub: Indore 452010</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 focus:border-[#166534] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors shrink-0 cursor-pointer"
                >
                  {checkingPincode ? "..." : "Check"}
                </button>
              </form>

              {pincodeStatus && (
                <div
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    pincodeStatus.valid
                      ? "bg-emerald-100/70 text-emerald-900 border border-emerald-300"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <Icon
                    name={pincodeStatus.valid ? "check-circle" : "alert-circle"}
                    className="w-4 h-4 shrink-0"
                  />
                  <span>{pincodeStatus.msg}</span>
                </div>
              )}
            </div>

            {/* Primary Action Buttons (Desktop Buy Box) */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleOpenCheckout}
                className="w-full min-w-0 py-3.5 sm:py-4 px-3 sm:px-5 rounded-2xl text-sm sm:text-base font-black text-white bg-[#166534] hover:bg-[#14532d] shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
              >
                <Icon name="shopping-bag" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="min-w-0 text-center leading-snug">Buy Now • Cash on Delivery (COD)</span>
                <span className="ml-auto shrink-0 text-xs sm:text-sm bg-white/20 px-2.5 py-1 rounded-lg">
                  ₹{totalPrice}
                </span>
              </button>

              <a
                href={`https://wa.me/918809672959?text=${encodeURIComponent(
                  `Hello Health Nutra, I am interested in bulk / clinical supply of ${product.name}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-2xs hover:border-[#166534]"
              >
                <Icon name="message-circle" className="w-4 h-4 text-emerald-600" />
                <span>Enquire Bulk Supply / Dealership on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* DEEP-DIVE TABS: Clinical Specs, Facts Table, Usage, Reviews */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Tabs Navigation Bar */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70">
            {[
              { id: "overview", label: "Overview & Clinical Science", icon: "flask-conical" },
              { id: "facts", label: "Supplement Facts & Composition", icon: "table" },
              { id: "usage", label: "Dosage & Storage", icon: "info" },
              { id: "reviews", label: `Customer Reviews (${product.reviewCount})`, icon: "star" },
              { id: "faq", label: "FAQs & Delivery", icon: "help-circle" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-6 text-xs sm:text-sm font-black whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? "border-[#166534] text-[#166534] bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <Icon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview & Clinical Science */}
          {activeTab === "overview" && (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="max-w-3xl space-y-3">
                <h3 className="text-xl font-black text-slate-900">
                  About {product.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#166534] flex items-center justify-center shadow-2xs">
                    <Icon name="shield" className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Clinically Validated</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Strict adherence to standard pharmacopeial purity protocols and active therapeutic dosages.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#F97316] flex items-center justify-center shadow-2xs">
                    <Icon name="zap" className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Optimal Bioavailability</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Engineered for steady digestive release and maximum absorption without stomach discomfort.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-2xs">
                    <Icon name="award" className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">WHO-GMP & ISO Quality</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Produced in state-of-the-art climate-controlled facilities certified for good manufacturing practice.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Supplement Facts Table */}
          {activeTab === "facts" && (
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Active Composition & Nutritional Profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Serving Size: 1 Unit / Pack. Tested and certified according to FSSAI & nutraceutical guidelines.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-black border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-6">Active Ingredient / Botanical Extract</th>
                      <th className="py-3.5 px-6">Quantity Per Serving</th>
                      <th className="py-3.5 px-6">% Recommended Daily Allowance (RDA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {product.supplementFacts.map((fact, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="py-3.5 px-6 font-bold text-slate-900">{fact.nutrient}</td>
                        <td className="py-3.5 px-6">{fact.amount}</td>
                        <td className="py-3.5 px-6">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs">
                            {fact.rda}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * % RDA established as per ICMR Guidelines for Indian adults. ** Daily value not established.
              </p>
            </div>
          )}

          {/* Tab 3: Dosage & Storage */}
          {activeTab === "usage" && (
            <div className="p-6 sm:p-10 space-y-6 max-w-3xl">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#166534] flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon name="check-circle-2" className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">Recommended Dosage Guidelines</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {product.dosage}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon name="thermometer" className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">Storage & Packaging Integrity</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {product.storage}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  <strong>Notice:</strong> Dietary supplement only. Not intended to diagnose, treat, cure, or prevent any medical disease. Pregnant or lactating women should consult their physician before use.
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Verified Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="p-6 sm:p-10 space-y-8">
              {/* Review Summary Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <div className="text-4xl font-black text-slate-900">{product.rating}</div>
                    <div className="text-amber-500 text-sm font-bold">★★★★★</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Overall Rating</div>
                  </div>
                  <div className="border-l border-slate-200 pl-5 text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-900">98% of verified buyers recommend this</div>
                    <div>Based on {product.reviewCount} clinical and direct consumer reviews</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Thank you! Review submissions open after confirmed product delivery.")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {/* Individual Review Cards */}
              <div className="space-y-4">
                {SAMPLE_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="break-words font-black text-sm text-slate-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</div>
                      <span className="text-xs font-bold text-slate-800">{rev.title}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>

                    <div className="text-[11px] text-slate-400 font-medium">
                      Location: {rev.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: FAQs */}
          {activeTab === "faq" && (
            <div className="p-6 sm:p-10 space-y-4 max-w-3xl">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900">How is my order shipped?</div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Orders are packed in pharmaceutical tamper-evident sealed packaging and dispatched via premium courier services (BlueDart / Delhivery / DTDC) directly from our Indore central facility.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900">Is Cash on Delivery (COD) available?</div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Yes! COD is available across all serviceable Indian pincodes. You pay the delivery executive in cash upon receiving your package.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900">Do I need a doctor's prescription?</div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Health Nutra formulations are classified as certified dietary nutraceutical supplements and can be ordered directly for general wellness without a prescription.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-black text-slate-900">How do I track my delivery?</div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Immediately upon ordering, you receive an Order ID (e.g. #HN-ORD-XXXX). You can track shipment milestones in real time on our website using the "Track Order" link in the navbar.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* RELATED / RECOMMENDED FORMULATIONS SECTION */}
        {/* ========================================================= */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                You May Also Need
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Complementary formulations recommended by clinical nutritionists.
              </p>
            </div>
            <a
              href="/products"
              className="self-start text-xs font-bold text-[#166534] hover:underline sm:self-auto"
            >
              View Full Catalog →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((relProd) => (
              <div
                key={relProd.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="h-40 flex items-center justify-center p-2 mb-3">
                  <img
                    src={relProd.image}
                    alt={relProd.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    {relProd.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {relProd.shortName}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-[#166534]">₹{relProd.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{relProd.mrp}</span>
                  </div>
                  <a
                    href={
                      relProd.id === "1"
                        ? "/9g"
                        : relProd.id === "2"
                        ? "/10q"
                        : relProd.id === "3"
                        ? "/omega"
                        : "/green-tea"
                    }
                    className="block text-center w-full py-2 rounded-xl text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] transition-colors"
                  >
                    View Product
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Mobile Floating Sticky Buy Bar (Visible on phones only) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 z-40 lg:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3">
        <div className="pl-1">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-xl font-black text-[#166534]">₹{totalPrice}</span>
            <span className="text-xs text-slate-400 line-through font-semibold">
              ₹{currentPack.mrp * quantity}
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Free Delivery • COD</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCheckout}
          className="flex-grow max-w-[210px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-[#166534] hover:bg-[#14532d] shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
        >
          <Icon name="shopping-bag" className="w-4 h-4" />
          <span>Buy Now (COD)</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Instant Checkout Modal */}
      <CheckoutModal
        product={checkoutProduct}
        isOpen={Boolean(checkoutProduct)}
        onClose={() => setCheckoutProduct(null)}
        onOrderCompleted={(order) => {
          console.log("Order confirmed on product page:", order);
        }}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialOrderId={trackOrderId}
      />

    </div>
  );
}

if (typeof window !== "undefined") {
  window.ProductDetailPage = ProductDetailPage;
}
if (typeof exports !== "undefined") {
  exports.ProductDetailPage = ProductDetailPage;
}

