/**
 * Health Nutra - Button UI Component
 * Enterprise Tailwind CSS Button with loading states, variants, and icon support.
 */

function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const sizeStyles = {
    xs: "px-2.5 py-1 text-xs rounded-lg gap-1",
    sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5",
    xl: "px-8 py-4 text-lg rounded-2xl gap-3",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 text-white shadow-md shadow-brand-800/20 active:scale-[0.98]",
    secondary:
      "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md shadow-orange-600/20 active:scale-[0.98]",
    outline:
      "border-2 border-slate-200 hover:border-brand-600 hover:bg-brand-50/50 text-slate-700 hover:text-brand-800 active:scale-[0.98]",
    outlineBrand:
      "border-2 border-brand-600 text-brand-700 hover:bg-brand-50 active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-[0.98]",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    subtle:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-bold transition-all duration-200 ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${isDisabled ? "opacity-60 cursor-not-allowed transform-none" : "hover:-translate-y-0.5"} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && iconPosition === "left" && <Icon name={icon} className="w-4 h-4" />
      )}

      <span>{children}</span>

      {!loading && icon && iconPosition === "right" && (
        <Icon name={icon} className="w-4 h-4" />
      )}
    </button>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Button = Button;
}

if (typeof exports !== "undefined") {
  exports.Button = Button;
}

