/**
 * Health Nutra - Badge UI Component
 * Reusable badge with Tailwind CSS styling and preset status variants.
 */

function Badge({
  variant = "neutral",
  size = "md",
  children,
  icon = null,
  pulse = false,
  className = "",
  ...props
}) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  const variantStyles = {
    brand: "bg-brand-50 text-brand-800 border border-brand-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    accent: "bg-accent-50 text-accent-700 border border-accent-200/60",
    orange: "bg-orange-50 text-orange-700 border border-orange-200/60",
    blue: "bg-blue-50 text-blue-700 border border-blue-200/60",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/60",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    danger: "bg-red-50 text-red-700 border border-red-200/60",
    topMatch: "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black shadow-sm shadow-orange-500/20 border-0",
  };

  const pulseColors = {
    brand: "bg-brand-500",
    emerald: "bg-emerald-500",
    accent: "bg-accent-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    neutral: "bg-slate-400",
    danger: "bg-red-500",
    topMatch: "bg-white",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${pulseColors[variant] || "bg-emerald-500"}`} />
      )}
      {icon && <i data-lucide={icon} className="w-3.5 h-3.5"></i>}
      <span>{children}</span>
    </span>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Badge = Badge;
}

if (typeof exports !== "undefined") {
  exports.Badge = Badge;
}

