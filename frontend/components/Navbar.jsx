/**
 * Health Nutra - Navbar Component
 * Navigation bar with brand identity, mobile drawer, and portal links.
 */

function Navbar({ onOpenSearch, onOpenTrackOrder, orderCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState(null);

  React.useEffect(() => {
    // Check admin session
    if (window.apiHelper) {
      window.apiHelper.checkAdminAuth().then((data) => {
        if (data && data.success && data.admin) {
          setAdminUser(data.admin);
        }
      });
    }
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero", icon: "home" },
    { label: "Products Catalog", href: "#products", icon: "pill" },
    { label: "Quality & GMP", href: "#about", icon: "shield-check" },
    { label: "Contact Us", href: "#contact", icon: "phone" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-700 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-brand-700/25 group-hover:scale-105 transition-transform">
              <i data-lucide="leaf" className="w-6 h-6"></i>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                HEALTH <span className="text-accent-600">NUTRA</span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">
                Nurturing Health, Enriching Life
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold text-slate-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
              >
                <i data-lucide={item.icon} className="w-4 h-4 text-emerald-600"></i>
                <span>{item.label}</span>
              </a>
            ))}

            {/* Track Order Button */}
            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-800 border border-slate-200 transition-colors"
            >
              <i data-lucide="truck" className="w-4 h-4 text-brand-700"></i>
              <span>Track Order</span>
            </button>

            {/* Admin Portal Pill */}
            <a
              href="/admin"
              className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs lg:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/25 transition-all transform hover:-translate-y-0.5"
            >
              {adminUser ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <i data-lucide="shield-check" className="w-4 h-4"></i>
                  <span>Admin ({adminUser.username})</span>
                </>
              ) : (
                <>
                  <i data-lucide="lock" className="w-4 h-4"></i>
                  <span>Admin Portal</span>
                </>
              )}
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/admin"
              className="p-2 rounded-xl bg-orange-50 text-orange-700 font-bold text-xs flex items-center gap-1 border border-orange-200"
            >
              <i data-lucide="lock" className="w-4 h-4"></i>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <i data-lucide={mobileMenuOpen ? "x" : "menu"} className="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl text-sm font-bold text-slate-700 hover:text-brand-800 hover:bg-brand-50 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-brand-700">
                <i data-lucide={item.icon} className="w-4 h-4"></i>
              </div>
              <span>{item.label}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTrackOrder) onOpenTrackOrder();
            }}
            className="flex items-center gap-3 w-full p-3 rounded-2xl text-sm font-bold text-slate-700 hover:text-brand-800 hover:bg-brand-50 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-brand-700">
              <i data-lucide="truck" className="w-4 h-4"></i>
            </div>
            <span>Track Order Status</span>
          </button>

          <a
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between w-full p-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md shadow-orange-600/20 mt-3"
          >
            <span className="flex items-center gap-2">
              <i data-lucide="lock" className="w-4 h-4"></i>
              <span>{adminUser ? `Admin Dashboard (${adminUser.username})` : "Admin Portal Access"}</span>
            </span>
            <i data-lucide="arrow-right" className="w-4 h-4"></i>
          </a>
        </div>
      )}
    </header>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Navbar = Navbar;
}

if (typeof exports !== "undefined") {
  exports.Navbar = Navbar;
}

