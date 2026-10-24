/**
 * Health Nutra - Category Filter Component
 * Clean category pill navigation matching the official brand mockup.
 */

function SearchFilter({
  categories = ["All", "Multivitamin"],
  selectedCategory = "All",
  onSelectCategory,
}) {
  const displayCategories = categories;

  return (
    <div className="py-2">
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
    </div>
  );
}

if (typeof window !== "undefined") {
  window.SearchFilter = SearchFilter;
}
if (typeof exports !== "undefined") {
  exports.SearchFilter = SearchFilter;
}
