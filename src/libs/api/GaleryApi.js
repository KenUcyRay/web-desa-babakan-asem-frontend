export class GaleryApi {
  static async getGaleri(page = 1, limit = 9) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/galeri?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async createGaleri(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", data.image);
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
      body: formData,
    });
  }

  static async updateGaleri(id, data) {
    const formData = new FormData();
    formData.append("title", data.title ?? undefined);
    formData.append("image", data.image ? data.image : undefined);
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: formData,
      }
    );
  }

  static async deleteGaleri(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/galeri/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
