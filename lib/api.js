// Accepts "https://host", "https://host/" or "https://host/api" and always gives ".../api".
const cleanBase = (url, fallback) => {
  let base = String(url || fallback).trim().replace(/^:+/, "").replace(/\/+$/, "");
  if (!/\/api$/.test(base)) base += "/api";
  return base;
};
const API = cleanBase(process.env.NEXT_PUBLIC_API_URL, "http://localhost:5000/api");
const RESULT_API = cleanBase(process.env.NEXT_PUBLIC_RESULT_API_URL, "http://localhost:5100/api");

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

async function request(base, path, { method = "GET", body } = {}) {
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
    throw new Error("Cannot reach the server. Please try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      clearSession();
      if (typeof window !== "undefined") window.location.href = "/";
    }
    if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = (path, opts) => request(API, path, opts); // main API (auth, admin, profile)
export const resultApi = (path, opts) => request(RESULT_API, path, opts); // result service (via load balancer)
