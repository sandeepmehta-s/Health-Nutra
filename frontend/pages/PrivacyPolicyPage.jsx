/**
 * Health Nutra - Dedicated Privacy Policy Page
 * Dedicated page at /privacy-policy matching About Us design standards.
 * Compliant with Indian Information Technology Act, 2000 & SPDI Rules.
 */

function PrivacyPolicyPage() {
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
          <span className="text-[#166534] font-bold">Privacy Policy</span>
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
              <span className="text-[#166534]">PRIVACY </span>
              <span className="text-[#F97316]">POLICY</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At Health Nutra™, we respect your personal privacy and are committed to safeguarding the clinical, contact, and transactional information you share with us.
            </p>

            <div className="pt-1 text-xs text-slate-500 font-medium">
              Last Updated & Effective Date: October 2026 • Indore, Madhya Pradesh
            </div>
          </div>

          {/* Right Feature Badges Box (4 Columns matching About Us) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 text-center">
              
              {/* Encrypted Storage */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="shield-check" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Data<br />Encrypted
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  TLS 1.3 in-transit and AES-256 at-rest protection.
                </p>
              </div>

              {/* Zero Third-Party Sale */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="lock" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Never<br />Sold
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  We never monetize or rent customer contact records.
                </p>
              </div>

              {/* Regulatory Compliance */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="file-text" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  IT Act<br />Compliant
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Conforms with Indian SPDI and e-commerce rules.
                </p>
              </div>

              {/* Direct Support */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="users" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Grievance<br />Officer
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Dedicated redressed support at our Indore facility.
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* DETAILED LEGAL SECTIONS IN CLEAN STRUCTURED CARDS */}
        {/* ========================================================= */}
        <div className="space-y-8">
          
          {/* Section 1: Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              1. Operating Identity & Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              This Privacy Policy applies to the official e-commerce storefront and digital inquiry systems of <strong>HEALTH NUTRA™</strong>, operating from registered facilities at <em>Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)</em>. By accessing healthnutra.co.in or placing orders for our clinical dietary formulations, you acknowledge the data handling practices described herein.
            </p>
          </div>

          {/* Section 2: What We Collect */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              2. Information We Collect
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              We collect information that is strictly necessary to fulfill your orders, provide dispatch notifications, and address product inquiries:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium pl-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>Order & Shipping Information:</strong> Recipient name, full delivery address with postal pincode, mobile phone number, and selected payment mode (Cash on Delivery).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>Inquiry & Clinical Queries:</strong> Name, clinic/hospital designation (if provided), email address, and specific questions submitted through our contact forms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>Technical Log Data:</strong> Timestamp of request, order reference identifiers, and transactional confirmation emails generated through Brevo (Sendinblue).</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Purpose */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              3. Purpose of Data Processing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Your data is processed strictly for legitimate operational purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">Order Fulfillment</div>
                <div className="text-xs text-slate-500">Printing GST invoices, packaging formulations, and booking courier shipments.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">Dispatch Tracking</div>
                <div className="text-xs text-slate-500">Sending SMS and email tracking links so you can monitor your package.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">Clinical Support</div>
                <div className="text-xs text-slate-500">Answering product dosage, bulk supply, and quality assurance queries.</div>
              </div>
            </div>
          </div>

          {/* Section 4: Data Security */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              4. Data Security & Storage Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              All electronic records are housed in secure MongoDB Atlas cloud databases protected with automated IP whitelisting, encrypted storage volumes, and authenticated access restricted to authorized administrators. We implement the ISO 27001 standard security controls.
            </p>
          </div>

          {/* Section 5: Grievance Officer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#166534]">
              5. Grievance Redressal & Contact Officer
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, you may contact our designated Grievance Officer regarding any privacy concern or data correction request:
            </p>
            
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm space-y-1 text-slate-800 font-medium">
              <div><strong>Grievance Officer:</strong> Legal & Compliance Cell, Health Nutra™</div>
              <div><strong>Facility Address:</strong> Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)</div>
              <div><strong>Phone Hotline:</strong> <a href="tel:+91+91 8809672959, +91 7024308660" className="text-[#166534] font-bold hover:underline">+91 +91 8809672959, +91 7024308660</a></div>
              <div><strong>Email:</strong> <a href="mailto:healthnutra16@gmail.com" className="text-[#166534] font-bold hover:underline">healthnutra16@gmail.com</a></div>
            </div>
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
  window.PrivacyPolicyPage = PrivacyPolicyPage;
}
if (typeof exports !== "undefined") {
  exports.PrivacyPolicyPage = PrivacyPolicyPage;
}

