/**
 * Health Nutra - About Us & Leadership Page
 * Dedicated page at /about-us matching the official design mockup.
 */

function AboutUsPage() {
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
        onOpenSearch={() => {
          window.location.href = "/#products";
        }}
        onOpenTrackOrder={() => handleOpenTrackModal()}
      />

      {/* Breadcrumb Header */}
      <div className="bg-emerald-900/5 border-b border-emerald-900/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <a href="/" className="hover:text-[#166534] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#166534] font-bold">About Us</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        
        {/* ========================================================= */}
        {/* TOP SECTION: ABOUT HEALTH NUTRA (Matching Mockup) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              <span className="text-[#166534]">ABOUT </span>
              <span className="text-[#F97316]">HEALTH NUTRA</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Health Nutra is committed to delivering high-quality nutraceutical products that support better health and well-being. Our mission is to bring nature and science together to create products that make a real difference in people&apos;s lives.
            </p>

            <div className="pt-2">
              <a
                href="#leadership"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] shadow-xs shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Know More About Us</span>
                <span className="text-base font-bold">→</span>
              </a>
            </div>
          </div>

          {/* Right Feature Badges Box (4 Columns) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 text-center">
              
              {/* Quality Assured */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                  </svg>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Quality<br />Assured
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  We ensure the highest standards in every product.
                </p>
              </div>

              {/* Science Backed */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="flask-conical" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Science<br />Backed
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  Our products are formulated with scientific research.
                </p>
              </div>

              {/* Advanced Manufacturing */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="factory" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Advanced<br />Manufacturing
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  State-of-the-art facilities for safe & effective products.
                </p>
              </div>

              {/* Customer First */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center text-[#166534]">
                  <Icon name="users" className="w-8 h-8" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-[#166534] leading-snug">
                  Customer<br />First
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">
                  We care about our customers&apos; health & trust.
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: OUR LEADERSHIP (Matching Mockup) */}
        {/* ========================================================= */}
        <section id="leadership" className="scroll-mt-24 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              <span className="text-[#166534]">OUR </span>
              <span className="text-[#F97316]">LEADERSHIP</span>
            </h2>
            <div className="w-12 h-1 bg-[#166534] rounded-full mx-auto mt-2"></div>
          </div>

          {/* Leadership Profile Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Director */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start">
              {/* Circular Photo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 mx-auto sm:mx-0">
                <img
                  src="/images/director.jpg"
                  alt="Company Director"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                  }}
                />
              </div>

              {/* Bio & Details */}
              <div className="space-y-2.5 flex-grow">
                <div>
                  <h3 className="text-xl font-black text-[#166534] leading-tight">Director</h3>
                  <div className="text-xs font-semibold text-slate-500">Company Director</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  As the Director of Health Nutra, I am committed to our mission of delivering premium quality nutraceutical products that improve lives. Our focus is on innovation, quality and customer trust.
                </p>

                {/* Bullets with green checkmarks */}
                <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Visionary leadership with a focus on growth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Committed to quality & innovation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Driving Health Nutra towards a healthier future</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Mr. Ashutosh Pandey */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start">
              {/* Circular Photo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 mx-auto sm:mx-0">
                <img
                  src="/images/ashutosh.jpg"
                  alt="Mr. Ashutosh Pandey"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg";
                  }}
                />
              </div>

              {/* Bio & Details */}
              <div className="space-y-2.5 flex-grow">
                <div>
                  <h3 className="text-xl font-black text-[#166534] leading-tight">Mr. Ashutosh Pandey</h3>
                  <div className="text-xs font-semibold text-slate-500">Marketing Manager</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  With over 25 years of rich experience in the marketing field, Mr. Ashutosh Pandey leads our marketing strategies with expertise and dedication.
                </p>

                {/* Bullets with green checkmarks */}
                <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>25+ Years of Marketing Experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Expert in Brand Building & Market Expansion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Strong Network & Client Relationships</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Strategic Planning & Team Leadership</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE ENQUIRY FORM */}
        {/* ========================================================= */}
        <section id="contact" className="pt-8 border-t border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <ContactForm />
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
  window.AboutUsPage = AboutUsPage;
}
if (typeof exports !== "undefined") {
  exports.AboutUsPage = AboutUsPage;
}

