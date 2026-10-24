export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </label>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:bg-brand-dark"
      : "border border-slate-300 bg-white hover:bg-slate-100";
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export const ErrorMsg = ({ children }) =>
  children ? (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p>
  ) : null;
