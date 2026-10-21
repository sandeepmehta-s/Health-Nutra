/**
 * Health Nutra - Dedicated Contact Us Page
 * Dedicated page at /contact-us featuring modern 2-column layout:
 * Left side: Address, Interactive Map, Phone, Email, Working Hours.
 * Right side: Interactive Form.
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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
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
        {/* MODERN SPLIT CONTACT SECTION (Left: Map & Info, Right: Form) */}
        {/* ========================================================= */}
        <section id="contact-form" className="w-full">
          <ContactForm />
        </section>

        {/* ========================================================= */}
        {/* QUALITY & TRUST CREDENTIALS */}
        {/* ========================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
              <Icon name="shield-check" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">WHO-GMP & ISO</div>
              <div className="text-[11px] text-slate-500 font-medium">Certified Formulations</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
              <Icon name="truck" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Pan-India Courier</div>
              <div className="text-[11px] text-slate-500 font-medium">Fast Dispatch with COD</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
              <Icon name="flask-conical" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Science Backed</div>
              <div className="text-[11px] text-slate-500 font-medium">Standardised Botanicals</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Icon name="users" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">Dedicated Support</div>
              <div className="text-[11px] text-slate-500 font-medium">Mon - Sat: 9 AM - 7 PM</div>
            </div>
          </div>

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
