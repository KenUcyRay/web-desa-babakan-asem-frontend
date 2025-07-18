export class AgendaApi {
  static async getAgenda(page = 1, limit = 10) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/agenda/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async getDetailAgenda(id) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/agenda/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}
