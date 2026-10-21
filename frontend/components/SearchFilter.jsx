/**
 * Health Nutra - Search & Category Filter Component
 * Matches the clean category pill navigation from the official mockup.
 */

function SearchFilter({
  searchQuery,
  onSearchChange,
  onClearSearch,
  categories = ["All", "Multivitamin", "Omega-3", "Green Tea"],
  selectedCategory = "All",
  onSelectCategory,
  totalResults = 0,
}) {
  const displayCategories = React.useMemo(() => {
    // Filter out internal/empty categories and ensure canonical 4 pills
    const target = ["All", "Multivitamin", "Omega-3", "Green Tea"];
    return target;
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Category Pills Bar (Centered) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
                isSelected
                  ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:border-[#166534] hover:text-[#166534]"
              }`}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Subtle Search Input */}
      <div className="relative max-w-md mx-auto pt-2">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Icon name="search" className="w-4 h-4 text-emerald-800" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search formulations (e.g. 9G, 10Q, Omega, Green Tea)..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-500/15 shadow-xs transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Clear search"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchQuery.trim().length > 0 && (
          <div className="mt-2 text-center text-xs font-bold text-[#166534]">
            Showing results for "{searchQuery}" ({totalResults} found)
          </div>
        )}
      </div>

    </div>
  );
}

if (typeof window !== "undefined") {
  window.SearchFilter = SearchFilter;
}
if (typeof exports !== "undefined") {
  exports.SearchFilter = SearchFilter;
}
