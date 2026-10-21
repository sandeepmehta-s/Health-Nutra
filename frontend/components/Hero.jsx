/**
 * Health Nutra - Hero Showcase Component
 * Matching the botanical formulation hero banner layout.
 */

function Hero({ onExploreClick }) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-10 sm:py-14 lg:py-18"
      style={{
        background: "linear-gradient(135deg, #eaf5ec 0%, #f4faf5 50%, #e3f2e6 100%)",
      }}
    >
      {/* Decorative botanical ambient leaves & glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Big Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08]">
              <span className="text-[#166534] block">NURTURING HEALTH</span>
              <span className="text-[#F97316] block">ENRICHING LIFE</span>
            </h1>

            {/* Green horizontal accent bar */}
            <div className="w-14 h-1 bg-[#166534] rounded-full"></div>

            {/* Subtitle */}
            <p className="text-slate-800 text-base sm:text-lg lg:text-xl font-bold leading-snug">
              Premium Nutraceutical Products<br />
              for a Better Tomorrow
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#products"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-md shadow-emerald-900/15 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explore Products</span>
                <span className="text-base font-bold">→</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-all"
              >
                <span>Contact Us</span>
              </a>
            </div>

            {/* 3 Trust Badges underneath */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
              
              {/* Natural Ingredients */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#166534] text-[#166534] flex items-center justify-center shrink-0 bg-white/70">
                  <Icon name="leaf" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs lg:text-sm font-black text-slate-900 leading-tight">
                    Natural Ingredients
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    Safe & Effective
                  </div>
                </div>
              </div>

              {/* Premium Quality */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#166534] text-[#166534] flex items-center justify-center shrink-0 bg-white/70">
                  <Icon name="shield-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs lg:text-sm font-black text-slate-900 leading-tight">
                    Premium Quality
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    Assured Purity
                  </div>
                </div>
              </div>

              {/* Better Health */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#166534] text-[#166534] flex items-center justify-center shrink-0 bg-white/70">
                  <Icon name="heart-pulse" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs lg:text-sm font-black text-slate-900 leading-tight">
                    Better Health
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    Better Life
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Showcase Image Banner */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <img
                src="/images/hero-showcase.png"
                alt="Health Nutra 9G and 10Q Syrup Products"
                className="w-full max-h-[380px] lg:max-h-[460px] object-contain drop-shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/10q.png";
                }}
              />
            </div>
          </div>

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
