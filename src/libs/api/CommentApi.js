export class CommentApi {
  // - Buat komentar baru
  static async createComment(id, type, content, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/comments/create/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({
          target_type: type,
          content: content,
        }),
      }
    );
  }

  // - Ambil komentar berdasarkan target ID (berita/agenda)
  static async getComments(id, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/comments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  // - Update komentar
  static async updateComment(commentId, newContent, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/comments/update/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      }
    );
  }

  // - Delete komentar
  static async deleteComment(commentId, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/comments/delete/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
}
