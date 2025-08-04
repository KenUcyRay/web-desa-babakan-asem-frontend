export class AdministrasiApi {
  static async createPengantar(data, language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/administrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify(data),
    });
  }

  static async getPengantar(query = "", language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async updatePengantar(id, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations/${id}`,
      {
        method: "PATCH",
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
