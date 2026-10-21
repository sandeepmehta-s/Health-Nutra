/**
 * Health Nutra - Footer Component
 * Enterprise footer with quality standards, quick navigation, and legal credentials.
 */

function Footer() {
  const [legalModal, setLegalModal] = React.useState(null); // 'privacy' | 'terms' | null

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-700 p-1 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={(typeof window !== "undefined" && window?.apiHelper?.config?.brand?.logoUrl) || "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg"}
                  alt="Health Nutra"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                  }}
                />
                <Icon name="leaf" className="w-5 h-5 text-brand-700 hidden" />
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
              <li><a href="/admin" className="hover:text-orange-400 transition-colors flex items-center gap-1.5"><Icon name="lock" className="w-3 h-3" /> Admin Portal</a></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2.5">
                <Icon name="phone" className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+917024308660" className="hover:text-emerald-400 transition-colors">+91-7024308660</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="mail" className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:healthnutra16@gmail.com" className="hover:text-emerald-400 transition-colors">healthnutra16@gmail.com</a>
              </div>
              <div className="flex items-start gap-2.5">
                <Icon name="map-pin" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Shop No/ Plot No.: 247, SLICE-2,<br />
                  SECTOR-A, SCHEME NO 78,<br />
                  INDORE - 452010 Dist.-INDORE (M.P.)
                </span>
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
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="hover:text-slate-300 transition-colors cursor-pointer text-xs focus:outline-none"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="hover:text-slate-300 transition-colors cursor-pointer text-xs focus:outline-none"
            >
              Terms of Supply
            </button>
            <span>•</span>
            <a href="#about" className="hover:text-slate-300 transition-colors text-xs">
              About Us
            </a>
          </div>
        </div>

      </div>

      {/* Interactive Legal Modal (Privacy Policy & Terms of Supply) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setLegalModal(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                  <Icon name={legalModal === "privacy" ? "shield-check" : "file-text"} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {legalModal === "privacy" ? "Health Nutra Privacy Policy" : "Terms & Conditions of Supply"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Last updated: October 2026 • Certified Compliance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {legalModal === "privacy" ? (
                <>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">1. Information We Collect</h4>
                    <p>When you place an order or submit a clinical inquiry, we collect necessary shipping and contact details (name, delivery address, phone number, email) strictly to fulfill your formulation shipments and provide dispatch tracking notifications.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">2. Zero Third-Party Sharing</h4>
                    <p>Health Nutra does not sell, rent, or lease customer data. Your information is only shared with certified courier partners solely for doorstep delivery and verification.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">3. Clinical Confidentiality & Security</h4>
                    <p>All transactions and orders are transmitted over 256-bit encrypted SSL/TLS channels. Internal database access is strictly restricted with salted cryptographic hashing.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">4. Your Rights</h4>
                    <p>You may request modification or deletion of your customer dispatch record at any time by contacting our support team at care@healthnutra.com.</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">1. Genuine Formulation Guarantee</h4>
                    <p>All nutraceuticals and dietary supplements supplied through Health Nutra are manufactured in WHO-GMP certified facilities with verified batch test numbers and tamper-evident seals.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">2. Orders & Doorstep Delivery</h4>
                    <p>Orders are dispatched within 24 to 48 business hours. Live courier tracking is provided through our online tracking system. Cash on Delivery (COD) and Online UPI payments are supported.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">3. Damaged or Tampered Shipments</h4>
                    <p>If your package appears damaged or opened at delivery, please reject the consignment or notify us within 48 hours for an immediate complimentary replacement shipment.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">4. Medical Disclaimer</h4>
                    <p>Dietary supplements are intended for nutritional maintenance and general wellness. Please consult a qualified healthcare practitioner for specific medical conditions.</p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-700 hover:bg-brand-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
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

