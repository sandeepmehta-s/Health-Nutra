/**
 * Health Nutra - Footer Component
 * Enterprise footer with quality standards, quick navigation, and legal credentials.
 */

function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-700/30">
                <i data-lucide="leaf" className="w-5 h-5"></i>
              </div>
              <span className="text-xl font-black tracking-tight">
                HEALTH <span className="text-accent-500">NUTRA</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Health Nutra is dedicated to elevating life quality through evidence-based dietary supplements, manufactured in certified state-of-the-art pharmaceutical facilities.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-800 text-emerald-400 border border-slate-700">
                WHO-GMP COMPLIANT
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-800 text-emerald-400 border border-slate-700">
                ISO 9001:2015
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-800 text-amber-400 border border-slate-700">
                BATCH PURITY TESTED
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Formulations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold">
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Multivitamins</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Omega-3 Fatty Acids</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Green Tea Extract</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Syrups & Tonics</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Ayurvedic Formulations</a></li>
            </ul>
          </div>

          {/* Quality & Corporate */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold">
              <li><a href="#hero" className="hover:text-emerald-400 transition-colors">Home Showcase</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Product Catalog</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">Quality Standard</a></li>
              <li><a href="/admin" className="hover:text-orange-400 transition-colors flex items-center gap-1.5"><i data-lucide="lock" className="w-3 h-3"></i> Admin Portal</a></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2.5">
                <i data-lucide="phone" className="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i data-lucide="mail" className="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>care@healthnutra.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <i data-lucide="map-pin" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
                <span>Industrial Area Phase II, Pharmaceutical Zone, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Health Nutra Pharmaceuticals. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Supply</span>
            <span>•</span>
            <a href="/admin" className="text-orange-400 hover:text-orange-300 transition-colors font-bold">
              Authorized Admin
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Footer = Footer;
}

if (typeof exports !== "undefined") {
  exports.Footer = Footer;
}
