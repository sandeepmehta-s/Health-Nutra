import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, HeartPulse, Award, Sparkles } from "lucide-react";

const BADGES = [
  [Leaf, "Natural Ingredients", "Clinically formulated & pure"],
  [ShieldCheck, "Premium Quality", "GMP & ISO certified standards"],
  [HeartPulse, "Holistic Wellness", "Formulated for daily vitality"]
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/70 via-white to-emerald-50/30 py-12 lg:py-20">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1.5 text-xs font-bold text-emerald-900 mb-5">
            <Sparkles size={14} className="text-orange-500" />
            <span>Scientifically Formulated Nutraceuticals</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-green-900 leading-tight">NURTURING HEALTH</span>
            <span className="block bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent leading-tight">
              ENRICHING LIFE
            </span>
          </h1>

          <div className="my-5 h-1 w-16 rounded-full bg-orange-500" />

          <p className="text-lg font-medium text-gray-700 sm:text-xl">
            Premium Nutraceutical Products formulated with precision to power your daily energy, immunity, and lifelong vitality.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-green-900/20 transition-all hover:from-green-900 hover:to-emerald-800 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Products <ArrowRight size={17} />
            </Link>
            <a
              href="#contact"
              className="rounded-xl border border-green-800/30 bg-white/80 px-7 py-3.5 text-sm font-bold text-green-900 shadow-xs backdrop-blur-xs transition-all hover:bg-green-50 hover:border-green-800 hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            {BADGES.map(([Icon, title, subtitle]) => (
              <div key={title} className="flex items-center gap-3 rounded-xl border border-emerald-100/60 bg-white/60 p-2.5 backdrop-blur-xs">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-100/70 text-emerald-800">
                  <Icon size={18} />
                </span>
                <div>
                  <b className="block text-xs text-green-950 font-bold">{title}</b>
                  <span className="text-[11px] text-gray-500">{subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-100/80 bg-white p-3 shadow-2xl shadow-green-900/10">
            <img
              src="/images/hero-showcase.png"
              alt="Health Nutra 9G & 10Q Syrup"
              className="w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute top-6 left-6 rounded-full bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-900">
                <Award size={14} className="text-orange-500" />
                Featured Flagship Range
              </span>
            </div>
            <div className="absolute bottom-6 right-6 rounded-full bg-green-900/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              <span>9G Tablets & 10Q Syrup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
