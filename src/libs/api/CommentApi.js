export class CommentApi {
  // - Buat komentar baru
  static async createComment(id, type, content) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/comments/create/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage
            .getItem("token")
            ?.slice(1, -1)}`,
        },
        body: JSON.stringify({
          target_type: type,
          content: content,
        }),
      }
    );
  }

  // - Ambil komentar berdasarkan target ID (berita/agenda)
  static async getComments(id, type) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/comments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  // - Update komentar
  static async updateComment(commentId, newContent) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/comments/update/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage
            .getItem("token")
            ?.slice(1, -1)}`,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      }
    );
  }

  // - Delete komentar
  static async deleteComment(commentId) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/comments/delete/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage
            .getItem("token")
            ?.slice(1, -1)}`,
        },
      }
    );
  }
}
