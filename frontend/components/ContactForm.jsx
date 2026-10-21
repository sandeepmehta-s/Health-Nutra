/**
 * Health Nutra - ContactForm Component
 * Modern split-layout contact section:
 * Left side: Address, Interactive Google Map, Phone Number, Email ID, Working Hours.
 * Right side: Clean interactive inquiry form matching official brand design.
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
        setSuccessMsg(data.message || "Thank you! Your inquiry has been sent to our clinical support team.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      } else {
        setErrorMsg(data?.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: Address, Interactive Map, Phone, Email, Hours */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col space-y-6">
        
        {/* Header Pill */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#166534] border border-emerald-200/80 mb-2">
            <Icon name="map-pin" className="w-3.5 h-3.5 text-[#166534]" />
            <span>CENTRAL FACILITY & SUPPORT</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Contact Details
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Reach out directly to our central operations team in Indore for formulation details, bulk orders, or distributorships.
          </p>
        </div>

        {/* Interactive Google Map Embed */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 group">
          <iframe
            title="Health Nutra Location Map"
            src="https://maps.google.com/maps?q=247+Slice-2+Sector-A+Scheme+78+Indore+Madhya+Pradesh+452010&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-52 sm:h-56 border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 truncate max-w-[200px]">Scheme 78, Indore</span>
            <a
              href="https://maps.google.com/?q=247+Slice-2+Sector-A+Scheme+78+Indore+452010"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#166534] hover:text-[#14532d] hover:underline"
            >
              <span>Get Directions</span>
              <Icon name="external-link" className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Contact Information List */}
        <div className="space-y-4 pt-1">
          
          {/* Address */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 4.282 7.025 15.344 7.332 15.823a.8.8 0 0 0 1.336 0C12.975 23.344 20 12.282 20 8c0-4.289-3.589-8-8-8zm0 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Registered Address</div>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">
                Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78, INDORE - 452010 Dist.-INDORE (M.P.)
              </p>
            </div>
          </div>

          {/* Contact Number */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Phone Support Hotline</div>
              <a
                href="tel:+917024308660"
                className="text-sm sm:text-base text-slate-900 font-black hover:text-[#166534] transition-colors block"
              >
                +91 7024308660
              </a>
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href="https://wa.me/917024308660?text=Hello%20Health%20Nutra%20team,%20I%20have%20an%20inquiry%20regarding%20your%20products."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  <Icon name="message-circle" className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
                <span className="text-[11px] text-slate-500 font-medium">Mon - Sat: 9 AM - 7 PM</span>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V9.044l7.445 4.963a1.002 1.002 0 0 0 1.11 0L20 9.044 20.002 18H4z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Email ID</div>
              <a
                href="mailto:healthnutra16@gmail.com"
                className="text-xs sm:text-sm text-slate-900 font-black hover:text-[#166534] transition-colors block break-all"
              >
                healthnutra16@gmail.com
              </a>
              <span className="text-[11px] text-slate-500 font-medium block">
                Guaranteed clinical response within 24 hours
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: Interactive Inquiry Form (Matching Screenshot) */}
      {/* ========================================================= */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        
        {/* Form Title & Subtitle */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#166534] border border-emerald-200/80 mb-2">
            <Icon name="message-square" className="w-3.5 h-3.5 text-[#166534]" />
            <span>DIRECT CLINICAL INQUIRY</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Get in Touch With Our Specialists
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium leading-relaxed">
            Have questions regarding ingredients, bulk formulation supply, or retail dealership? Send us a message or contact directly at{" "}
            <a href="tel:+917024308660" className="text-[#166534] font-bold hover:underline">
              +91-7024308660
            </a>{" "}
            /{" "}
            <a href="mailto:healthnutra16@gmail.com" className="text-[#166534] font-bold hover:underline">
              healthnutra16@gmail.com
            </a>.
          </p>
        </div>

        {/* Feedback Message */}
        {successMsg ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto shadow-inner">
              <Icon name="check-circle" className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-emerald-900">Inquiry Submitted Successfully!</h4>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium max-w-md mx-auto">{successMsg}</p>
            <button
              type="button"
              onClick={() => setSuccessMsg("")}
              className="mt-3 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#166534] hover:bg-[#14532d] transition-colors shadow-sm"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Row 1: Full Name & Email */}
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
                  placeholder="Dr. / Mr. / Ms. Rajesh"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-50/50 hover:bg-white"
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
                  placeholder="rajesh@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Inquiry Topic */}
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
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-50/50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 hover:bg-white transition-all cursor-pointer"
                >
                  <option value="Product Inquiry & Dosage">Product Inquiry & Dosage</option>
                  <option value="Bulk Order & Dealership Supply">Bulk Order & Dealership Supply</option>
                  <option value="Doctor / Clinic Support">Doctor / Clinic Support</option>
                  <option value="Order Tracking & Delivery Help">Order Tracking & Delivery Help</option>
                  <option value="General Feedback">General Feedback</option>
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
                placeholder="Tell us more about your inquiry or required quantities..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 hover:bg-white transition-all"
              ></textarea>
            </div>

            {/* Submit Button (Modern Forest Green matching Screenshot) */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl text-sm font-black text-white bg-[#166534] hover:bg-[#14532d] shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
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
