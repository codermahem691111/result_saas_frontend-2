
import Link from "next/link";

const groups = [
  {
    role: "student",
    title: "Student",
    description:
      "Check your academic results, explore your progress, and celebrate every achievement.",
    action: "Student login",
    register: true,
    icon: "student",
    color: "from-indigo-500 to-violet-600",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    number: "01",
  },
  {
    role: "teacher",
    title: "Teacher",
    description:
      "Access your academic workspace and help students on their learning journey.",
    action: "Teacher login",
    register: true,
    icon: "teacher",
    color: "from-cyan-500 to-blue-600",
    light: "bg-cyan-50",
    text: "text-cyan-700",
    number: "02",
  },
  {
    role: "admin",
    title: "Administrator",
    description:
      "Manage student accounts, teachers, and your school's academic records.",
    action: "Admin login",
    register: false,
    icon: "admin",
    color: "from-amber-400 to-orange-500",
    light: "bg-amber-50",
    text: "text-amber-700",
    number: "03",
  },
];

function RoleIcon({ type }) {
  if (type === "student") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M12 3 2.5 8l9.5 5 9.5-5L12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 10.2v5.2c3.4 3 7.6 3 11 0v-5.2M21.5 8v6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "teacher") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <rect
          x="3"
          y="4"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 21h8m-4-4v4M7 9h4m-4 4h7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-lg shadow-indigo-200">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 11h6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <span className="block text-2xl font-black tracking-tight text-[#171936]">
          grade<span className="text-indigo-600">ly</span>
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.23em] text-slate-500">
          Your academic space
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F9FE] text-[#171936]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-[120px]" />
        <div className="absolute -left-40 top-[500px] h-[400px] w-[400px] rounded-full bg-violet-200/30 blur-[100px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <BrandLogo />

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>
            <a href="#portals" className="transition hover:text-indigo-600">
              Portals
            </a>
            <a href="#about" className="transition hover:text-indigo-600">
              About
            </a>
          </div>

          <Link
            href="/login/student"
            className="rounded-xl bg-[#171936] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300/50 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:px-5"
          >
            Get started <span className="ml-1">↗</span>
          </Link>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-28 lg:pt-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            A smarter way to follow your results
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Your hard work.
            <br />
            Your results.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              Your future.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Welcome to Gradely, your all-in-one academic result portal.
            Access published results, follow your academic journey, and
            keep moving toward your goals.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login/student"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-300"
            >
              Check your results
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>

            <a
              href="#portals"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              Explore the portal <span>↓</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            {["Easy access", "Secure sign-in", "One academic space"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    ✓
                  </span>
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Academic preview */}
        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div className="absolute -right-4 top-8 h-32 w-32 rounded-full bg-violet-300/40 blur-3xl" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-cyan-200/50 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white bg-white/80 p-3 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl transition duration-500 hover:-translate-y-1 sm:p-5">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#F8F9FF]">
              <div className="bg-gradient-to-br from-[#24234F] via-indigo-800 to-[#5144A7] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-indigo-200">
                      YOUR ACADEMIC OVERVIEW
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Keep reaching higher.
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl">
                    ✦
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm text-indigo-200">
                    Your next achievement starts here
                  </p>
                  <p className="mt-3 text-2xl font-bold tracking-tight">
                    Stay curious.
                  </p>
                  <p className="mt-1 text-sm text-indigo-200">
                    Stay consistent. Grow every day.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Your academic space</h3>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    Gradely
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                      ▤
                    </div>
                    <p className="mt-4 text-sm font-bold">Exam results</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Find your published grades
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                      ↗
                    </div>
                    <p className="mt-4 text-sm font-bold">Progress</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Follow your learning journey
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-indigo-600 shadow-sm">
                    ✦
                  </div>
                  <div>
                    <p className="text-sm font-bold">Every step counts</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Your future is built one day at a time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-24 hidden items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-xl shadow-slate-200/70 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
              ✓
            </div>
            <div>
              <p className="text-sm font-bold">Your journey</p>
              <p className="text-xs text-slate-500">Starts with one step</p>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-white bg-white px-5 py-4 shadow-xl shadow-slate-200/70 sm:block">
            <p className="text-xs font-medium text-slate-500">
              BUILT FOR LEARNING
            </p>
            <p className="mt-1 text-lg font-black text-indigo-600">
              Learn. Achieve. Repeat.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-y border-slate-200/70 bg-white/80"
      >
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            {
              icon: "↗",
              title: "Results made accessible",
              description:
                "Find your published academic results in one place.",
            },
            {
              icon: "◎",
              title: "Designed for everyone",
              description:
                "Dedicated portals for students, teachers, and admins.",
            },
            {
              icon: "◇",
              title: "Access with confidence",
              description:
                "Sign in using the account provided by your school.",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role selection */}
      <section
        id="portals"
        className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
            Choose your portal
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            One platform.
            <br />
            <span className="text-indigo-600">Three ways to grow.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
            Choose the portal that matches your role and get straight to
            what matters.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.role}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/70 sm:p-8"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${group.color}`}
              />

              <div className="flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${group.light} ${group.text} transition duration-300 group-hover:scale-110`}
                >
                  <RoleIcon type={group.icon} />
                </div>
                <span className="text-sm font-bold tracking-widest text-slate-300">
                  {group.number}
                </span>
              </div>

              <h3 className="mt-7 text-2xl font-extrabold tracking-tight">
                {group.title}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-500">
                {group.description}
              </p>

              <div className="my-6 h-px bg-slate-100" />

              <div className="mt-auto space-y-3">
                <Link
                  href={`/login/${group.role}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${group.color} px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105`}
                >
                  {group.action}
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                {group.register ? (
                  <Link
                    href={`/register/${group.role}`}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    Create your account
                  </Link>
                ) : (
                  <p className="py-3 text-center text-xs leading-5 text-slate-400">
                    Restricted access for authorized administrators
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-9 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-center sm:flex-row sm:px-7 sm:text-left">
          <div>
            <p className="font-bold">New to Gradely?</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your school administrator must add your account before you
              can register.
            </p>
          </div>

          <Link
            href="/login/student"
            className="shrink-0 text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
          >
            Go to student login →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="relative z-10 border-t border-slate-200/80 bg-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-8 lg:px-12">
          <BrandLogo />

          <p className="text-center text-xs leading-6 text-slate-500">
            Your academic journey, all in one place.
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Gradely. Built for learning.
          </p>
        </div>
      </footer>
    </main>
  );
}
