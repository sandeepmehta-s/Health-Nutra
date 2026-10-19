/**
 * Health Nutra - Hero Showcase Component
 * Hero section presenting clinical excellence, certifications, and direct CTA.
 */

function Hero({ onExploreClick }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-slate-50 to-white">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Quality pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 shadow-xs text-xs font-black text-brand-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>WHO-GMP & ISO 9001:2015 CERTIFIED PHARMACEUTICALS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Clinically Formulated for{" "}
              <span className="bg-gradient-to-r from-brand-700 via-emerald-700 to-accent-600 bg-clip-text text-transparent">
                Peak Vitality & Longevity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Health Nutra combines evidence-based nutritional science with pharmaceutical-grade purity. Explore our doctor-recommended multivitamins, Omega-3s, and wellness supplements.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 shadow-xl shadow-brand-800/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Icon name="pill" className="w-5 h-5" />
                <span>Explore Formulations</span>
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-brand-600 hover:text-brand-800 hover:bg-brand-50/50 shadow-sm transition-all"
              >
                <Icon name="shield-check" className="w-5 h-5 text-emerald-600" />
                <span>Quality Standards</span>
              </a>
            </div>

            {/* Trust metrics bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs font-bold text-slate-500">Pure Formulations</div>
              </div>
              <div>
                <div className="text-2xl font-black text-brand-700">GMP</div>
                <div className="text-xs font-bold text-slate-500">Standard Lab</div>
              </div>
              <div>
                <div className="text-2xl font-black text-accent-600">₹0</div>
                <div className="text-xs font-bold text-slate-500">Fast Shipping</div>
              </div>
            </div>

          </div>

          {/* Right Product Showcase Hero Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Card Container */}
              <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Featured Formulation</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-700">
                    Bestseller
                  </span>
                </div>

                <div className="my-6 relative flex items-center justify-center h-64 bg-gradient-to-tr from-slate-100 to-emerald-50/50 rounded-2xl overflow-hidden group">
                  <img
                    src="/images/hero-showcase.png"
                    alt="Health Nutra Product Lineup"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/10q.png";
                    }}
                    className="max-h-56 object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black text-slate-700 shadow-sm">
                    Clinical Grade
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">Health Nutra 9G & 10Q Series</h3>
                  <p className="text-xs text-slate-500 mt-1">Advanced Co-Q10, Ginseng, Green Tea & 9+ Essential Micronutrients</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Starting from</span>
                      <div className="text-xl font-black text-brand-700">₹235 <span className="text-xs font-normal text-slate-500">/ Strip</span></div>
                    </div>
                    <a
                      href="#products"
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-sm"
                    >
                      View Catalog
                    </a>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Icon name="award" className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Lab Tested</div>
                  <div className="text-[10px] text-slate-400">Batch Certified</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Hero = Hero;
}

if (typeof exports !== "undefined") {
  exports.Hero = Hero;
}

