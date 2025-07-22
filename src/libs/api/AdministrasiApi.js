export class AdministrasiApi {
  static async createOnline(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/online`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  static async createLayanan(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/layanan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async createPengantar(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/pengantar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  static async getOnline() {
    return fetch(`${import.meta.env.VITE_BASE_URL}/administrasi/admin/online`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
    });
  }

  static async getLayanan() {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/administrasi/admin/layanan`,
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

  static async getPengantar() {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/administrasi/admin/pengantar`,
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

  static async updateOnline(id) {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/administrasi/admin/online/${id}`,
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

  static async updateLayanan(id) {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/administrasi/admin/layanan/${id}`,
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

  static async updatePengantar(id) {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/administrasi/admin/pengantar/${id}`,
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
