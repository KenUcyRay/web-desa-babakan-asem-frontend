export class MessageApi {
  static async createMessage(name, email, message) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/messages/`, {
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

  static async getMessages(query = "") {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages${query}`,
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

  static async markAsRead(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages/${id}`,
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

  static async deleteMessage(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages/${id}/`,
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
}
