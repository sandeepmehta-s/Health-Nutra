import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "./ProductCard";
import SectionTitle from "../common/SectionTitle";

export default function ProductGrid({ limit }) {
  const { products } = useProducts();
  const [tab, setTab] = useState("All");
  const tabs = ["All", ...new Set(products.map((p) => p.cat))];
  const filtered = tab === "All" ? products : products.filter((p) => p.cat === tab);
  const list = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle
        a="OUR"
        b="PRODUCTS"
        sub="Carefully curated health supplements designed to support your daily wellness journey."
      />

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const count = t === "All" ? products.length : products.filter((p) => p.cat === t).length;
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                active
                  ? "bg-green-800 text-white shadow-md shadow-green-900/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-green-700 hover:text-green-800"
              }`}
            >
              <span>{t}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {/* Bottom CTA if limited on homepage */}
      {limit && products.length > limit && (
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-green-800 bg-white px-8 py-3 text-sm font-bold text-green-900 transition-all hover:bg-green-800 hover:text-white"
          >
            Explore Complete Range <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
