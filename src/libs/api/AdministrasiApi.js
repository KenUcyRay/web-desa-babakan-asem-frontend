export class AdministrasiApi {
  static async createPengantar(data, language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/administrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({
        name: data.name,
        nik: data.nik,
        phone: data.phone,          // ✅ WAJIB
        type: data.type,
        keterangan: data.keterangan,
      }),
    });
  }

  static async getPengantar(query = "", language) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  static async updatePengantar(id, language) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/administrations/${id}`,
      {
        method: "PATCH",
        credentials: "include",
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
