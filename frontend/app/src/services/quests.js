// src/services/quests.js
import API_URL from "../config/api";

export async function getQuests() {
  const res = await fetch(`${API_URL}/quests/`);

  if (!res.ok) {
    throw new Error(`Failed to load quests (status ${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
