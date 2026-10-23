// Central API layer. Every call goes through request(), which adds the
// x-api-key header that the Express auth middleware checks on /api/products.
export const API_KEY = "secret123";

export async function request(path, options = {}) {
  const { useKey = true, ...rest } = options;
  const res = await fetch(`/api${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(useKey ? { "x-api-key": API_KEY } : {}),
      ...(rest.headers || {}),
    },
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
}

export const api = {
  health: () => request("/health"),

  getUsers: (search = "") => request(`/users${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  addUser: (u) => request("/users", { method: "POST", body: JSON.stringify(u) }),
  updateUser: (id, u) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(u) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  getProducts: () => request("/products"),
  addProduct: (p) => request("/products", { method: "POST", body: JSON.stringify(p) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  getLogs: () => request("/logs"),
  clearLogs: () => request("/logs", { method: "DELETE" }),
};
