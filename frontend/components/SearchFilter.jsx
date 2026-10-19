/**
 * Health Nutra - Search & Category Filter Component
 * Features Search Optimization with instant clear, top-match indicator, and category pills.
 */

function SearchFilter({
  searchQuery,
  onSearchChange,
  onClearSearch,
  categories = ["All"],
  selectedCategory = "All",
  onSelectCategory,
  totalResults = 0,
}) {
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

  return (
    <div className="space-y-6">
      
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-brand-700">
            <i data-lucide="search" className="w-5 h-5"></i>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search formulations (e.g. 9G, 10Q, Green Tea, Omega, Multivitamin)..."
            className="w-full pl-13 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 shadow-sm transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Clear search"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                <i data-lucide="x" className="w-4 h-4"></i>
              </div>
            </button>
          )}
        </div>

        {/* Live Search Optimization Feedback Badge */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-2.5 flex items-center justify-between px-2 text-xs">
            <div className="inline-flex items-center gap-1.5 font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200/60">
              <i data-lucide="sparkles" className="w-3.5 h-3.5 text-accent-600"></i>
              <span>Relevance Optimized: Top matching formulation placed at the <strong>TOP</strong></span>
            </div>
            <span className="font-extrabold text-slate-500">
              {totalResults} {totalResults === 1 ? "result" : "results"}
            </span>
          </div>
        )}
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          const iconName = categoryIcons[cat] || "pill";

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-brand-700 text-white shadow-md shadow-brand-700/25 scale-105"
                  : "bg-white text-slate-600 hover:text-brand-800 hover:bg-brand-50 border border-slate-200"
              }`}
            >
              <i data-lucide={iconName} className={`w-4 h-4 ${isSelected ? "text-emerald-200" : "text-brand-700"}`}></i>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.SearchFilter = SearchFilter;
}

if (typeof exports !== "undefined") {
  exports.SearchFilter = SearchFilter;
}
