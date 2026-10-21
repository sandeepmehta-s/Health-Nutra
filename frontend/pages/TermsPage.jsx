/**
 * Health Nutra - Dedicated Terms and Conditions Page
 * Dedicated page at /terms-and-conditions matching About Us design standards.
 * Compliant with Consumer Protection (E-Commerce) Rules, 2020 & Indian Contract Act, 1872.
 */

function TermsPage() {
  const [trackModalOpen, setTrackModalOpen] = React.useState(false);
  const [trackOrderId, setTrackOrderId] = React.useState("");

  const handleOpenTrackModal = (id = "") => {
    setTrackOrderId(id);
    setTrackModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Breadcrumb Header */}
      <div className="bg-emerald-900/5 border-b border-emerald-900/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <a href="/" className="hover:text-[#166534] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#166534] font-bold">Terms & Conditions</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        
        {/* ========================================================= */}
        {/* TOP SECTION: HEADING & TRUST BADGES (Matching About Us) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              <span className="text-[#166534]">TERMS & </span>
              <span className="text-[#F97316]">CONDITIONS</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              These terms govern the ordering, delivery, and supply of Health Nutra™ certified nutraceutical formulations across India.
            </p>

            <div className="pt-1 text-xs text-slate-500 font-medium">
              Effective Date: October 2026 • Commercial Terms of Supply
            </div>
          </div>

          {/* Right Feature Badges Box (4 Columns matching About Us) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 text-center">
              
              {/* WHO-GMP */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="award" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  WHO-GMP<br />Certified
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Manufactured in certified cleanroom facilities.
                </p>
              </div>

              {/* Insured Dispatch */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="truck" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Insured<br />Transit
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Protected tamper-proof clinical packaging.
                </p>
              </div>

              {/* Tax Invoice */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="file-check" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Official<br />Tax Invoice
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Instant PDF tax receipt with every order.
                </p>
              </div>

              {/* Consumer Protection */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="scale" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Fair Trade<br />Compliant
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Conforms to Consumer Protection Rules 2020.
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* DETAILED TERMS SECTIONS IN CLEAN CARDS */}
        {/* ========================================================= */}
        <div className="space-y-8">
          
          {/* Section 1: Commercial Acceptance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              1. Commercial Acceptance & Operating Entity
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              By placing an order through healthnutra.co.in or requesting bulk clinical supplies, you agree to these commercial terms established by <strong>HEALTH NUTRA™</strong>, having its central distribution headquarters at <em>Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)</em>.
            </p>
          </div>

          {/* Section 2: Health & Formulation Disclaimer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              2. Product Quality & Health Disclaimer
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Health Nutra formulations (including 9G Tablets, 10Q Syrup, Omega-3 Softgels, and Green Tea Botanical Extract) are manufactured in strict compliance with WHO-GMP and ISO 9001:2015 quality standards. These products are certified dietary nutraceuticals intended to support daily nutrition and vitality. They are not intended to substitute professional medical diagnosis, prescription medicines, or clinical surgical interventions.
            </p>
          </div>

          {/* Section 3: Pricing & Tax Invoicing */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              3. Pricing, Invoicing & Free Delivery
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium pl-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>All prices on our storefront are quoted in Indian Rupees (₹ INR) and include all applicable Central and State Goods & Services Taxes (GST).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>An official computerized Tax Invoice with a unique Order Reference is generated automatically and delivered both to your email and accessible via our live tracking portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Free delivery is provided on retail orders meeting qualifying threshold amounts without any surprise handling surcharges.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Cash on Delivery Terms */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              4. Cash on Delivery (COD) Terms
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              For Cash on Delivery orders, payment is due in full at the time of package delivery to the authorized logistics courier agent. Packages must not be opened or unsealed before payment is rendered. In the event of repeated non-acceptance of verified COD dispatches, we reserve the right to restrict future COD privileges to that delivery address.
            </p>
          </div>

          {/* Section 5: Replacement & Damage Cover */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              5. 7-Day Replacement & Transit Damage Cover
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              If your formulation arrives with damaged outer seals, cracked bottles, or incorrect items, you are entitled to a <strong>free replacement</strong>. Simply notify our customer support team at <a href="mailto:healthnutra16@gmail.com" className="text-[#166534] font-bold hover:underline">healthnutra16@gmail.com</a> or <a href="tel:+917024308660" className="text-[#166534] font-bold hover:underline">+91 7024308660</a> within 7 calendar days of delivery with your Order ID and photo of the package.
            </p>
          </div>

          {/* Section 6: Jurisdiction */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              6. Governing Law & Judicial Jurisdiction
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              These terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with the supply of formulations shall be subject to the exclusive jurisdiction of the competent civil courts situated at <strong>Indore, Madhya Pradesh</strong>.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialOrderId={trackOrderId}
      />

    </div>
  );
}

if (typeof window !== "undefined") {
  window.TermsPage = TermsPage;
}
if (typeof exports !== "undefined") {
  exports.TermsPage = TermsPage;
}
