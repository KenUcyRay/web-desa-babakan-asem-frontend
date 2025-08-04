export class GaleryApi {
  static async getGaleri(page = 1, limit = 9, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/galeri?limit=${limit}&page=${page}`,
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

  static async createGaleri(data, language) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", data.image);
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "Accept-Language": language,
      },
    });
  }

  static async updateGaleri(id, data, language) {
    const formData = new FormData();
    formData.append("title", data.title ?? undefined);
    formData.append("image", data.image ? data.image : undefined);
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri/${id}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
        headers: {
          "Accept-Language": language,
        },
      }
    );
  }

  static async deleteGaleri(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
}
