/**
 * Health Nutra - Dedicated Contact Us Page
 * Dedicated page at /contact-us matching the official brand design.
 */

function ContactUsPage() {
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
          <span className="text-[#166534] font-bold">Contact Us</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        
        {/* ========================================================= */}
        {/* TOP HEADER SECTION */}
        {/* ========================================================= */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/70 text-[#166534]">
            <Icon name="phone" className="w-3.5 h-3.5" />
            <span>WE ARE HERE TO HELP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            <span className="text-[#166534]">CONTACT </span>
            <span className="text-[#F97316]">HEALTH NUTRA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Have questions regarding our nutraceutical formulations, wholesale distribution, or an existing order? Get in touch with our Indore clinical and logistics team.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 4 CONTACT DETAILS INFO CARDS (Matching About Us style) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Registered Office */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 4.282 7.025 15.344 7.332 15.823a.8.8 0 0 0 1.336 0C12.975 23.344 20 12.282 20 8c0-4.289-3.589-8-8-8zm0 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#166534] uppercase tracking-wide">
                Registered Office
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)
              </p>
            </div>
          </div>

          {/* Card 2: Phone Hotline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#166534] uppercase tracking-wide">
                Customer Support
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                <a href="tel:+917024308660" className="text-slate-900 font-bold hover:text-[#166534] transition-colors block">
                  +91 7024308660
                </a>
                <span className="text-[11px] text-slate-500">Mon - Sat: 9:00 AM - 7:00 PM</span>
              </p>
            </div>
          </div>

          {/* Card 3: Email Enquiries */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V9.044l7.445 4.963a1.002 1.002 0 0 0 1.11 0L20 9.044 20.002 18H4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#166534] uppercase tracking-wide">
                Email Enquiries
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                <a href="mailto:healthnutra16@gmail.com" className="text-slate-900 font-bold hover:text-[#166534] transition-colors block break-all">
                  healthnutra16@gmail.com
                </a>
                <span className="text-[11px] text-slate-500">Guaranteed reply within 24h</span>
              </p>
            </div>
          </div>

          {/* Card 4: Quality & Compliance */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <Icon name="shield-check" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#166534] uppercase tracking-wide">
                Quality & Compliance
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                WHO-GMP & ISO 9001:2015 Compliant formulations certified for safety & efficacy.
              </p>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE ENQUIRY FORM */}
        {/* ========================================================= */}
        <section id="contact-form" className="max-w-4xl mx-auto">
          <ContactForm />
        </section>

        {/* ========================================================= */}
        {/* FACILITY LOCATION CARD */}
        {/* ========================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#166534] uppercase tracking-wider">
              <Icon name="map-pin" className="w-4 h-4" />
              <span>Indore Operations & Supply Hub</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Visiting Our Central Facility?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Appointments can be scheduled for bulk stockists, hospital supply managers, and pharmaceutical retail partners.
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=247+Slice-2+Sector-A+Scheme+78+Indore+452010"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-xs transition-all"
          >
            <span>Open in Google Maps</span>
            <Icon name="external-link" className="w-4 h-4" />
          </a>
        </section>

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
  window.ContactUsPage = ContactUsPage;
}
if (typeof exports !== "undefined") {
  exports.ContactUsPage = ContactUsPage;
}
