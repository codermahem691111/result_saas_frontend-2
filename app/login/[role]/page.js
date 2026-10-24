
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, saveSession } from "@/lib/api";

const roleContent = {
  admin: {
    eyebrow: "ADMINISTRATION PORTAL",
    heading: "Your institution.\nUnder your control.",
    description:
      "Manage your academic community, oversee registrations, and keep your institution running smoothly.",
    icon: "shield",
    color: "from-violet-600 to-indigo-700",
    accent: "bg-violet-100 text-violet-700",
  },
  teacher: {
    eyebrow: "TEACHER PORTAL",
    heading: "Make every\nresult meaningful.",
    description:
      "Manage your students, support their progress, and turn academic performance into a clearer picture of success.",
    icon: "book",
    color: "from-blue-600 to-indigo-700",
    accent: "bg-blue-100 text-blue-700",
  },
  student: {
    eyebrow: "STUDENT PORTAL",
    heading: "Your hard work.\nYour achievements.",
    description:
      "Access your academic results, follow your progress, and celebrate every step of your learning journey.",
    icon: "graduation",
    color: "from-indigo-600 to-violet-700",
    accent: "bg-indigo-100 text-indigo-700",
  },
};

function Brand({ light = false }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          light ? "bg-white/15 text-white" : "bg-indigo-600 text-white"
        } shadow-lg`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 12v4.2c3.5 2.6 7.5 2.6 11 0V12M21 10v6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span>
        <span
          className={`block text-xl font-extrabold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Gradely<span className="text-indigo-500">.</span>
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${
            light ? "text-indigo-100" : "text-slate-500"
          }`}
        >
          Academic excellence
        </span>
      </span>
    </Link>
  );
}

function RoleIcon({ role, className = "h-6 w-6" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (role === "admin") {
    return (
      <svg {...common}>
        <path d="M12 3 20 6v5c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (role === "teacher") {
    return (
      <svg {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 5.5V21M8 7h8M8 11h7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
      <path d="M6.5 12v4.2c3.5 2.6 7.5 2.6 11 0V12M21 10v6" />
    </svg>
  );
}

function InputIcon({ type }) {
  if (type === "email") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </svg>
  );
}

export default function Login() {
  const params = useParams();
  const router = useRouter();

  const role = Array.isArray(params?.role)
    ? params.role[0]
    : params?.role;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!["admin", "teacher", "student"].includes(role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Login page not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please choose a valid Gradely account type.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const content = roleContent[role];
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  const set = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const path =
        role === "admin" ? "/auth/admin/login" : "/auth/login";

      const data = await api(path, {
        method: "POST",
        body: {
          ...form,
          role,
        },
      });

      saveSession(data);
      router.push(`/${data.role}`);
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Gradely branding panel */}
        <section
          className={`relative hidden overflow-hidden bg-gradient-to-br ${content.color} p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16`}
        >
          {/* Decorative background shapes */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-white/[0.06]" />

          <div className="relative z-10">
            <Brand light />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-xl py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-indigo-50">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {content.eyebrow}
            </div>

            <h1 className="mt-8 whitespace-pre-line text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl">
              {content.heading}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-indigo-100/90 xl:text-lg">
              {content.description}
            </p>

            {/* Academic preview card */}
            <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-indigo-950/10 backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-700">
                    <RoleIcon role={role} className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Welcome to Gradely</p>
                    <p className="mt-1 text-xs text-indigo-100">
                      Your academic workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-300/15 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                  Secure access
                </span>
              </div>

              <div className="my-5 h-px bg-white/15" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["01", "Sign in"],
                  ["02", "Explore"],
                  ["03", "Succeed"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="rounded-2xl bg-white/[0.07] px-3 py-4"
                  >
                    <p className="text-xs font-bold text-indigo-200">
                      {number}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-indigo-100/75">
            <span>© {new Date().getFullYear()} Gradely</span>
            <span>Built for better learning</span>
          </div>
        </section>

        {/* Right: Login form */}
        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          <header className="flex items-center justify-between">
            <div className="lg:hidden">
              <Brand />
            </div>

            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-indigo-700"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="m15 18-6-6 6-6M9 12h12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Home
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${content.accent} shadow-sm`}
              >
                <RoleIcon role={role} className="h-7 w-7" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                {role} account
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome back<span className="text-indigo-600">.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Sign in to your {roleName.toLowerCase()} account to continue
                to your Gradely dashboard.
              </p>

              <form onSubmit={submit} className="mt-9 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition group-focus-within:text-indigo-600">
                      <InputIcon type="email" />
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={set("email")}
                      disabled={busy}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <span className="text-xs font-medium text-slate-400">
                      Keep it secure
                    </span>
                  </div>

                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition group-focus-within:text-indigo-600">
                      <InputIcon type="password" />
                    </span>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        role === "admin" ? "current-password" : "current-password"
                      }
                      placeholder="Enter your password"
                      required
                      value={form.password}
                      onChange={set("password")}
                      disabled={busy}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-3 flex items-center rounded-lg px-2 text-slate-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.8M6.2 6.2C4.1 7.6 3 10 3 12c0 0 3.5 7 9 7 1 0 2-.2 2.9-.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path
                        d="M12 8v4m0 4h.01"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={busy}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {busy ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity=".25"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign in to {roleName}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 12h14m-6-6 6 6-6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {role !== "admin" && (
                <p className="mt-7 text-center text-sm text-slate-500">
                  New to Gradely?{" "}
                  <Link
                    href={`/register/${role}`}
                    className="font-bold text-indigo-600 underline-offset-4 transition hover:text-indigo-800 hover:underline"
                  >
                    Create your account
                  </Link>
                </p>
              )}

              <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <span>Secure sign-in to your Gradely account</span>
              </div>
            </div>
          </div>

          <footer className="pb-2 pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Gradely. Learn, grow, achieve.
          </footer>
        </section>
      </div>
    </main>
  );
}
