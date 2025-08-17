// client/src/utils/api.js
export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(path, { ...options, headers }); // 🚀 no BASE_URL
  const data = await res.json().catch(() => ({}));
  return { res, data };
}
