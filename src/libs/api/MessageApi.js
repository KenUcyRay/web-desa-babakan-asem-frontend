export class MessageApi {
  static async create(name, email, message) {
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

  static async get(query = "") {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages${query}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async markAsRead(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
