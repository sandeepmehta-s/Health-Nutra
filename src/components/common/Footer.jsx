import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ShieldCheck, Award, Heart } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-green-900 bg-gradient-to-b from-green-950 via-green-900 to-green-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light />
            <p className="max-w-sm text-xs leading-relaxed text-emerald-100/80">
              Health Nutra is dedicated to improving daily vitality and long-term wellness through certified nutraceutical formulations, pure botanical extracts, and science-backed ingredients.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-300">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-xs">
                <ShieldCheck size={14} className="text-orange-400" /> GMP Certified
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-xs">
                <Award size={14} className="text-orange-400" /> 100% Quality Formulated
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Quick Links</h4>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><a href="/#about" className="hover:text-white transition-colors">About Health Nutra</a></li>
              <li><a href="/#team" className="hover:text-white transition-colors">Our Leadership</a></li>
              <li><a href="/#contact" className="hover:text-white transition-colors">Enquiry & Support</a></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Featured Range</h4>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li><Link to="/products/1" className="hover:text-white transition-colors">Health Nutra 9G Tablets</Link></li>
              <li><Link to="/products/2" className="hover:text-white transition-colors">Health Nutra 10Q Syrup</Link></li>
              <li><Link to="/products/3" className="hover:text-white transition-colors">Omega-3 Softgels</Link></li>
              <li><Link to="/products/4" className="hover:text-white transition-colors">Green Tea Extract</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <p className="flex items-start gap-2.5">
                <MapPin size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <span>123, Health Nutra House, Lucknow - 226001, UP, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-orange-400 shrink-0" />
                <a href="mailto:healthnutra16@gmail.com" className="hover:text-white transition-colors">
                  healthnutra16@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-orange-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-block text-[11px] text-emerald-300 hover:text-white underline"
                >
                  Admin Management
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 py-4 text-center text-xs text-emerald-200/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Health Nutra. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Formulated with <Heart size={12} className="fill-orange-500 text-orange-500" /> for your wellness.
          </p>
        </div>
      </div>
    </footer>
  );
}
