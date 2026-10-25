function Hero({ onExploreClick }) {
  return (
    <section id="hero" className="w-full overflow-hidden bg-[#edf7e8]">
      <div className="mx-auto grid w-[94%] max-w-[1536px] grid-cols-1 items-center gap-8 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-2 lg:py-16">
        <div className="min-w-0">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.1] text-[#166534]">
            <span className="block">NURTURING HEALTH</span>
            <span className="block text-[#f97316]">NOURISHING LIFE NATURALLY</span>
          </h1>
          <div className="mt-5 h-1 w-14 rounded-full bg-[#166534]" />
          <p className="mt-5 max-w-lg text-base font-bold leading-snug text-slate-800 sm:text-lg">
            Premium Nutraceutical Products<br className="hidden sm:block" /> for a Better Tomorrow
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#products"
              onClick={onExploreClick}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#166534] px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#14532d] sm:text-base"
            >
              <span>Explore Products</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 sm:text-base"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { icon: "leaf", title: "Natural Ingredients", detail: "Safe & Effective" },
              { icon: "shield-check", title: "Premium Quality", detail: "Assured Purity" },
              { icon: "heart-pulse", title: "Better Health", detail: "Better Life" },
            ].map((item) => (
              <div key={item.title} className="flex min-w-0 items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#166534] bg-white/70 text-[#166534]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black leading-tight text-slate-900 sm:text-xs">{item.title}</span>
                  <span className="mt-0.5 block text-[10px] font-medium leading-tight text-slate-500 sm:text-xs">{item.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-center lg:justify-end">
        <img
          src="/images/hero-products-range.jpg?v=2"
          alt="Health Nutra product range: 9G tablets, Q10+ syrup, Liv+ syrup, NariA+ syrup, and Lipron+ syrup"
          className="block h-auto w-full max-w-[760px] rounded-sm object-contain shadow-xl"
          fetchPriority="high"
        />
        </div>
      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Hero = Hero;
}
if (typeof exports !== "undefined") {
  exports.Hero = Hero;
}
