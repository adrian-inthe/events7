import {Event7} from "./events7.ts";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function fetchEvents() {
  try {
    const response = await fetch(`${apiBaseUrl}/events`);
    return await response.json();
  } catch (error) {
    throw new Error("Couldn't fetch events");
  }
}

export async function createEvent(event: Event7) {
  const response = await fetch(`${apiBaseUrl}/events`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(event),
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.statusCode && data.message) {
      throw new Error(`${data.error} (${data.statusCode}): ${Array.isArray(data.message) ? data.message.join(', ') : data.message}`);
    } else {
      throw new Error(data.error)
    }
  }
  return data;
}

export async function persistEvent(id: number, event: Event7) {
  try {
    const response = await fetch(`${apiBaseUrl}/events/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(event),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Couldn't persist event");
  }
}

export async function deleteEvent(id: number) {
  let response
  try {
    response = await fetch(`${apiBaseUrl}/events/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error("Couldn't delete event");
  }
  if (response.ok) {
    return id;
  } else {
    throw new Error(`Couldn't delete event ${id}`);
  }
}

export async function checkPermission() {
  try {
    // TODO backend doesnt read countryCode it will fetch it itself
    const response = await fetch(`${apiBaseUrl}/users/permissions/ads`);
    return (await response.json()).canCreateAdsEvents;
  } catch (error) {
    throw new Error("Couldn't fetch permission");
  }
}

