/**
 * Health Nutra - Contact Section Component
 * Matches the reference design mockup:
 * Left side: Brand forest green banner with "Have Any Questions?", description,
 * Phone (+91 7024308660), Email (healthnutra16@gmail.com), and Address.
 * Right side: Clean white card with minimalist inputs and orange "Send Us →" button.
 */

function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "Product Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in your Name, Email, and Message.");
      return;
    }

    setSubmitting(true);
    try {
      let data;
      if (window.apiHelper && typeof window.apiHelper.submitContact === "function") {
        data = await window.apiHelper.submitContact(formData);
      } else {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await res.json();
      }

      if (data && data.success) {
        setSuccessMsg(data.message || "Thank you! Your message has been sent successfully. Our team will contact you shortly.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      } else {
        setErrorMsg(data?.message || "Failed to submit message. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3d1f] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
      
      {/* Decorative gradient atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-black/25 pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Have Any Questions? + Contact Details */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Have Any Questions?
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-lg">
            Health Nutra is committed to delivering clinical-grade nutraceuticals that support better health and vitality. Have queries regarding our formulations, dealership opportunities, or your order? Get in touch with us anytime.
          </p>

          {/* 3 Contact details with clear line icons */}
          <div className="space-y-4 pt-2">
            
            {/* Phone */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <a
                href="tel:+917024308660"
                className="text-base sm:text-lg font-bold text-white hover:text-amber-300 transition-colors"
              >
                +91 7024308660
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
              </div>
              <a
                href="mailto:healthnutra16@gmail.com"
                className="text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors break-all"
              >
                healthnutra16@gmail.com
              </a>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-relaxed max-w-sm">
                Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Clean White Form Card Matching Reference */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-800">
          
          {successMsg ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto shadow-xs">
                <Icon name="check-circle" className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-emerald-900">Message Received!</h4>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium max-w-md mx-auto">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg("")}
                className="mt-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] transition-colors shadow-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                  <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Enter Your Name */}
              <div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Your Name *"
                  className="w-full pb-3 pt-2 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 border-b border-slate-200 focus:border-[#166534] focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {/* Enter Your Email */}
              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter Your Email *"
                  className="w-full pb-3 pt-2 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 border-b border-slate-200 focus:border-[#166534] focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {/* Enter Your Phone Number */}
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter Your Phone Number"
                  className="w-full pb-3 pt-2 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 border-b border-slate-200 focus:border-[#166534] focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {/* Enter Your Message */}
              <div>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter Your Message *"
                  className="w-full pb-3 pt-2 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 border-b border-slate-200 focus:border-[#166534] focus:outline-none transition-colors bg-transparent resize-y"
                ></textarea>
              </div>

              {/* Action Button: Orange "Send Us →" */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  <span>{submitting ? "Sending..." : "Send Us"}</span>
                  <span className="text-base font-bold">→</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.ContactForm = ContactForm;
}

if (typeof exports !== "undefined") {
  exports.ContactForm = ContactForm;
}
