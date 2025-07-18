export class NewsApi {
  static async getNews(page = 1, limit = 10) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/news/?page=${page}&limit=${limit}`,
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
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/news/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
