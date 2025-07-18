export class CommentApi {
  static async createComment(id, type, content) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/comments/create/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({
          target_type: type,
          content: content,
        }),
      }
    );
  }

  static async getComments(id, type) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/comments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}
