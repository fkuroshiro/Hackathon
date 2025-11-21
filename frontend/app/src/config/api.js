// api.js
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.10.1.51:8000"; // ⬅️ change IP/port if needed

async function request(path, { method = "GET", body, headers } = {}) {
  const url = `${API_URL}${path}`;

  const config = {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  let res;
  try {
    res = await fetch(url, config);
  } catch (err) {
    console.error(`Network error calling ${url}`, err);
    throw new Error("Network request failed");
  }

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error(`Failed to parse JSON from ${url}:`, text);
      throw new Error("Invalid JSON response from server");
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get(path, options) {
    return request(path, { ...options, method: "GET" });
  },
  post(path, body, options) {
    return request(path, { ...options, method: "POST", body });
  },
};

export default api;
