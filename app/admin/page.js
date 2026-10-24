
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearSession } from "@/lib/api";

const empty = {
  name: "",
  fatherName: "",
  dob: "",
  bachelor: "",
  major: "",
  email: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

function Icon({ children, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          {eyebrow}
        </p>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, detail, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${colors[color]}`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function Notice({ children, type = "error" }) {
  if (!children) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </label>
  );
}

function EmptyState({ icon = "📭", title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ClassesPanel({ classes, teachers, students, reload }) {
  const [className, setClassName] = useState("");
  const [subjectInputs, setSubjectInputs] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  async function run(fn) {
    setError("");
    setBusy(true);

    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function addClass(e) {
    e.preventDefault();

    if (!className.trim()) return;

    await run(async () => {
      await api("/admin/classes", {
        method: "POST",
        body: { name: className.trim() },
      });
      setClassName("");
    });
  }

  async function addSubject(e, id) {
    e.preventDefault();

    const name = (subjectInputs[id] || "").trim();
    if (!name) return;

    await run(async () => {
      await api(`/admin/classes/${id}/subjects`, {
        method: "POST",
        body: { name },
      });

      setSubjectInputs((prev) => ({ ...prev, [id]: "" }));
    });
  }

  async function removeClass(c) {
    if (
      !confirm(
        `Delete ${c.name} and its subjects? Its students will become unassigned.`
      )
    ) {
      return;
    }

    await run(() =>
      api(`/admin/classes/${c._id}`, { method: "DELETE" })
    );
  }

  async function removeSubject(c, s) {
    if (!confirm(`Remove the subject "${s.name}" from ${c.name}?`)) return;

    await run(() =>
      api(`/admin/classes/${c._id}/subjects/${s._id}`, {
        method: "DELETE",
      })
    );
  }

  async function setTeacher(c, s, teacherId) {
    await run(() =>
      api(`/admin/classes/${c._id}/subjects/${s._id}/teacher`, {
        method: "PUT",
        body: { teacherId: teacherId || null },
      })
    );
  }

  const studentCount = (id) =>
    students.filter((student) => String(student.classId || "") === String(id))
      .length;

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Academic setup"
        title="Classes & subjects"
        description="Create classes, organize subjects, and assign teachers."
        action={
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            {classes.length} classes
          </div>
        }
      />

      <Notice>{error}</Notice>

      <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <form
          onSubmit={addClass}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
              🏫
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Create a class</h3>
              <p className="text-xs text-slate-500">
                Start a new academic group
              </p>
            </div>
          </div>

          <FormField
            label="Class name"
            placeholder="e.g. Class 6"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={busy || !className.trim()}
            className={`${buttonPrimary} mt-4 w-full`}
          >
            <span>＋</span> Add class
          </button>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick overview
            </p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">Total students</span>
              <span className="font-bold text-slate-900">
                {students.length}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Available teachers</span>
              <span className="font-bold text-slate-900">
                {teachers.length}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Subjects</span>
              <span className="font-bold text-slate-900">
                {classes.reduce(
                  (total, c) => total + (c.subjects?.length || 0),
                  0
                )}
              </span>
            </div>
          </div>
        </form>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                className={`${inputClass} pl-10`}
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredClasses.map((c) => (
            <section
              key={c._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-indigo-100">
                    📚
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {studentCount(c._id)} students ·{" "}
                      {c.subjects?.length || 0} subjects
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeClass(c)}
                  disabled={busy}
                  className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:self-auto"
                >
                  Delete class
                </button>
              </div>

              <div className="p-5">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subjects & teacher assignments
                </h4>

                {!c.subjects?.length ? (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No subjects yet
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add a subject below to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {c.subjects.map((s) => (
                      <div
                        key={s._id}
                        className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm">
                            📖
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {s.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {s.teacher?.name || "No teacher assigned"}
                            </p>
                          </div>
                        </div>

                        <select
                          aria-label={`Teacher for ${s.name}`}
                          value={s.teacher?._id || ""}
                          disabled={busy}
                          onChange={(e) =>
                            setTeacher(c, s, e.target.value)
                          }
                          className={`${inputClass} sm:max-w-[220px]`}
                        >
                          <option value="">No teacher</option>
                          {teachers.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeSubject(c, s)}
                          className="self-start rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50 sm:self-auto"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => addSubject(e, c._id)}
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    required
                    className={inputClass}
                    placeholder="Enter a subject name, e.g. Mathematics"
                    value={subjectInputs[c._id] || ""}
                    onChange={(e) =>
                      setSubjectInputs((prev) => ({
                        ...prev,
                        [c._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="submit"
                    disabled={busy || !(subjectInputs[c._id] || "").trim()}
                    className={`${buttonSecondary} shrink-0`}
                  >
                    ＋ Add subject
                  </button>
                </form>
              </div>
            </section>
          ))}

          {filteredClasses.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white">
              <EmptyState
                icon="🏫"
                title="No classes found"
                description={
                  search
                    ? "Try another search term."
                    : "Create your first class using the form."
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const router = useRouter();

  const [tab, setTab] = useState("teacher");
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError("");

    try {
      const [m, c] = await Promise.all([
        api("/admin/members"),
        api("/admin/classes"),
      ]);

      setMembers(Array.isArray(m) ? m : []);
      setClasses(Array.isArray(c) ? c : []);
    } catch (e) {
      setError(e.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setForm(empty);
    setError("");
    setNotice("");
    setSearch("");
  }, [tab]);

  const teachers = useMemo(
    () => members.filter((m) => m.role === "teacher"),
    [members]
  );

  const students = useMemo(
    () => members.filter((m) => m.role === "student"),
    [members]
  );

  const registeredCount = members.filter((m) => m.registered).length;
  const waitingCount = members.length - registeredCount;

  const list = tab === "teacher" ? teachers : students;
  const label = tab === "teacher" ? "Teacher" : "Student";

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return list;

    return list.filter((m) =>
      [m.name, m.email, m.fatherName, m.bachelor, m.major]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [list, search]);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function add(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      await api("/admin/members", {
        method: "POST",
        body: { ...form, role: tab },
      });

      setForm(empty);
      setNotice(
        `${label} added successfully. They can now register.`
      );

      await load();
    } catch (e) {
      setError(e.message || `Could not add ${label.toLowerCase()}.`);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this person? They will lose access.")) return;

    setError("");
    setNotice("");

    try {
      await api(`/admin/members/${id}`, { method: "DELETE" });
      setNotice(`${label} deleted successfully.`);
      await load();
    } catch (e) {
      setError(e.message || "Could not delete this person.");
    }
  }

  async function changeClass(student, classId) {
    setError("");
    setNotice("");

    try {
      await api(`/admin/members/${student._id}/class`, {
        method: "PUT",
        body: { classId: classId || null },
      });

      setNotice(`Class assignment updated for ${student.name}.`);
      await load();
    } catch (e) {
      setError(e.message || "Could not update class assignment.");
    }
  }

  const teaches = (teacher) =>
    classes.flatMap((c) =>
      (c.subjects || [])
        .filter((s) => s.teacher?._id === teacher._id)
        .map((s) => `${c.name}: ${s.name}`)
    );

  function logout() {
    clearSession();
    router.push("/");
  }

  const tabs = [
    { id: "teacher", label: "Teachers", icon: "👨‍🏫", count: teachers.length },
    { id: "student", label: "Students", icon: "🎓", count: students.length },
    { id: "class", label: "Classes", icon: "🏫", count: classes.length },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/20">
              G
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Gradely
              </h1>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">
                SCHOOL MANAGEMENT
              </p>
            </div>
          </div>

          <div className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </div>

          <nav className="space-y-2" aria-label="Dashboard sections">
            {tabs.map((item) => {
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </span>
                  <span
                    className={`rounded-lg px-2 py-1 text-xs ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
              <div className="mb-2 text-xl">✨</div>
              <p className="text-sm font-bold">Keep Gradely organized</p>
              <p className="mt-1 text-xs leading-5 text-indigo-100">
                Manage your school members, classes, and teaching assignments.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                🛡️
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  Administrator
                </p>
                <p className="text-xs text-slate-500">Management access</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <Icon>↪</Icon> Log out
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-9">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-black text-white lg:hidden">
                  G
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    Gradely / Administration
                  </p>
                  <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                    Admin workspace
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 sm:block">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Management portal
                </div>
                <button
                  type="button"
                  onClick={load}
                  disabled={loading}
                  className={buttonSecondary}
                  title="Refresh dashboard data"
                >
                  <Icon>↻</Icon>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 lg:hidden"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
            {/* Welcome */}
            <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-900/10 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5" />

              <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    School administration
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Welcome to Gradely
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                    Manage your teachers, students, classes, and academic
                    structure from one place.
                  </p>
                </div>

                <div className="hidden shrink-0 text-7xl opacity-90 sm:block">
                  🎓
                </div>
              </div>
            </section>

            {/* Summary cards */}
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon="👨‍🏫"
                label="Total teachers"
                value={teachers.length}
                detail="Teachers in your school"
                color="indigo"
              />
              <StatCard
                icon="🎓"
                label="Total students"
                value={students.length}
                detail="Students in your school"
                color="cyan"
              />
              <StatCard
                icon="🏫"
                label="Total classes"
                value={classes.length}
                detail="Academic groups created"
                color="violet"
              />
              <StatCard
                icon="✓"
                label="Registered members"
                value={registeredCount}
                detail={`${waitingCount} awaiting registration`}
                color="emerald"
              />
            </section>

            <Notice>{error}</Notice>
            <Notice type="success">{notice}</Notice>

            {/* Mobile-friendly section navigation */}
            <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-xs font-bold transition sm:flex-row sm:text-sm ${
                    tab === item.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="text-[10px] opacity-80">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                <p className="text-sm font-medium text-slate-600">
                  Loading your school data...
                </p>
              </div>
            ) : tab === "class" ? (
              <ClassesPanel
                classes={classes}
                teachers={teachers}
                students={students}
                reload={load}
              />
            ) : (
              <div className="grid items-start gap-6 2xl:grid-cols-[330px_minmax(0,1fr)]">
                {/* Add member form */}
                <form
                  onSubmit={add}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                      {tab === "teacher" ? "👨‍🏫" : "🎓"}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Add {label.toLowerCase()}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Add a member to your school
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      label="Full name"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                    <FormField
                      label="Father's name"
                      value={form.fatherName}
                      onChange={set("fatherName")}
                      required
                    />
                    <FormField
                      label="Date of birth"
                      type="date"
                      value={form.dob}
                      onChange={set("dob")}
                      required
                    />

                    {tab === "teacher" && (
                      <>
                        <FormField
                          label="Bachelor degree"
                          value={form.bachelor}
                          onChange={set("bachelor")}
                          required
                        />
                        <FormField
                          label="Major / specialization"
                          value={form.major}
                          onChange={set("major")}
                          required
                        />
                      </>
                    )}

                    <FormField
                      label="Email address"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${buttonPrimary} mt-5 w-full`}
                  >
                    {submitting ? "Adding member..." : `＋ Add ${label}`}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                    The member can register using the details you provide.
                  </p>
                </form>

                {/* Member list */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <SectionTitle
                      eyebrow="Member directory"
                      title={`${label}s`}
                      description={`Manage and review your registered and pending ${label.toLowerCase()}s.`}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative min-w-0 flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                          ⌕
                        </span>
                        <input
                          className={`${inputClass} pl-10`}
                          placeholder={`Search ${label.toLowerCase()}s by name or email...`}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <span className="text-sm text-slate-500">
                        Showing{" "}
                        <strong className="text-slate-800">
                          {filteredList.length}
                        </strong>{" "}
                        of {list.length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-4 font-semibold">Member</th>
                          <th className="px-5 py-4 font-semibold">Father</th>
                          {tab === "teacher" && (
                            <th className="px-5 py-4 font-semibold">
                              Qualification
                            </th>
                          )}
                          {tab === "teacher" && (
                            <th className="px-5 py-4 font-semibold">
                              Teaching
                            </th>
                          )}
                          {tab === "student" && (
                            <th className="px-5 py-4 font-semibold">
                              Class assignment
                            </th>
                          )}
                          <th className="px-5 py-4 font-semibold">Status</th>
                          <th className="px-5 py-4 text-right font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredList.map((m) => {
                          const subjects = teaches(m);

                          return (
                            <tr
                              key={m._id}
                              className="transition hover:bg-slate-50/80"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                                    {(m.name || "?")
                                      .trim()
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-900">
                                      {m.name}
                                    </p>
                                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                                      {m.email}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                      DOB: {m.dob || "—"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-slate-600">
                                {m.fatherName || "—"}
                              </td>

                              {tab === "teacher" && (
                                <td className="px-5 py-4">
                                  <p className="font-medium text-slate-700">
                                    {m.bachelor || "—"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {m.major || "No major specified"}
                                  </p>
                                </td>
                              )}

                              {tab === "teacher" && (
                                <td className="px-5 py-4">
                                  {subjects.length ? (
                                    <div className="flex max-w-[220px] flex-wrap gap-1.5">
                                      {subjects.map((subject) => (
                                        <span
                                          key={subject}
                                          className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                                        >
                                          {subject}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400">
                                      Not assigned
                                    </span>
                                  )}
                                </td>
                              )}

                              {tab === "student" && (
                                <td className="px-5 py-4">
                                  <select
                                    aria-label={`Class for ${m.name}`}
                                    value={m.classId || ""}
                                    onChange={(e) =>
                                      changeClass(m, e.target.value)
                                    }
                                    className="max-w-[190px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
                                  >
                                    <option value="">Not assigned</option>
                                    {classes.map((c) => (
                                      <option key={c._id} value={c._id}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              )}

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                                    m.registered
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      m.registered
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
                                    }`}
                                  />
                                  {m.registered ? "Registered" : "Waiting"}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => remove(m._id)}
                                  className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredList.length === 0 && (
                    <EmptyState
                      icon={search ? "🔎" : tab === "teacher" ? "👨‍🏫" : "🎓"}
                      title={
                        search
                          ? "No matching members"
                          : `No ${label.toLowerCase()}s yet`
                      }
                      description={
                        search
                          ? "Try a different name, email, or search term."
                          : `Use the form to add your first ${label.toLowerCase()}.`
                      }
                    />
                  )}

                  <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {label} directory · {filteredList.length} displayed
                    </span>
                    <span>Gradely administration</span>
                  </div>
                </section>
              </div>
            )}

            <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center">
              <p>© {new Date().getFullYear()} Gradely School Management</p>
              <p>Admin workspace</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
