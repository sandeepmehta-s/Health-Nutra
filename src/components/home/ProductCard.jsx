import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Check, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ p }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    add(p.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      {/* Top category & stock badges */}
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
          {p.cat}
        </span>
        <span className={`inline-flex items-center gap-1 font-medium ${p.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.stock > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
          {p.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Product Image */}
      <Link to={`/products/${p.id}`} className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-emerald-50/20 p-3">
        <img
          src={p.img}
          alt={p.name}
          onError={(e) => {
            e.currentTarget.src = "/images/hero-showcase.png";
          }}
          className="h-full max-h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="flex-1">
        <div className="mb-1.5 flex items-center gap-1 text-xs text-amber-500">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-800">4.9</span>
          <span className="text-gray-400">(48 reviews)</span>
        </div>

        <Link to={`/products/${p.id}`}>
          <h3 className="font-bold text-gray-900 transition-colors group-hover:text-green-800">
            {p.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {p.desc}
        </p>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-4 pt-3 border-t border-gray-50">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xl font-extrabold text-green-900">₹{p.price}</span>
            <span className="ml-1 text-xs font-medium text-gray-500">/ {p.unit}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Free shipping
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${p.id}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Details <ArrowRight size={13} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={p.stock < 1}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-orange-500 text-white shadow-xs hover:bg-orange-600 active:scale-95 disabled:opacity-50"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
