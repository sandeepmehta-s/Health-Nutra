import { Link } from "react-router-dom";

export default function Logo({ light }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-green-800 via-emerald-700 to-green-600 shadow-md ring-2 ring-orange-400/40">
        <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M20 7C27 7 32 13 32 20C32 29 20 35 20 35C20 35 8 29 8 20C8 13 13 7 20 7Z" fill="white" fillOpacity="0.95" />
          <path d="M20 11C24 16 26 21 24 25C22 29 18 31 16 32C15 27 16 22 19 18C20 15 20 13 20 11Z" fill="#15803d" />
          <path d="M20 12C22 17 21 22 18 25C16 22 17 17 20 12Z" fill="#f97316" />
          <circle cx="20" cy="23" r="2" fill="#ea580c" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold tracking-wider sm:text-2xl ${light ? "text-white" : "text-green-900"}`}>
          HEALTH <span className="text-orange-500">NUTRA</span>
        </span>
        <span className={`text-[9px] font-semibold tracking-widest uppercase ${light ? "text-green-200" : "text-emerald-700"}`}>
          Nurturing Health, Enriching Life
        </span>
      </div>
    </Link>
  );
}

