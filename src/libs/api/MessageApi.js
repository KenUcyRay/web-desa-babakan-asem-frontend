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
}
