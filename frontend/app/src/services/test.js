import API_URL from "../config/api";

export async function testBackend() {
  console.log("Testing:", `${API_URL}/`);
  try {
    const res = await fetch(`${API_URL}/`);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
    return data;
  } catch (err) {
    console.log("ERROR:", err);
  }
}