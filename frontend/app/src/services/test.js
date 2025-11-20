import API_URL from "../config/api";

export async function testBackend() {
  try {
    console.log("Calling:", `${API_URL}/users`);

    const res = await fetch(`${API_URL}/users`);
    console.log("Got response object");

    console.log("Status:", res.status);
    let text = await res.text();
    console.log("Raw text:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("JSON parsed:", data);
    } catch (e) {
      console.log("JSON parse error:", e);
      throw e;
    }

    return data;
  } catch (err) {
    console.log("FETCH ERROR:", err);
    throw err;
  }
}
