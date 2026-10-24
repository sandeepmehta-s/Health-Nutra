/**
 * Health Nutra - ProductCard Component
 * Displays individual product card with direct navigation to dedicated Product Detail Page.
 */

function ProductCard({
  product,
  isTopMatch = false,
  onViewDetails,
  onOrderNow,
}) {
  const [imageError, setImageError] = React.useState(false);

  // Smart image resolver mapping to real available images
  const dummyFallback = React.useMemo(() => {
    const n = (product.name || "").toLowerCase();
    const c = (product.category || "").toLowerCase();
    if (n.includes("9g")) return "/images/9g.png";
    if (n.includes("q10") || n.includes("10q")) return "/images/10q.png";
    if (n.includes("liv+")) return "/images/livplus.jpeg";
    if (n.includes("naria+")) return "/images/naria-plus.jpeg";
    if (n.includes("lipron+")) return "/images/lipron-plus.jpeg";
    if (n.includes("omega")) return "/images/omega3.png";
    if (n.includes("tea") || c.includes("green")) return "/images/greentea.png";
    return "/images/10q.png";
  }, [product.name, product.category]);

  const imageSrc = React.useMemo(() => {
    if (!product.image) return dummyFallback;
    if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
      return product.image;
    }
    if (product.image.startsWith("/")) {
      return product.image;
    }
    return `/${product.image}`;
  }, [product.image, dummyFallback]);

  const productUrl = React.useMemo(() => {
    const n = (product?.name || "").toLowerCase();
    const c = (product?.category || "").toLowerCase();
    if (n.includes("liv+")) return "/liv-plus";
    if (n.includes("naria+")) return "/naria-plus";
    if (n.includes("lipron+")) return "/lipron-plus";
    if (n.includes("q10+") || n.includes("10q")) return "/q10-plus";
    if (n.includes("omega") || c.includes("omega")) return "/omega";
    if (n.includes("9g")) return "/9g";
    if (n.includes("10q") || c.includes("syrup")) return "/10q";
    if (n.includes("tea") || c.includes("green")) return "/green-tea";
    return `/product/${product?.id || "omega"}`;
  }, [product]);

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      window.location.href = productUrl;
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between text-center p-5 sm:p-6 overflow-hidden ${
        isTopMatch
          ? "border-amber-400 ring-2 ring-amber-400/30 shadow-md -translate-y-0.5"
          : "border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Product Image Area */}
      <a
        href={productUrl}
        onClick={(e) => {
          e.preventDefault();
          handleCardClick();
        }}
        className="relative h-44 sm:h-48 w-full flex items-center justify-center p-2 mb-4 bg-white cursor-pointer"
      >
        <img
          src={imageError ? dummyFallback : imageSrc}
          alt={product.name}
          onError={() => {
            if (!imageError) setImageError(true);
          }}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </a>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Product Title */}
          <a
            href={productUrl}
            onClick={(e) => {
              e.preventDefault();
              handleCardClick();
            }}
            className="block cursor-pointer"
          >
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#166534] transition-colors leading-snug">
              {product.name}
            </h3>
          </a>

          {/* Benefit Description */}
          <p className="text-xs text-slate-500 font-medium mt-1.5 mb-3 line-clamp-2 min-h-[32px] leading-relaxed">
            {product.shortDescription || product.fullDescription || "Clinical wellness dietary formulation."}
          </p>
        </div>

        {/* Price & Unit */}
        <div className="my-2">
          {product.pricePending ? (
            <span className="text-sm font-bold text-amber-700">Price pending</span>
          ) : (
            <>
              <span className="text-lg font-black text-[#166534]">₹{product.price}</span>
              <span className="text-xs font-normal text-slate-500 ml-1">/ {product.unit || "Unit"}</span>
            </>
          )}
        </div>

        {/* View Details Action Button */}
        <div className="mt-3">
          <a
            href={productUrl}
            onClick={(e) => {
              e.preventDefault();
              handleCardClick();
            }}
            className="block w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-xs hover:shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  window.ProductCard = ProductCard;
}
if (typeof exports !== "undefined") {
  exports.ProductCard = ProductCard;
}
