import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  User,
  MapPin,
  Clock,
  Printer
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { sendOrderEmails } from "../services/emailService";
import { saveToSheet } from "../services/sheetService";

export default function Checkout() {
  const { lines, total, clear } = useCart();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "" });
  const [status, setStatus] = useState("idle");
  const [placedOrder, setPlacedOrder] = useState(null);

  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const shipping = total >= 500 ? 0 : 50;
  const grandTotal = total + shipping;

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const orderSnapshot = {
      orderId: `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      items: lines.map((l) => `${l.name} x${l.qty}`).join(", "),
      lines: [...lines],
      total: grandTotal,
      name: f.name,
      email: f.email,
      phone: f.phone,
      address: f.address
    };

    setPlacedOrder(orderSnapshot);

    await saveToSheet("Orders", {
      ...f,
      items: orderSnapshot.items,
      total: grandTotal
    });

    try {
      await sendOrderEmails({ ...f, lines, total: grandTotal });
    } catch {
      /* email optional: order is already saved in the sheet */
    }

    clear();
    setStatus("done");
  };

  // Modern Order Placed Screen
  if (status === "done" && placedOrder) {
    return (
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 px-6 py-10 text-center text-white">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md ring-8 ring-white/10">
                <CheckCircle2 size={36} />
              </div>
              <h1 className="text-2xl font-black sm:text-3xl">Order Placed Successfully!</h1>
              <p className="mt-1 text-xs text-emerald-100">
                Order ID: <span className="font-mono font-bold text-white">{placedOrder.orderId}</span>
              </p>
              <p className="mt-2 text-xs text-emerald-200">
                A confirmation email has been dispatched to <b className="text-white">{placedOrder.email}</b>.
              </p>
            </div>

            {/* Details Card */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Order items recap */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Ordered Products
                </h3>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-slate-50/50 p-3">
                  {placedOrder.lines.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-gray-900">{item.name}</span>
                        <span className="rounded bg-gray-200 px-1.5 py-0.2 text-[10px] text-gray-700">
                          Qty: {item.qty}
                        </span>
                      </div>
                      <span className="font-bold text-green-900">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 text-sm font-black text-green-950">
                    <span>Total Amount (COD)</span>
                    <span>₹{placedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-xs text-gray-700 space-y-1">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                  <MapPin size={14} className="text-emerald-700" /> Delivery Address
                </h4>
                <p className="font-medium text-gray-900">{placedOrder.name}</p>
                <p>{placedOrder.address}</p>
                <p className="text-gray-500">Contact: {placedOrder.phone}</p>
              </div>

              {/* Steps timeline */}
              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 text-center text-[11px]">
                <div className="flex flex-col items-center gap-1 text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="font-bold">Order Confirmed</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500">
                  <Clock size={18} className="text-orange-500" />
                  <span className="font-medium">Packaging</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500">
                  <Truck size={18} className="text-gray-400" />
                  <span className="font-medium">Delivery</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  to="/products"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-800 py-3.5 text-xs font-bold text-white shadow-md shadow-green-900/20 hover:bg-green-900"
                >
                  Continue Shopping <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Printer size={14} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty State
  if (!lines.length) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-800">
            <PackageCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="mt-2 text-sm text-gray-600">Please select supplements from our catalog before checking out.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-800 px-6 py-3 text-sm font-bold text-white hover:bg-green-900"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20";

  return (
    <div className="flex-1 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header navigation */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-3xl font-black text-green-950">Checkout</h1>
            <p className="mt-1 text-xs text-gray-500">Enter your shipping details to complete your order.</p>
          </div>
          <Link to="/cart" className="flex items-center gap-1.5 text-xs font-bold text-green-800 hover:underline">
            <ArrowLeft size={14} /> Back to Cart
          </Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-green-950">
                <MapPin size={20} className="text-orange-500" />
                Shipping & Delivery Address
              </h2>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Full Name *</label>
                  <div className="relative">
                    <input
                      required
                      placeholder="e.g. Rahul Sharma"
                      className={inputClass}
                      value={f.name}
                      onChange={on("name")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      className={inputClass}
                      value={f.email}
                      onChange={on("email")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">Phone Number *</label>
                    <input
                      required
                      placeholder="+91 98765 43210"
                      className={inputClass}
                      value={f.phone}
                      onChange={on("phone")}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Full Delivery Address *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House/Flat No., Building name, Street, Landmark, City, State, PIN Code"
                    className={inputClass}
                    value={f.address}
                    onChange={on("address")}
                  />
                </div>

                {/* Payment Option */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="cod" name="payment" defaultChecked className="accent-green-800" />
                      <label htmlFor="cod" className="text-sm font-bold text-green-950">
                        Cash on Delivery (COD)
                      </label>
                    </div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Standard
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 pl-5">
                    Pay securely with cash or UPI at your doorstep upon order delivery.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-98 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order · ₹{grandTotal}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="rounded-lg bg-rose-50 p-3 text-center text-xs text-rose-700">
                    Order confirmation failed. Please check your network and try again.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-green-950">Items in Your Order</h3>

              <div className="divide-y divide-gray-100">
                {lines.map((l) => (
                  <div key={l.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-50 p-1">
                        <img
                          src={l.img}
                          alt={l.name}
                          onError={(e) => {
                            e.currentTarget.src = "/images/hero-showcase.png";
                          }}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{l.name}</p>
                        <p className="text-[11px] text-gray-500">Qty: {l.qty} × ₹{l.price}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-900">₹{l.price * l.qty}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-green-950">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-slate-50/70 p-4 space-y-2 text-[11px] text-gray-600">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Your information is encrypted and confidential.
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} className="text-emerald-700" />
                  Delivered with care in tamper-evident packaging.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
