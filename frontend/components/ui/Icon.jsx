/**
 * Health Nutra - Icon UI Component
 * Pure React SVG Icon renderer powered by Lucide icon definitions.
 * Eliminates DOM mutation errors (e.g. NotFoundError: removeChild) by rendering
 * SVG elements entirely within React Virtual DOM.
 */

function Icon({
  name,
  className = "w-4 h-4",
  size = 24,
  strokeWidth = 2,
  ...props
}) {
  if (!name || typeof name !== "string") {
    return null;
  }

  const lucide = typeof window !== "undefined" ? window.lucide : null;
  if (!lucide) {
    return null;
  }

  const raw = name.trim();
  // 1. Direct match
  let iconDef = lucide[raw] || (lucide.icons && lucide.icons[raw]);

  // 2. Kebab-case to PascalCase (e.g. "shopping-bag" -> "ShoppingBag", "trash-2" -> "Trash2", "x" -> "X")
  if (!iconDef) {
    const pascal = raw
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    iconDef = lucide[pascal] || (lucide.icons && lucide.icons[pascal]);

    // 3. Fallback case-insensitive search
    if (!iconDef && lucide.icons) {
      const lower = pascal.toLowerCase();
      for (const [key, val] of Object.entries(lucide.icons)) {
        if (key.toLowerCase() === lower) {
          iconDef = val;
          break;
        }
      }
    }
  }

  if (!iconDef || !Array.isArray(iconDef)) {
    // Graceful fallback SVG keeping layout dimensions
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {iconDef.map(([tag, attrs], index) => {
        const Tag = tag;
        return <Tag key={index} {...attrs} />;
      })}
    </svg>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Icon = Icon;
}

if (typeof exports !== "undefined") {
  exports.Icon = Icon;
}
