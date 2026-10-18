import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import { sendEnquiry } from "../../services/emailService";
import { saveToSheet } from "../../services/sheetService";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    await saveToSheet("Enquiries", f);
    try {
      await sendEnquiry(f).catch(() => {});
      setStatus("Thank you! Your enquiry has been received. Our team will contact you shortly.");
      setIsSuccess(true);
      setF({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("Could not send. Please try again or reach out to us by phone.");
      setIsSuccess(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20";

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle
        a="GET IN"
        b="TOUCH"
        sub="Have questions about our products or want to partner with Health Nutra? Reach out to us today."
      />

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Contact info cards */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-green-950">Corporate Headquarters</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              Health Nutra Private Limited. Committed to delivering world-class nutritional supplements.
            </p>

            <div className="mt-6 space-y-4 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <MapPin size={16} />
                </span>
                <div>
                  <b className="block text-gray-900 font-bold">Address</b>
                  <span>123, Health Nutra House, Lucknow, UP - 226001</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Mail size={16} />
                </span>
                <div>
                  <b className="block text-gray-900 font-bold">Email Support</b>
                  <a href="mailto:healthnutra16@gmail.com" className="text-emerald-700 hover:underline">
                    healthnutra16@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Phone size={16} />
                </span>
                <div>
                  <b className="block text-gray-900 font-bold">Helpline & WhatsApp</b>
                  <a href="tel:+919876543210" className="text-emerald-700 hover:underline">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Clock size={16} />
                </span>
                <div>
                  <b className="block text-gray-900 font-bold">Working Hours</b>
                  <span>Monday - Saturday: 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
          <h3 className="text-xl font-bold text-green-950 mb-2">Send an Enquiry</h3>
          <p className="text-xs text-gray-500 mb-6">
            Fill in the details below and our customer health consultant will get back to you within 24 hours.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  required
                  placeholder="Your Name"
                  className={inputClass}
                  value={f.name}
                  onChange={on("name")}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="your.email@example.com"
                  className={inputClass}
                  value={f.email}
                  onChange={on("email")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">Contact Number *</label>
              <input
                required
                placeholder="+91 98765 43210"
                className={inputClass}
                value={f.phone}
                onChange={on("phone")}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">Message / Product Query *</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what you'd like to know about our supplements or distribution..."
                className={inputClass}
                value={f.message}
                onChange={on("message")}
              />
            </div>

            <button
              type="submit"
              disabled={status === "Sending..."}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-98 disabled:opacity-60"
            >
              <Send size={16} />
              {status === "Sending..." ? "Transmitting Enquiry..." : "Submit Enquiry"}
            </button>

            {status && (
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  isSuccess ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-rose-50 text-rose-800"
                }`}
              >
                {isSuccess && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                <span>{status}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
