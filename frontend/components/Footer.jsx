/**
 * Health Nutra - Footer Component
 * Matching the exact forest green branded design mockup.
 */

function Footer() {
  const [legalModal, setLegalModal] = React.useState(null);

  return (
    <footer id="contact-footer" className="bg-[#166534] text-white pt-14 pb-8 border-t-2 border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid (Matching Mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-emerald-700/60">
          
          {/* Column 1: Brand, Tagline & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <img
                  src={(typeof window !== "undefined" && window?.apiHelper?.config?.brand?.logoUrl) || "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg"}
                  alt="Health Nutra"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                  }}
                />
                <Icon name="leaf" className="w-5 h-5 text-[#166534] hidden" />
              </div>
              <div className="text-2xl font-black tracking-tight leading-none">
                <span className="text-white">HEALTH</span>{" "}
                <span className="text-[#F97316]">NUTRA</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed max-w-sm">
              Nurturing Health, Enriching Life.<br />
              Premium Nutraceutical Products<br />
              for a Better Tomorrow.
            </p>

            {/* Social Media Icons (Circular White Pills with Dark Green Icons) */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#166534] flex items-center justify-center hover:bg-emerald-100 transition-transform transform hover:scale-105 shadow-xs"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#166534] flex items-center justify-center hover:bg-emerald-100 transition-transform transform hover:scale-105 shadow-xs"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#166534] flex items-center justify-center hover:bg-emerald-100 transition-transform transform hover:scale-105 shadow-xs"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 font-medium">
              <li>
                <a href="/" className="hover:text-amber-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-amber-300 transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about-us" className="hover:text-amber-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/about-us#leadership" className="hover:text-amber-300 transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/contact-us" className="hover:text-amber-300 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: PRODUCTS */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              PRODUCTS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 font-medium">
              <li>
                <a href="/products?category=Multivitamin" className="hover:text-amber-300 transition-colors">
                  Multivitamin
                </a>
              </li>
              <li>
                <a href="/products?category=Omega-3" className="hover:text-amber-300 transition-colors">
                  Omega-3
                </a>
              </li>
              <li>
                <a href="/products?category=Green Tea" className="hover:text-amber-300 transition-colors">
                  Green Tea
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-amber-300 transition-colors">
                  All Products
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT US */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              CONTACT US
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-emerald-100 font-medium">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-white shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C7.589 0 4 3.589 4 8c0 4.282 7.025 15.344 7.332 15.823a.8.8 0 0 0 1.336 0C12.975 23.344 20 12.282 20 8c0-4.289-3.589-8-8-8zm0 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
                  </svg>
                </div>
                <span className="leading-snug">
                  Shop No/ Plot No.: 247, SLICE-2, SECTOR-A,<br />
                  SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="text-white shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V9.044l7.445 4.963a1.002 1.002 0 0 0 1.11 0L20 9.044 20.002 18H4z" />
                  </svg>
                </div>
                <a
                  href="mailto:healthnutra16@gmail.com"
                  className="hover:text-amber-300 transition-colors"
                >
                  healthnutra16@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="text-white shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z" />
                  </svg>
                </div>
                <a
                  href="tel:+917024308660"
                  className="hover:text-amber-300 transition-colors font-bold"
                >
                  +91 7024308660
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Subtle Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/90 font-medium">
          <div>
            © {new Date().getFullYear()} HEALTH NUTRA™. All rights reserved. • Developed by{" "}
            <a
              href="https://sandeep-kumar-mehta.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-amber-300 font-bold transition-colors"
            >
              Sandeep Mehta
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Supply
            </button>
            <span>•</span>
            <a
              href="/admin"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
              title="Admin Console"
            >
              <Icon name="lock" className="w-3 h-3" />
              <span>Admin</span>
            </a>
          </div>
        </div>

      </div>

      {/* Interactive Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 text-slate-800">
          <div
            className="fixed inset-0"
            onClick={() => setLegalModal(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[85vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon name={legalModal === "privacy" ? "shield-check" : "file-text"} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {legalModal === "privacy" ? "Health Nutra Privacy Policy" : "Terms & Conditions of Supply"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Certified Compliance • Indore, Madhya Pradesh
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
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">1. Genuine Formulation Guarantee</h4>
                    <p>All nutraceuticals and dietary supplements supplied through Health Nutra are manufactured in WHO-GMP certified facilities with verified batch test numbers and tamper-evident seals.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">2. Orders & Doorstep Delivery</h4>
                    <p>Orders are dispatched within 24 to 48 business hours. Live courier tracking is provided through our online tracking system. Cash on Delivery (COD) is supported.</p>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">3. Medical Disclaimer</h4>
                    <p>Dietary supplements are intended for nutritional maintenance and general wellness. Please consult a qualified healthcare practitioner for specific medical conditions.</p>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#166534] hover:bg-[#14532d] transition-colors"
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

if (typeof window !== "undefined") {
  window.Footer = Footer;
}

if (typeof exports !== "undefined") {
  exports.Footer = Footer;
}
