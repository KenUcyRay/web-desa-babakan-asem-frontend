export class AdministrasiApi {
  static async createOnline(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/online`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  static async createLayanan(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/layanan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async createPengantar(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/pengantar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}
