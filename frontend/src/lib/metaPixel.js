export function trackMetaEvent(eventName, parameters = {}, eventId) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  if (eventId) {
    window.fbq("track", eventName, parameters, { eventID: eventId });
    return;
  }

  window.fbq("track", eventName, parameters);
}
