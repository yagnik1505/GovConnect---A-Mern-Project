export const BASE_URL = "http://localhost:5000"; // adjust URL if needed

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  return { res, data };
}
