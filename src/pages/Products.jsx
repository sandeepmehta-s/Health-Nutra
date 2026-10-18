import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductGrid from "../components/home/ProductGrid";

export default function Products() {
  return (
    <div className="flex-1">
      {/* Banner */}
      <div className="border-b border-green-100 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-white font-medium">Products</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Product Range</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100">
            Scientifically formulated vitamins, antioxidants, omega fatty acids, and herbal extracts for comprehensive everyday wellness.
          </p>
        </div>
      </div>

      <ProductGrid />
    </div>
  );
}
