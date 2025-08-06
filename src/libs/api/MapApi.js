export class MapApi {
  static async getMapData(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/map-data`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async getRegionDataById(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/regions/:id`,
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
