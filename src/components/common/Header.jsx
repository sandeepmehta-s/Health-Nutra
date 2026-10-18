import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, PhoneCall, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../../context/CartContext";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/#about" },
  { label: "Our Team", to: "/#team" },
  { label: "Contact Us", to: "/#contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  const isItemActive = (to) => {
    if (to === "/") return location.pathname === "/" && !location.hash;
    if (to.startsWith("/#")) return location.pathname === "/" && location.hash === to.substring(1);
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Top micro bar */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-900 px-4 py-1.5 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-300" />
            <span className="hidden sm:inline">100% Certified Nutraceuticals & Premium Quality Formulations</span>
            <span className="sm:hidden">Certified Premium Health Supplements</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-white">
              <PhoneCall size={12} />
              <span className="hidden md:inline">+91 98765 43210</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <Link to="/admin" className="hover:text-white text-[11px] opacity-80 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 font-medium text-gray-700 lg:flex">
            {NAV.map((item) => {
              const active = isItemActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-green-50 text-green-800 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="group flex items-center gap-2.5 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-900 transition-all hover:bg-green-100 hover:shadow-sm"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={19} className="text-green-800 transition-transform group-hover:scale-110" />
                {count > 0 && (
                  <span className="absolute -right-2.5 -top-2 grid h-4 w-4 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-xs">
                    {count}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-xs text-orange-700">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Navigation Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <nav className="border-t border-gray-100 bg-white px-4 py-3 shadow-lg lg:hidden">
            <div className="space-y-1">
              {NAV.map((item) => {
                const active = isItemActive(item.to);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active ? "bg-green-50 text-green-800" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-100 pt-2">
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
