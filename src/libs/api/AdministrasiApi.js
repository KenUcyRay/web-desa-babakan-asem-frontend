export class AdministrasiApi {
  static async createPengantar(data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/administrasi/pengantar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }

  static async getPengantar() {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/administrasi/pengantar`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async updatePengantar(id) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/administrasi/pengantar/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
