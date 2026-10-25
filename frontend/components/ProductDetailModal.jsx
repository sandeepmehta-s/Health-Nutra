/**
 * Health Nutra - ProductDetailModal Component
 * Full composition, indications, and clinical specifications modal.
 */

function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onOrderProduct,
}) {
  if (!isOpen || !product) return null;

  const dummyFallback = React.useMemo(() => {
    const n = (product?.name || "").toLowerCase();
    const c = (product?.category || "").toLowerCase();
    if (n.includes("9g") || c.includes("multivitamin")) return "/images/9g.png";
    if (n.includes("10q") || c.includes("syrup")) return "/images/10q.png";
    if (n.includes("omega") || c.includes("omega")) return "/images/omega3.png";
    if (n.includes("tea") || c.includes("green")) return "/images/greentea.png";
    return "/images/10q.png";
  }, [product?.name, product?.category]);

  const imageSrc = product?.image
    ? product.image.startsWith("http") || product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : dummyFallback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-xs">
              <Icon name="pill" className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-100 text-brand-800">
                  {product.category || "General"}
                </span>
                <span className="text-xs text-slate-400 font-bold">Ref: HN-{product.id || "00"}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual */}
            <div className="md:col-span-5 h-56 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
              <img
                src={imageSrc}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/10q.png";
                }}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Quick Details */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-black text-[#166534]">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-sm font-semibold text-slate-400 line-through">₹{product.mrp}</span>
                )}
                {product.mrp && product.mrp > product.price && (
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-500">per {product.unit || "Unit"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Clinical Indication</div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {product.shortDescription || "Evidence-based daily nutritional supplementation."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="font-black text-emerald-900">Standard Lab</div>
                  <div className="text-emerald-700 text-[11px]">WHO-GMP Grade</div>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100">
                  <div className="font-black text-orange-900">Availability</div>
                  <div className="text-orange-700 text-[11px]">Direct Order Ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Composition & Benefits Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Icon name="file-text" className="w-4 h-4 text-brand-700" />
              <span>Active Composition & Clinical Benefits</span>
            </h4>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {product.fullDescription || product.shortDescription || "No detailed breakdown provided."}
            </div>
          </div>

          {/* Storage & Usage Guidelines */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
            <Icon name="info" className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-0.5">
              <div className="font-bold">Usage Guidance</div>
              <p>Store in a cool, dry place away from direct sunlight. To be consumed under qualified medical or dietary supervision.</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOrderProduct(product);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-md shadow-brand-800/20 transition-all"
          >
            <Icon name="shopping-bag" className="w-4 h-4" />
            <span>Order This Formulation</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.ProductDetailModal = ProductDetailModal;
}

if (typeof exports !== "undefined") {
  exports.ProductDetailModal = ProductDetailModal;
}

