export class InfografisApi {
  static async upfdateBansos(id, data) {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/infografis/admin/bansos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify(data),
      }
    );
  }
  static async deleteBansos(id) {
    return fetch(
      `${import.meta.env.VITE_BASE_URL}/infografis/admin/bansos/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async createBansos(data) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/infografis/admin/bansos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
      body: JSON.stringify(data),
    });
  }

  static async getPenduduk() {
    return fetch(`${import.meta.env.VITE_BASE_URL}/infografis/penduduk`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async getIdm() {
    return fetch(`${import.meta.env.VITE_BASE_URL}/infografis/idm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async getBansos() {
    return fetch(`${import.meta.env.VITE_BASE_URL}/infografis/bansos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async getSdg() {
    return fetch(`${import.meta.env.VITE_BASE_URL}/infografis/sdg`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
