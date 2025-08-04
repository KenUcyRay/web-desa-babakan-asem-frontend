export class AdministrasiApi {
  static async createPengantar(data) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/administrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async getPengantar(query = "") {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async updatePengantar(id) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
