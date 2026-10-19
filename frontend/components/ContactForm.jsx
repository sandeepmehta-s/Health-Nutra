/**
 * Health Nutra - ContactForm Component
 * Reusable contact inquiry form with validation, feedback banner, and API submission.
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Thank you! Your inquiry has been sent to our clinical support team.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      } else {
        setErrorMsg(data.message || "Failed to submit message. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200 mb-2">
          <Icon name="message-square" className="w-3.5 h-3.5 text-brand-700" />
          <span>DIRECT CLINICAL INQUIRY</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Get in Touch With Our Specialists
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Have questions regarding ingredients, bulk formulation supply, or retail dealership? Send us a message.
        </p>
      </div>

      {successMsg ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Icon name="check-circle" className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-emerald-900">Inquiry Submitted!</h4>
          <p className="text-xs text-emerald-800 font-medium max-w-md mx-auto">{successMsg}</p>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="mt-2 px-5 py-2 rounded-xl text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. / Mr. / Ms. Rajesh"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rajesh@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Inquiry Topic
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 bg-white"
              >
                <option value="Product Inquiry">Product Inquiry & Dosage</option>
                <option value="Bulk Order & Dealership">Bulk Order & Dealership Supply</option>
                <option value="Doctor Support">Doctor / Clinic Support</option>
                <option value="Order Tracking Help">Order Tracking & Delivery Help</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Your Message *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your inquiry or required quantities..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-xl shadow-brand-800/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 transform hover:-translate-y-0.5 active:scale-95"
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
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.ContactForm = ContactForm;
}

if (typeof exports !== "undefined") {
  exports.ContactForm = ContactForm;
}

