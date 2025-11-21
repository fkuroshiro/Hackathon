import API_URL from "../config/api";

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  return await res.json();
}
