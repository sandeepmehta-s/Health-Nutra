/**
 * Health Nutra - Contact Section Component
 * Modern 2-card layout in one row:
 * Left Card: Address, Contact Number, Email ID with rich branded design.
 * Right Card: Clean, modern Contact Us form.
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      
      {/* ========================================================= */}
      {/* LEFT CARD: Address, Contact Number, Email ID */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#0f3d1f] text-white rounded-3xl p-7 sm:p-9 shadow-xl flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 backdrop-blur-sm border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>HEALTH NUTRA HEADQUARTERS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Contact Information
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Have questions about formulations, clinical partnerships, or bulk distribution? Reach out directly to our Indore central office.
          </p>
        </div>

        {/* 3 Core Contact Information Items */}
        <div className="space-y-6 my-8 relative z-10">
          
          {/* 1. Address */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-amber-300 shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 4.282 7.025 15.344 7.332 15.823a.8.8 0 0 0 1.336 0C12.975 23.344 20 12.282 20 8c0-4.289-3.589-8-8-8zm0 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-200/80">Registered Address</div>
              <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)
              </p>
            </div>
          </div>

          {/* 2. Contact Number */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-amber-300 shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-200/80">Phone Support</div>
              <a
                href="tel:+917024308660"
                className="text-base sm:text-lg font-black text-white hover:text-amber-300 transition-colors block"
              >
                +91 7024308660
              </a>
              <div className="text-[11px] text-emerald-200/80 font-medium">
                Mon - Sat: 9:00 AM - 7:00 PM IST
              </div>
            </div>
          </div>

          {/* 3. Email Address */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-amber-300 shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V9.044l7.445 4.963a1.002 1.002 0 0 0 1.11 0L20 9.044 20.002 18H4z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-200/80">Email Address</div>
              <a
                href="mailto:healthnutra16@gmail.com"
                className="text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors block break-all"
              >
                healthnutra16@gmail.com
              </a>
              <div className="text-[11px] text-emerald-200/80 font-medium">
                Direct reply within 24 hours
              </div>
            </div>
          </div>

        </div>

        {/* Card Footer: WhatsApp & Certification */}
        <div className="pt-6 border-t border-white/15 flex items-center justify-between flex-wrap gap-3 relative z-10">
          <a
            href="https://wa.me/917024308660?text=Hello%20Health%20Nutra%20team,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#166534] bg-white hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Icon name="message-circle" className="w-4 h-4 text-emerald-700" />
            <span>Chat on WhatsApp</span>
          </a>
          <span className="text-[11px] font-bold text-emerald-200/80">
            WHO-GMP & ISO 9001:2015
          </span>
        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT CARD: Redesigned Contact Us Form */}
      {/* ========================================================= */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-xl flex flex-col justify-between">
        
        {/* Clean Header */}
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Send Us a Message
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Fill out the form below and our clinical support team will get back to you promptly.
          </p>
        </div>

        {/* Success Banner */}
        {successMsg ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto shadow-xs">
              <Icon name="check-circle" className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-emerald-900">Message Received!</h4>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium max-w-md mx-auto">{successMsg}</p>
            <button
              type="button"
              onClick={() => setSuccessMsg("")}
              className="mt-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] transition-colors shadow-xs cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Row 1: Full Name & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name / Clinic Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Inquiry Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91-7024308660"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all cursor-pointer"
                >
                  <option value="Product Inquiry">Product Inquiry & Dosage</option>
                  <option value="Bulk Order & Dealership">Bulk Order & Dealership Supply</option>
                  <option value="Doctor / Clinic Support">Doctor / Clinic Support</option>
                  <option value="Order Tracking & Delivery">Order Tracking & Delivery Help</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message, order requirement, or question..."
                className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-md shadow-emerald-900/15 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
            >
              {submitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Icon name="send" className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}

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
