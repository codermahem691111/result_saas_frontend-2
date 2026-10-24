
const API = process.env.NEXT_PUBLIC_API_URL;
const RESULT_API = process.env.NEXT_PUBLIC_RESULT_API_URL;

function getCookie(name) {
  if (typeof document === "undefined") return null;

  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );

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
  if (!base) {
    throw new Error("API URL is missing. Check your environment variables.");
  }

  // Remove trailing slashes from the base and leading slashes from the path.
  const cleanBase = base.trim().replace(/\/+$/, "");
  const cleanPath = String(path).replace(/^\/+/, "");
  const url = `${cleanBase}/${cleanPath}`;

  const token = getToken();
  let res;

  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token) {
      clearSession();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    if (res.status === 429) {
      throw new Error("Too many requests. Please wait a moment.");
    }

    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

// Main API: authentication, admin, and profile
export const api = (path, opts) => request(API, path, opts);

// Result API: result service / load balancer
export const resultApi = (path, opts) =>
  request(RESULT_API, path, opts);
