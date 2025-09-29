export class LogActivityApi {
  static getAllActivities(query = "", language) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/activity-log${query}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  }
}
