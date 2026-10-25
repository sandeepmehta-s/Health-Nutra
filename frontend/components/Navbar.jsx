/**
 * Health Nutra - Navbar Component
 * Navigation bar with brand identity, Home & Products links,
 * Track Order, Enquiry Now, and Search bar on the right side of Enquiry.
 * (About Us and Contact Us are kept in the Footer only as requested).
 */

function Navbar({ onOpenSearch, onOpenTrackOrder, orderCount = 0, initialSearchQuery = "", onSearchQueryChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState(initialSearchQuery || "");

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchVal(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Navbar contains Home and Products only (About Us & Contact Us are in Footer only)
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchVal.trim();
    if ((window.location.pathname === "/products" || window.location.pathname === "/") && onSearchQueryChange) {
      onSearchQueryChange(query);
    } else {
      window.location.href = query ? `/products?search=${encodeURIComponent(query)}` : "/products";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          
          {/* Brand Logo (Circular Emblem + Clean Bold Wordmark) */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-amber-400/80 shadow-xs flex items-center justify-center overflow-hidden bg-white group-hover:scale-105 transition-transform">
              <img
                src="/images/logo-circle.png"
                alt="Health Nutra"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                }}
              />
              <Icon name="leaf" className="w-5 h-5 text-emerald-700 hidden" />
            </div>
            <div className="text-lg sm:text-2xl font-black tracking-tight leading-none">
              <span className="text-[#166534]">HEALTH</span>{" "}
              <span className="text-[#F97316]">NUTRA</span>
            </div>
          </a>

          {/* Desktop Navigation Links (Home & Products only) */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-8 shrink-0">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-[#166534] transition-colors"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Group: Track Order -> Enquiry Now -> Search (Search is on right side of Enquiry) */}
          <div className="hidden sm:flex items-center gap-2.5 lg:gap-3 shrink-0">
            {/* Track Order Button */}
            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#166534] hover:bg-emerald-50/70 border border-slate-200 transition-colors cursor-pointer"
              title="Track Live Order"
            >
              <Icon name="truck" className="w-4 h-4 text-[#166534]" />
              <span className="hidden lg:inline">Track Order</span>
            </button>

            {/* Orange Enquiry Now Button */}
            <a
              href="#contact"
              onClick={(e) => {
                const el = document.getElementById("contact");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] shadow-xs shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
            >
              <span>Enquiry Now</span>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </a>

            {/* Search Bar (On the RIGHT side of Enquiry Now) */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-44 md:w-48 lg:w-56 shrink-0"
            >
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  if (onSearchQueryChange && (window.location.pathname === "/products" || window.location.pathname === "/")) {
                    onSearchQueryChange(e.target.value);
                  }
                }}
                placeholder="Search formulations..."
                className="w-full pl-8 pr-7 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute left-2.5 text-slate-400 hover:text-[#166534] transition-colors"
                title="Search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal("");
                    if (onSearchQueryChange && (window.location.pathname === "/products" || window.location.pathname === "/")) {
                      onSearchQueryChange("");
                    }
                  }}
                  className="absolute right-2.5 w-3.5 h-3.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[9px] font-bold"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex sm:hidden items-center gap-1.5">
            <a
              href="#contact"
              onClick={(e) => {
                const el = document.getElementById("contact");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F97316] flex items-center gap-1 shadow-xs"
            >
              <span>Enquiry</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search formulations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#166534] outline-none"
            />
            <button type="submit" className="absolute left-2.5 top-2.5 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#166534]"
            >
              {item.label}
            </a>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <Icon name="truck" className="w-4 h-4 text-[#166534]" />
              <span>Track Live Order</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

if (typeof window !== "undefined") {
  window.Navbar = Navbar;
}
if (typeof exports !== "undefined") {
  exports.Navbar = Navbar;
}
