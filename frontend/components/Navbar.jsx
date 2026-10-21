/**
 * Health Nutra - Navbar Component
 * Navigation bar with brand identity, mobile drawer, and portal links.
 */

function Navbar({ onOpenSearch, onOpenTrackOrder, orderCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Products", href: "#products", hasDropdown: true },
    { label: "About Us", href: "#about" },
    { label: "Our Team", href: "#team" },
    { label: "Contact Us", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo (Circular Emblem + Clean Bold Wordmark) */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full border border-amber-400/80 shadow-xs flex items-center justify-center overflow-hidden bg-white group-hover:scale-105 transition-transform">
              <img
                src={(typeof window !== "undefined" && window?.apiHelper?.config?.brand?.logoUrl) || "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg"}
                alt="Health Nutra"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                }}
              />
              <Icon name="leaf" className="w-6 h-6 text-emerald-700 hidden" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
              <span className="text-[#166534]">HEALTH</span>{" "}
              <span className="text-[#F97316]">NUTRA</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-[#166534] transition-colors"
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Track Order Pill */}
            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-[#166534] hover:bg-emerald-50/70 border border-slate-200 transition-colors"
              title="Track Live Order"
            >
              <Icon name="truck" className="w-4 h-4 text-[#166534]" />
              <span className="hidden md:inline">Track Order</span>
            </button>

            {/* Orange Enquiry Now Button */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] shadow-sm shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Enquiry Now</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </a>

            {/* Discreet Admin Lock */}
            <a
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
              title="Admin Portal"
            >
              <Icon name="lock" className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#contact"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F97316] flex items-center gap-1 shadow-xs"
            >
              <span>Enquiry</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
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
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
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
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
            >
              <Icon name="lock" className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </a>
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
