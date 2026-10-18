import { CheckCircle2, Award, Briefcase } from "lucide-react";
import SectionTitle from "../common/SectionTitle";

const L = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Company Director & Founder",
    photo: "/images/director.jpg",
    bio: "Committed to delivering premium quality nutraceutical formulations that enhance community vitality and wellness standards.",
    pts: ["Visionary Healthcare Leadership", "Pioneering Nutraceutical Standards", "Uncompromising Quality Assurance"]
  },
  {
    name: "Mr. Ashutosh Pandey",
    role: "Marketing Manager & Head of Strategy",
    photo: "/images/ashutosh.jpg",
    bio: "Over 25 years of rich executive experience driving healthcare brand expansion, trust, and pan-India distribution.",
    pts: ["25+ Years Marketing Leadership", "Pan-India Healthcare Distribution", "Strategic Partnerships & Expansion"]
  }
];

export default function Leadership() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle
        a="OUR"
        b="LEADERSHIP"
        sub="Guided by seasoned healthcare visionaries and marketing veterans dedicated to excellence."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {L.map((l) => (
          <div
            key={l.name}
            className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg sm:flex-row sm:items-start"
          >
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <img
                src={l.photo}
                alt={l.name}
                onError={(e) => {
                  e.currentTarget.src = "/images/hero-showcase.png";
                }}
                className="h-32 w-32 rounded-2xl border-4 border-emerald-50 object-cover shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-white shadow-xs">
                <Award size={16} />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="mb-1">
                <h3 className="text-xl font-bold text-green-950">{l.name}</h3>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                  <Briefcase size={13} /> {l.role}
                </p>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-600">{l.bio}</p>

              <ul className="mt-4 space-y-2">
                {l.pts.map((x) => (
                  <li key={x} className="flex items-center justify-center gap-2 text-xs font-medium text-gray-700 sm:justify-start">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
