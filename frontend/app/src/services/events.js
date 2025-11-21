// src/services/events.js
import API_URL from "../config/api";

// Call backend: GET /events/nearby?lat=<lat>&lng=<lng>&radius_km=<r>
// We default to Brno if you don't pass anything in.
export async function getEvents({
  latitude = 49.1951,
  longitude = 16.6068,
  radiusKm = 10,
} = {}) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    radius_km: String(radiusKm),
  }).toString();

  const res = await fetch(`${API_URL}/events/nearby?${params}`);

  if (!res.ok) {
    throw new Error(`Failed to load events (status ${res.status})`);
  }

  const data = await res.json();
  // Make sure we always return an array so events.map(...) is safe
  return Array.isArray(data) ? data : [];
}
