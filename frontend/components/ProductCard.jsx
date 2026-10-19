/**
 * Health Nutra - ProductCard Component
 * Displays individual product card with search top-match highlight, image fallback, and action CTAs.
 */

function ProductCard({
  product,
  isTopMatch = false,
  onViewDetails,
  onOrderNow,
}) {
  const [imageError, setImageError] = React.useState(false);

  const categoryIcons = {
    Multivitamin: "pill",
    Syrup: "droplet",
    "Omega-3": "heart-pulse",
    "Green Tea": "leaf",
    Ayurvedic: "sparkles",
    Immunity: "shield-check",
    General: "package",
  };

  const iconName = categoryIcons[product.category] || "pill";

  // Resolve image source (uploaded path, direct url, or fallback)
  const imageSrc = React.useMemo(() => {
    if (!product.image) return "/images/10q.png";
    if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
      return product.image;
    }
    if (product.image.startsWith("/")) {
      return product.image;
    }
    return `/${product.image}`;
  }, [product.image]);

  return (
    <div
      className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isTopMatch
          ? "border-amber-400 ring-4 ring-amber-400/20 shadow-xl shadow-amber-500/10 -translate-y-1"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
      }`}
    >
      {/* Top Banner if isTopMatch */}
      {isTopMatch && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-1.5 flex items-center justify-between text-white text-xs font-black tracking-wide">
          <span className="flex items-center gap-1.5">
            <i data-lucide="star" className="w-3.5 h-3.5 fill-white"></i>
            <span>★ BEST MATCH FOR YOUR SEARCH</span>
          </span>
          <span className="text-[10px] uppercase opacity-90">Rank #1</span>
        </div>
      )}

      {/* Top Media Area */}
      <div className="p-6 pb-2">
        {/* Category & Badge Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200/60">
            <i data-lucide={iconName} className="w-3.5 h-3.5 text-brand-700"></i>
            <span>{product.category || "General"}</span>
          </span>

          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            {product.unit || "Pack"}
          </span>
        </div>

        {/* Product Visual */}
        <div className="relative h-48 sm:h-52 w-full rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-center p-4 overflow-hidden">
          {!imageError ? (
            <img
              src={imageSrc}
              alt={product.name}
              onError={() => setImageError(true)}
              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-2">
                <i data-lucide="pill" className="w-7 h-7"></i>
              </div>
              <span className="text-[11px] font-bold">Health Nutra Formulation</span>
            </div>
          )}
        </div>

        {/* Product Name & Benefits */}
        <div className="mt-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.shortDescription || product.fullDescription || "Pharmaceutical grade dietary formulation for clinical wellness."}
          </p>
        </div>
      </div>

      {/* Pricing & Action Bar */}
      <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              ₹{product.price}{" "}
              <span className="text-xs font-semibold text-slate-400">/ {product.unit || "Unit"}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
            <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
            <span>In Stock</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-brand-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
          >
            <i data-lucide="info" className="w-3.5 h-3.5 text-slate-400"></i>
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={() => onOrderNow(product)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-md shadow-brand-800/20 transition-all transform active:scale-95"
          >
            <i data-lucide="shopping-bag" className="w-3.5 h-3.5"></i>
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.ProductCard = ProductCard;
}

if (typeof exports !== "undefined") {
  exports.ProductCard = ProductCard;
}
