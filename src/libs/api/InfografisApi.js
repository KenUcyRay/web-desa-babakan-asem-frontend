export class InfografisApi {
  static async updateBansos(id, data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos/${id}`,
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
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos/${id}`,
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
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify(data),
      }
    );
  }

  static async getPenduduk() {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/penduduk`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async updatePenduduk(id, data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/penduduk/${id}`,
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
  static async getIdm() {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/idm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async createIdm(data) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
      body: JSON.stringify(data),
    });
  }

  static async getExtraIdm() {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/extra-idm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async updateExtraIdm(id, data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/extra-idm/${id}`,
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

  static async updateIdm(id, data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm/${id}`,
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
  static async deleteIdm(id) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm/${id}`,
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
  static async getBansos() {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/bansos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async getSdg() {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/sdg`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static async updateSdg(id, data) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/sdg/${id}`,
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
}
