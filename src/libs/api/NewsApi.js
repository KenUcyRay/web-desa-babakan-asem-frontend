export class NewsApi {
  static async getNews(page = 1, limit = 10) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/news?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async getDetailNews(id) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/news/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  static async createNews(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("is_published", data.is_published ? "true" : "false");
    formData.append("featured_image", data.featured_image); // File

    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/news`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  }

  static async getOwnNews(page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/news?page=${page}&limit=${limit}`,
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
  static async updateNews(id, data) {
    const formData = new FormData();
    formData.append("title", data.title ?? null);
    formData.append("content", data.content ?? null);
    formData.append(
      "is_published",
      data.is_published ? "true" : "false" ?? null
    );
    formData.append("featured_image", data.featured_image ?? null); // File

    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/news/${id}`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );
  }
  static async deleteNews(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/news/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
