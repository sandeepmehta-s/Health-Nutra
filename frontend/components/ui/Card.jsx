/**
 * Health Nutra - Card UI Components
 * Modular card container components with rounded-3xl borders and shadows.
 */

function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/80 shadow-sm transition-all duration-300 overflow-hidden ${hover ? "hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 hover:border-slate-300" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pb-4 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg font-black text-slate-900 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Card = Card;
  window.CardHeader = CardHeader;
  window.CardTitle = CardTitle;
  window.CardDescription = CardDescription;
  window.CardContent = CardContent;
  window.CardFooter = CardFooter;
}

if (typeof exports !== "undefined") {
  exports.Card = Card;
  exports.CardHeader = CardHeader;
  exports.CardTitle = CardTitle;
  exports.CardDescription = CardDescription;
  exports.CardContent = CardContent;
  exports.CardFooter = CardFooter;
}

