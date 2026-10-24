
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, saveSession } from "@/lib/api";

const roleContent = {
  teacher: {
    label: "TEACHER REGISTRATION",
    heading: "Inspire minds.\nShape futures.",
    description:
      "Join your academic community and help students turn their effort into achievement.",
    color: "from-blue-600 to-indigo-700",
    accent: "bg-blue-100 text-blue-700",
  },
  student: {
    label: "STUDENT REGISTRATION",
    heading: "Your journey.\nYour achievements.",
    description:
      "Create your account, access your academic results, and keep moving toward your goals.",
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
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
          <path d="M6.5 12v4.2c3.5 2.6 7.5 2.6 11 0V12M21 10v6" />
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
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (role === "teacher") {
    return (
      <svg {...props}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 5.5V21M8 7h8M8 11h7" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
      <path d="M6.5 12v4.2c3.5 2.6 7.5 2.6 11 0V12M21 10v6" />
    </svg>
  );
}

function InputIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-5 w-5",
    "aria-hidden": true,
  };

  if (type === "user") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg {...props}>
        <rect x="4" y="10" width="16" height="11" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M8 7h8M8 11h7" />
    </svg>
  );
}

function FormField({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
  max,
  autoComplete,
  disabled,
  rightElement,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="group relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 transition group-focus-within:text-indigo-600 sm:left-4">
          <InputIcon type={icon} />
        </span>

        <input
          id={id}
          name={id}
          type={type}
          required={required}
          minLength={minLength}
          max={max}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:py-4 sm:pl-12 ${
            rightElement ? "pr-12" : "pr-4"
          }`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const params = useParams();
  const router = useRouter();

  const role = Array.isArray(params?.role)
    ? params.role[0]
    : params?.role;

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    dob: "",
    bachelor: "",
    major: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!["teacher", "student"].includes(role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Registration unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please select a valid registration type.
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
      const data = await api("/auth/register", {
        method: "POST",
        body: { ...form, role },
      });

      saveSession(data);
      router.push(`/${data.role}`);
    } catch (err) {
      setError(
        err?.message || "Registration failed. Please check your details."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding panel */}
        <section
          className={`relative hidden overflow-hidden bg-gradient-to-br ${content.color} p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16`}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-white/[0.06]" />

          <div className="relative z-10">
            <Brand light />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-xl py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-indigo-50">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {content.label}
            </div>

            <h1 className="mt-8 whitespace-pre-line text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl">
              {content.heading}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-indigo-100/90 xl:text-lg">
              {content.description}
            </p>

            <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-700">
                  <RoleIcon role={role} className="h-7 w-7" />
                </div>

                <div>
                  <p className="font-bold">One community. Many achievements.</p>
                  <p className="mt-1 text-sm text-indigo-100">
                    Your academic journey starts here.
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-white/15" />

              <div className="space-y-4">
                {[
                  "Personalized academic workspace",
                  "Convenient access to your account",
                  "Designed for your learning journey",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m5 12 4 4L19 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-indigo-50">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-indigo-100/75">
            <span>© {new Date().getFullYear()} Gradely</span>
            <span>Learn, grow, achieve.</span>
          </div>
        </section>

        {/* Registration form */}
        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-16">
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

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
            <div className="w-full max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm">
                <RoleIcon role={role} className="h-7 w-7" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Create your account
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Join Gradely<span className="text-indigo-600">.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Register as a {roleName.toLowerCase()}. Use the same details
                your administrator has on record.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                <span className="mt-0.5 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      d="M12 11v5m0-8h.01"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <p className="text-xs leading-5 text-indigo-900 sm:text-sm">
                  <span className="font-bold">Before you begin:</span> Your
                  name, father&apos;s name, date of birth, and email must match
                  the details saved by your administrator.
                </p>
              </div>

              <form onSubmit={submit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="name"
                    label="Full name"
                    icon="user"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={set("name")}
                    autoComplete="name"
                    disabled={busy}
                  />

                  <FormField
                    id="fatherName"
                    label="Father's name"
                    icon="user"
                    placeholder="Enter father's name"
                    value={form.fatherName}
                    onChange={set("fatherName")}
                    disabled={busy}
                  />
                </div>

                <FormField
                  id="dob"
                  label="Date of birth"
                  icon="calendar"
                  type="date"
                  value={form.dob}
                  onChange={set("dob")}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={busy}
                />

                {role === "teacher" && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="bachelor"
                      label="Bachelor degree"
                      icon="book"
                      placeholder="e.g. BSc, BA, BEd"
                      value={form.bachelor}
                      onChange={set("bachelor")}
                      disabled={busy}
                    />

                    <FormField
                      id="major"
                      label="Major / subject"
                      icon="book"
                      placeholder="e.g. Mathematics"
                      value={form.major}
                      onChange={set("major")}
                      disabled={busy}
                    />
                  </div>
                )}

                <FormField
                  id="email"
                  label="Email address"
                  icon="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                  disabled={busy}
                />

                <FormField
                  id="password"
                  label="Create password"
                  icon="lock"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={set("password")}
                  minLength={6}
                  autoComplete="new-password"
                  disabled={busy}
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="rounded-lg p-2 text-slate-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  }
                />

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

                <button
                  type="submit"
                  disabled={busy}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
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
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create {roleName.toLowerCase()} account
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

              <p className="mt-7 text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link
                  href={`/login/${role}`}
                  className="font-bold text-indigo-600 underline-offset-4 transition hover:text-indigo-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
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
