export class MessageApi {
  static async createMessage(name, email, message) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
      }),
    });
  }

  static async getMessages(page = 1, limit = 100) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/messages/?page=${page}&limit=${limit}`,
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

  static async deleteMessage(id) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/messages/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
    });
  }
}
