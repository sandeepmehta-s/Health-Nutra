import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  AlertCircle
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/home/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products } = useProducts();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const p = products.find((x) => x.id === Number(id));

  if (!p) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const related = products.filter((item) => item.id !== p.id).slice(0, 3);

  const handleAdd = () => {
    add(p.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    add(p.id, qty);
    nav("/checkout");
  };

  return (
    <div className="flex-1 pb-16">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100 bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs text-gray-500 sm:px-6">
          <Link to="/" className="hover:text-green-800 transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link to="/products" className="hover:text-green-800 transition-colors">Products</Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-green-900 truncate max-w-xs">{p.name}</span>
        </div>
      </div>

      {/* Main product view */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image Stage */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100/80 bg-white p-8 shadow-sm">
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 p-6 sm:h-96">
              <img
                src={p.img}
                alt={p.name}
                onError={(e) => {
                  e.currentTarget.src = "/images/hero-showcase.png";
                }}
                className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white shadow-xs">
                {p.cat}
              </span>
            </div>
          </div>

          {/* Product Specs & Purchase */}
          <div className="flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                100% Authentic Formulation
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-800">4.9</span>
                <span className="text-gray-400">(48 verified customer reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-green-950 sm:text-4xl">{p.name}</h1>
            <p className="mt-2 text-base text-gray-600">{p.desc}</p>

            {/* Price section */}
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-green-900">₹{p.price}</span>
                <span className="text-sm font-semibold text-gray-500">/ {p.unit}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Inclusive of all taxes
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1.5 font-semibold ${p.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  <span className={`h-2 w-2 rounded-full ${p.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                  {p.stock > 0 ? `In Stock (${p.stock} units available)` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Product Overview</h3>
              <p className="text-sm leading-relaxed text-gray-700">{p.details}</p>
            </div>

            {/* Quantity Selector & Purchase buttons */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="grid h-10 w-10 place-items-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    disabled={p.stock <= qty}
                    className="grid h-10 w-10 place-items-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  disabled={p.stock < 1}
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-orange-500 bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-xs transition-all hover:bg-orange-50 disabled:opacity-40"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button
                  disabled={p.stock < 1}
                  onClick={handleBuyNow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-green-900/20 transition-all hover:bg-green-900 disabled:opacity-40"
                >
                  Buy Now <ArrowRight size={18} />
                </button>
              </div>

              {added && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 border border-emerald-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Added {qty} item(s) to your cart!
                  </span>
                  <Link to="/cart" className="underline font-bold text-emerald-800 hover:text-emerald-950">
                    View Cart
                  </Link>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6 text-center text-xs text-gray-600">
              <div className="flex flex-col items-center gap-1.5 p-2">
                <Truck size={20} className="text-emerald-700" />
                <span className="font-semibold text-gray-900">Free Delivery</span>
                <span className="text-[11px] text-gray-500">Orders over ₹500</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                <span className="font-semibold text-gray-900">Lab Certified</span>
                <span className="text-[11px] text-gray-500">100% Pure & Safe</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <PackageCheck size={20} className="text-emerald-700" />
                <span className="font-semibold text-gray-900">Cash On Delivery</span>
                <span className="text-[11px] text-gray-500">Pay when received</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-12">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-green-950">
              Related Health Formulations
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} p={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
