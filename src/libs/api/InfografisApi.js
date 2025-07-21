export class InfografisApi {
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
