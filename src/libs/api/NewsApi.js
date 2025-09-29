export class NewsApi {
  static async getNews(page = 1, limit = 10, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/news?page=${page}&limit=${limit}`,
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

  static async getDetailNews(id, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/news/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }
  static async createNews(data, language) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("is_published", data.is_published ? "true" : "false");
    formData.append("featured_image", data.featured_image); // File

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/news`, {
      method: "POST",
      body: formData,

      headers: {
        "Accept-Language": language,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  static async getOwnNews(page = 1, limit = 10, language) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/news?page=${page}&limit=${limit}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  }
  static async updateNews(id, data, language) {
    const formData = new FormData();
    formData.append("title", data.title ?? null);
    formData.append("content", data.content ?? null);
    formData.append(
      "is_published",
      data.is_published ? "true" : "false" ?? null
    );
    formData.append("featured_image", data.featured_image ?? null); // File

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/news/${id}`,
      {
        method: "PATCH",
        body: formData,

        headers: {
          "Accept-Language": language,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  }
  static async deleteNews(id, language) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/news/${id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  }
}
