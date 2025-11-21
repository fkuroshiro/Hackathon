// src/services/leaderboard.js
import API_URL from "../config/api";

// Expects backend endpoint: GET /leaderboard/
// Return shape (recommended):
// [
//   { id, name, avatar_url, level, total_xp, is_me },
//   ...
// ]
export async function getLeaderboard() {
  const res = await fetch(`${API_URL}/leaderboard/global`);

  if (!res.ok) {
    throw new Error(`Failed to load leaderboard (status ${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
