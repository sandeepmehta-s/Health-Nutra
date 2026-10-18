import { Leaf, FlaskConical, Factory, Users, CheckCircle, Shield } from "lucide-react";

const F = [
  { icon: Leaf, title: "Natural Ingredients", desc: "Sourced sustainably with uncompromising botanical purity." },
  { icon: FlaskConical, title: "Science Backed", desc: "Clinically validated ratios formulated by nutritional experts." },
  { icon: Factory, title: "GMP Manufacturing", desc: "State-of-the-art sterile manufacturing adhering to global standards." },
  { icon: Users, title: "Customer Trust", desc: "Dedicated to improving everyday health with authentic care." }
];

const STATS = [
  { num: "25+", label: "Years Experience" },
  { num: "100K+", label: "Satisfied Customers" },
  { num: "100%", label: "Lab Tested" },
  { num: "ISO & GMP", label: "Certified" }
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              Our Heritage & Philosophy
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-green-950 sm:text-4xl">
              About <span className="text-orange-500">Health Nutra</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Health Nutra is dedicated to pioneering high-efficacy nutraceuticals that bridge holistic natural botanicals with rigorous modern scientific research.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Every formulation is crafted to promote preventive wellness, boost daily vitality, and elevate quality of life without harmful additives.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-2xs">
                  <span className="block text-2xl font-black text-green-900">{s.num}</span>
                  <span className="text-xs font-medium text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {F.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-green-950">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
