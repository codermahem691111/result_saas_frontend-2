// Accepts "https://host", "https://host/" or "https://host/api" and always gives ".../api".
const cleanBase = (url, fallback) => {
  let base = String(url || fallback).trim().replace(/^:+/, "").replace(/\/+$/, "");
  if (!/\/api$/.test(base)) base += "/api";
  return base;
};
const API = cleanBase(process.env.NEXT_PUBLIC_API_URL, "https://result-saas-backend-1.onrender.com/");
const RESULT_API = cleanBase(process.env.NEXT_PUBLIC_RESULT_API_URL, "https://result-only.onrender.com/");

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export const getToken = () => getCookie("token");

export function saveSession({ token, role }) {
  const opts = "; path=/; max-age=86400; SameSite=Lax";
  document.cookie = `token=${encodeURIComponent(token)}${opts}`;
  document.cookie = `role=${role}${opts}`;
}

export function clearSession() {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
}

async function request(base, path, { method = "GET", body, isMain = false } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. It may be waking up, so please try again in a minute.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Login and register errors must be shown, never turned into a logout.
    const isAuthCall = path.startsWith("/auth/");
    if (res.status === 401 && token && !isAuthCall) {
      if (isMain) {
        clearSession();
        if (typeof window !== "undefined") window.location.href = "/";
      } else {
        throw new Error("The result service did not accept your login. Please log out and sign in again.");
      }
    }
    if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = (path, opts) => request(API, path, { ...opts, isMain: true }); // main API (auth, admin, profile)
export const resultApi = (path, opts) => request(RESULT_API, path, opts); // result service
