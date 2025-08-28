export class LogActivityApi {
  static getAllActivities(query = "", language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/activity-log${query}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
}
