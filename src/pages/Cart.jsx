import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { lines, total, setQty, remove } = useCart();

  if (!lines.length) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-green-50 text-green-800 shadow-xs ring-8 ring-green-50/50">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-black text-green-950 sm:text-3xl">Your Cart is Empty</h1>
          <p className="mt-2 text-sm text-gray-600">
            You haven't added any health supplements to your cart yet. Explore our premium range and start nourishing your health today.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-800 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-green-900/20 transition-all hover:bg-green-900"
          >
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 500 ? 0 : 50;
  const grandTotal = total + shipping;

  return (
    <div className="flex-1 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb / Step Indicator */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
          <div>
            <h1 className="text-3xl font-black text-green-950">Shopping Cart</h1>
            <p className="mt-1 text-xs text-gray-500">
              Review your items ({lines.reduce((acc, l) => acc + l.qty, 0)} items) before proceeding to checkout.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1.5 text-xs font-semibold text-green-800 hover:underline sm:flex"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="space-y-4 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
              <div className="divide-y divide-gray-100">
                {lines.map((l) => (
                  <div key={l.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-2">
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
                        <h3 className="font-bold text-gray-900">{l.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">₹{l.price} / {l.unit}</p>
                        <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                          In Stock
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-2xs">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="grid h-8 w-8 place-items-center text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="grid h-8 w-8 place-items-center text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-black text-green-900">₹{l.price * l.qty}</p>
                      </div>

                      <button
                        onClick={() => remove(l.id)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-900">
              <Truck size={18} className="text-emerald-700 shrink-0" />
              <span>
                {total >= 500
                  ? "🎉 You qualified for FREE Delivery!"
                  : `Add ₹${500 - total} more to your cart to qualify for FREE Delivery!`}
              </span>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-green-950">Order Summary</h2>

              <div className="space-y-2.5 border-b border-gray-100 pb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-black text-green-900">₹{grandTotal}</span>
              </div>

              <Link
                to="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-98"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  100% Secure Checkout with verified encryption
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={14} className="text-emerald-600" />
                  Fast dispatch within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
