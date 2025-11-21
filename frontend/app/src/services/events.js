// events.js
import api from "./api";

/**
 * Fetch events near a given location
 * Backend: GET /events/nearby?lat=<lat>&lng=<lng>&radius_km=<r>
 */
export async function fetchNearbyEvents({
  latitude,
  longitude,
  radiusKm = 5.0,
}) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    radius_km: String(radiusKm),
  }).toString();

  return api.get(`/events/nearby?${params}`);
}

/**
 * Fetch all official events
 * Backend: GET /events/official
 */
export async function fetchOfficialEvents() {
  return api.get("/events/official");
}

/**
 * Fetch a single event by ID
 * Backend: GET /events/{event_id}
 */
export async function fetchEvent(eventId) {
  return api.get(`/events/${eventId}`);
}

/**
 * Create a new event
 * Backend: POST /events/
 * payload must match schemas.EventCreate on the backend
 */
export async function createEvent(payload) {
  // example payload shape:
  // {
  //   title,
  //   description,
  //   latitude,
  //   longitude,
  //   time_start,
  //   time_end,
  //   category,
  //   is_official,
  //   reward_text,
  //   created_by_id
  // }
  return api.post("/events/", payload);
}

/**
 * Join an event
 * Backend: POST /events/{event_id}/join with { user_id }
 */
export async function joinEvent({ eventId, userId }) {
  return api.post(`/events/${eventId}/join`, { user_id: userId });
}
