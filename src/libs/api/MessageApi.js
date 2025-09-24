export class MessageApi {
  static async create(name, email, message, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
      }),
    });
  }

  static async get(query = "", language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }

  static async markAsRead(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/messages/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
}
