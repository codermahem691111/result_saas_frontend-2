"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, resultApi, clearSession } from "@/lib/api";

const gradeStyle = {
  "A+": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  A: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  B: "bg-blue-50 text-blue-700 ring-blue-200",
  C: "bg-amber-50 text-amber-700 ring-amber-200",
  D: "bg-orange-50 text-orange-700 ring-orange-200",
  F: "bg-rose-50 text-rose-700 ring-rose-200",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

function Notice({ children, type = "error" }) {
  if (!children) return null;
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function Grade({ g }) {
  if (!g) return <span className="text-slate-400">—</span>;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${gradeStyle[g] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
      {g}
    </span>
  );
}

function EmptyState({ icon = "📭", title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">{icon}</div>
      <h3 className="font-semibold text-slate-800">{title || children}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</p>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function LoadingCard({ label = "Loading your data..." }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

/* ---------------- Student: view results ---------------- */

function StudentResult() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setBusy(true);
    setError("");
    return resultApi("/results/me")
      .then(setData)
      .catch((e) => setError(e.message || "Could not load your result."))
      .finally(() => setBusy(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !data) return <Notice>{error}</Notice>;
  if (!data) return <LoadingCard label="Loading your result..." />;

  if (!data.className) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EmptyState icon="🏫" title="No class assigned yet" description="Your class and subjects will appear here after the school administrator assigns you to a class." />
      </div>
    );
  }

  const { overall, subjects = [], meta = {} } = data;

  return (
    <div className="space-y-6">
      <Notice>{error}</Notice>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[30px] border-white/10" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Academic overview
            </div>
            <p className="text-sm font-medium text-indigo-100">{data.className}</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {overall ? `${overall.percentage}%` : "—"}
            </p>
            <p className="mt-2 text-sm text-indigo-100">
              {overall ? `${overall.obtained} of ${overall.total} marks obtained` : "No marks have been entered yet."}
            </p>
          </div>
          <div className="flex items-center gap-4 self-start rounded-2xl border border-white/15 bg-white/10 p-4 sm:self-auto">
            <div>
              <p className="text-xs font-medium text-indigo-100">Overall grade</p>
              <p className="mt-1 text-3xl font-extrabold">{overall?.grade || "—"}</p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <SectionHeading
            eyebrow="Academic performance"
            title="Subject results"
            description="Review your midterm, final, and overall marks."
            action={<span className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">{subjects.length} subjects</span>}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Subject</th>
                <th className="px-5 py-4 font-semibold">Midterm</th>
                <th className="px-5 py-4 font-semibold">Final</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Percentage</th>
                <th className="px-5 py-4 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => (
                <tr key={s.subject} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-semibold text-slate-800">{s.subject}</td>
                  <td className="px-5 py-4 text-slate-600">{s.midterm ? `${s.midterm.obtained} / ${s.midterm.total}` : "—"}</td>
                  <td className="px-5 py-4 text-slate-600">{s.final ? `${s.final.obtained} / ${s.final.total}` : "—"}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{s.total ? `${s.obtained} / ${s.total}` : "—"}</td>
                  <td className="px-5 py-4 text-slate-600">{s.percentage != null ? `${s.percentage}%` : "—"}</td>
                  <td className="px-5 py-4"><Grade g={s.grade} /></td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr><td colSpan={6}><EmptyState icon="📘" title="No subjects available" description="No subjects have been added to your class yet." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Updated {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"}{meta.servedBy ? ` · Served by ${meta.servedBy}` : ""}{meta.cache ? ` · Cache ${meta.cache}` : ""}</span>
          <button type="button" className={secondaryButton} onClick={load} disabled={busy}>{busy ? "Refreshing..." : "↻ Refresh results"}</button>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Teacher: enter marks ---------------- */

function TeacherMarks() {
  const [items, setItems] = useState(null);
  const [pick, setPick] = useState("");
  const [exam, setExam] = useState("midterm");
  const [total, setTotal] = useState("100");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    resultApi("/results/teacher/assignments")
      .then((assignments) => {
        setItems(assignments);
        if (assignments[0]) setPick(`${assignments[0].classId}:${assignments[0].subjectId}`);
      })
      .catch((e) => setError(e.message || "Could not load teaching assignments."));
  }, []);

  useEffect(() => {
    if (!pick) return;
    const [classId, subjectId] = pick.split(":");
    let active = true;
    setLoading(true);
    setError("");
    setNotice("");

    resultApi(`/results/teacher/sheet?classId=${classId}&subjectId=${subjectId}&exam=${exam}`)
      .then((sheet) => {
        if (!active) return;
        setRows(sheet.students.map((x) => ({
          ...x,
          had: x.obtained !== null,
          obtained: x.obtained ?? "",
        })));
        if (sheet.total) setTotal(String(sheet.total));
      })
      .catch((e) => {
        if (active) setError(e.message || "Could not load the marks sheet.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [pick, exam]);

  const max = Number(total);
  const totalOk = Number.isFinite(max) && max > 0;
  const isBad = (value) => value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > max);
  const anyBad = rows.some((r) => isBad(r.obtained));
  const entered = rows.filter((r) => r.obtained !== "").length;
  const selected = (items || []).find((i) => `${i.classId}:${i.subjectId}` === pick);

  async function save() {
    if (!pick || !totalOk || anyBad) return;
    const [classId, subjectId] = pick.split(":");
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await resultApi("/results/teacher/marks", {
        method: "PUT",
        body: {
          classId,
          subjectId,
          exam,
          total: max,
          entries: rows
            .filter((x) => x.obtained !== "" || x.had)
            .map((x) => ({
              studentId: x._id,
              obtained: x.obtained === "" ? null : Number(x.obtained),
            })),
        },
      });

      setRows((current) => current.map((x) => ({ ...x, had: x.obtained !== "" })));
      setNotice(
        response.eventPublished
          ? "Marks saved. Students can see the updated results right away."
          : "Marks saved. Live refresh may be delayed, so students could see old marks for a few minutes."
      );
    } catch (e) {
      setError(e.message || "Could not save marks.");
    } finally {
      setSaving(false);
    }
  }

  if (items === null && !error) return <LoadingCard label="Loading your teaching assignments..." />;

  if (items && items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EmptyState icon="📚" title="No teaching assignments yet" description="Ask your school administrator to assign you a class and subject." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Teacher workspace" title="Enter student marks" description="Choose a class and exam, enter scores, then save your marks." />
      <Notice>{error}</Notice>
      <Notice type="success">{notice}</Notice>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">📝</div>
          <div>
            <h3 className="font-bold text-slate-900">Marks sheet settings</h3>
            <p className="text-xs text-slate-500">Select your teaching assignment and exam type.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Class and subject</span>
            <select value={pick} onChange={(e) => setPick(e.target.value)} className={inputClass}>
              {(items || []).map((item) => (
                <option key={`${item.classId}:${item.subjectId}`} value={`${item.classId}:${item.subjectId}`}>
                  {item.className}: {item.subjectName}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Exam type</span>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {["midterm", "final"].map((value) => (
                <button key={value} type="button" aria-pressed={exam === value} onClick={() => setExam(value)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${exam === value ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Maximum marks</span>
            <input type="number" min="1" step="any" value={total} onChange={(e) => setTotal(e.target.value)} className={`${inputClass} md:w-36`} />
          </label>
        </div>

        {selected && (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            <span>📘</span>
            <span className="font-semibold">{selected.className}</span>
            <span className="text-indigo-300">/</span>
            <span>{selected.subjectName}</span>
            <span className="ml-auto rounded-lg bg-white px-2.5 py-1 text-xs font-bold capitalize">{exam}</span>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="font-bold text-slate-900">Student marks</h3>
            <p className="mt-1 text-sm text-slate-500">Leave a field empty to clear a previously saved mark.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">{entered} / {rows.length} entered</span>
            {loading && <span className="text-xs font-medium text-indigo-600">Loading...</span>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Father's name</th>
                <th className="px-5 py-4 font-semibold">Marks {totalOk ? `(out of ${max})` : ""}</th>
                <th className="px-5 py-4 font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row._id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">{(row.name || "?").trim().charAt(0).toUpperCase()}</div>
                      <span className="font-semibold text-slate-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{row.fatherName || "—"}</td>
                  <td className="px-5 py-3.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max={totalOk ? max : undefined}
                      step="any"
                      aria-label={`Marks for ${row.name}`}
                      value={row.obtained}
                      onChange={(e) => setRows((current) => current.map((x) => x._id === row._id ? { ...x, obtained: e.target.value } : x))}
                      className={`w-28 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-4 ${isBad(row.obtained) ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/10"}`}
                    />
                    {isBad(row.obtained) && <p className="mt-1 text-xs text-rose-600">Enter a value from 0 to {max}.</p>}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-600">
                    {row.obtained !== "" && totalOk && !isBad(row.obtained) ? `${((Number(row.obtained) / max) * 100).toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={4}><EmptyState icon="🎓" title="No students in this class" description="Students assigned to this class will appear here." /></td></tr>
              )}
              {loading && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">Loading student marks...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-5 text-slate-500">Check all scores before saving. Marks must be between 0 and the maximum marks.</p>
          <button type="button" onClick={save} disabled={saving || loading || !totalOk || anyBad || rows.length === 0 || !pick} className={primaryButton}>
            {saving ? "Saving marks..." : "✓ Save marks"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Profile details ---------------- */

function ProfileDetails({ role, me }) {
  const rows = [
    ["Full name", me.name],
    ["Father's name", me.fatherName],
    ["Date of birth", me.dob],
    ...(role === "teacher" ? [["Bachelor degree", me.bachelor], ["Major", me.major]] : []),
    ["Email address", me.email],
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Account settings" title="My profile" description="Your personal information and school assignments." />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-violet-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-extrabold text-white shadow-lg shadow-indigo-600/20">
            {(me.name || "?").trim().charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{me.name}</h3>
            <p className="mt-1 text-sm capitalize text-slate-500">{role} account · Gradely</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4 sm:px-6">
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="break-words text-sm font-semibold text-slate-800">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      {role === "student" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading eyebrow="Academic information" title="My class" description="Your assigned class and available subjects." />
          {!me.classInfo ? (
            <EmptyState icon="🏫" title="No class assigned" description="Your class information will appear after the administrator assigns you." />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Assigned class</p>
                  <p className="font-bold text-indigo-900">{me.classInfo.name}</p>
                </div>
              </div>
              {(me.classInfo.subjects || []).length === 0 ? (
                <p className="text-sm text-slate-500">No subjects have been added to this class yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {me.classInfo.subjects.map((subject) => (
                    <div key={subject.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">📖</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{subject.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{subject.teacher ? subject.teacher.name : "Teacher not assigned"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {role === "teacher" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading eyebrow="Teaching information" title="My classes" description="Classes and subjects assigned to you." />
          {(me.assignments || []).length === 0 ? (
            <EmptyState icon="📚" title="No teaching assignments" description="Ask the administrator to assign you to a class and subject." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {me.assignments.map((assignment) => (
                <div key={assignment.className} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">🏫</span>
                    <div>
                      <p className="font-bold text-slate-800">{assignment.className}</p>
                      <p className="text-xs text-slate-500">Assigned class</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(assignment.subjects || []).map((subject) => (
                      <span key={subject} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{subject}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ---------------- Dashboard shell ---------------- */

export default function Profile({ role }) {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("work");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    api("/me")
      .then(setMe)
      .catch((e) => setError(e.message || "Could not load your profile."))
      .finally(() => setProfileLoading(false));
  }, []);

  const teacher = role === "teacher";
  const navItems = [
    { id: "work", label: teacher ? "Enter marks" : "My result", icon: teacher ? "📝" : "📊" },
    { id: "profile", label: "My profile", icon: "👤" },
  ];

  function logout() {
    clearSession();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-600/20">G</div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Gradely</h1>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">SCHOOL MANAGEMENT</p>
            </div>
          </div>

          <div className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</div>
          <nav className="space-y-2" aria-label="Portal navigation">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${tab === item.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
              <div className="mb-2 text-xl">✨</div>
              <p className="text-sm font-bold">Your learning workspace</p>
              <p className="mt-1 text-xs leading-5 text-indigo-100">Check your progress and keep your academic work organized.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">{teacher ? "👨‍🏫" : "🎓"}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{me?.name || (teacher ? "Teacher" : "Student")}</p>
                <p className="text-xs capitalize text-slate-500">{role} portal</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
              <span>↪</span> Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-9">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-black text-white lg:hidden">G</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">Gradely / {teacher ? "Teacher" : "Student"} portal</p>
                  <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{tab === "work" ? (teacher ? "Teaching workspace" : "Academic results") : "Your profile"}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium capitalize text-slate-600 sm:block">{role} account</span>
                <button type="button" onClick={logout} className={`${secondaryButton} lg:hidden`}>Logout</button>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
            <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-900/10 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {teacher ? "Teacher workspace" : "Student workspace"}
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome{me?.name ? `, ${me.name}` : " to Gradely"}</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                    {teacher ? "Manage your class marks and keep student assessments up to date." : "View your academic performance and keep track of your results."}
                  </p>
                </div>
                <div className="hidden shrink-0 text-7xl opacity-90 sm:block">{teacher ? "📝" : "🎓"}</div>
              </div>
            </section>

            {error && <div className="mb-5"><Notice>{error}</Notice></div>}

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
              {navItems.map((item) => (
                <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${tab === item.id ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>

            {profileLoading ? (
              <LoadingCard label="Loading your profile..." />
            ) : tab === "work" ? (
              teacher ? <TeacherMarks /> : <StudentResult />
            ) : me ? (
              <ProfileDetails role={role} me={me} />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6"><Notice>Profile details are not available.</Notice></div>
            )}

            <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center">
              <p>© {new Date().getFullYear()} Gradely School Management</p>
              <p>Secure school portal</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
