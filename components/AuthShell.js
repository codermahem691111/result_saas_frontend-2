import Link from "next/link";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-6 text-sm text-brand hover:underline">Back to portal</Link>
      <div className="rounded-2xl border border-slate-200 bg-chalk p-7 shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        <div className="mt-6 space-y-4">{children}</div>
      </div>
      {footer && <p className="mt-4 text-center text-sm text-slate-600">{footer}</p>}
    </main>
  );
}
