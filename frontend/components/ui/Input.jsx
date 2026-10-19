/**
 * Health Nutra - Input UI Components
 * Modular input fields with icons, labels, validation styles, and clear buttons.
 */

function Input({
  label,
  icon = null,
  error = null,
  helperText = null,
  className = "",
  id,
  type = "text",
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-2xl">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <i data-lucide={icon} className="w-4 h-4"></i>
          </div>
        )}
        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-2xl border bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ${
            icon ? "pl-10 pr-4" : "px-4"
          } py-3 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/10"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search formulations, ingredients, benefits...",
  className = "",
  ...props
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-700">
        <i data-lucide="search" className="w-5 h-5"></i>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 shadow-sm transition-all"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <i data-lucide="x" className="w-3.5 h-3.5"></i>
          </div>
        </button>
      )}
    </div>
  );
}

function TextArea({
  label,
  error = null,
  helperText = null,
  className = "",
  rows = 4,
  required = false,
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full p-4 rounded-2xl border bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/10"
        } ${className}`}
        {...props}
      ></textarea>
      {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

function Select({
  label,
  options = [],
  error = null,
  helperText = null,
  className = "",
  required = false,
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          required={required}
          className={`w-full px-4 py-3 appearance-none rounded-2xl border bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-500 focus:ring-brand-500/10"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <i data-lucide="chevron-down" className="w-4 h-4"></i>
        </div>
      </div>
      {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

// Global browser registration
if (typeof window !== "undefined") {
  window.Input = Input;
  window.SearchInput = SearchInput;
  window.TextArea = TextArea;
  window.Select = Select;
}

if (typeof exports !== "undefined") {
  exports.Input = Input;
  exports.SearchInput = SearchInput;
  exports.TextArea = TextArea;
  exports.Select = Select;
}

