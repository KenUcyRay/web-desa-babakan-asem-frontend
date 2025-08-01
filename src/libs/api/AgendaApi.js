export class AgendaApi {
  static async getAgenda(page = 1, limit = 10, type = "") {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/agenda/?page=${page}&limit=${limit}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async getDetailAgenda(id) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/agenda/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async getOwnAgenda(page = 1, limit = 10, type = "") {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/agenda/me?page=${page}&limit=${limit}&type=${type}  `,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async createAgenda(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("location", data.location);
    formData.append("is_published", data.is_published ? "true" : "false");
    formData.append("featured_image", data.featured_image);
    formData.append("type", data.type ?? "REGULAR");

    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/agenda/create`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async updateAgenda(id, data) {
    const formData = new FormData();
    formData.append("title", data.title) ?? null;
    formData.append("content", data.content ?? null);
    formData.append("start_time", data.start_time ?? null);
    formData.append("end_time", data.end_time ?? null);
    formData.append("location", data.location ?? null);
    formData.append(
      "is_published",
      data.is_published ? "true" : "false" ?? null
    );
    formData.append("featured_image", data.featured_image ?? null);
    formData.append("type", data.type ?? "REGULAR" ?? null);

    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/agenda/update-by-agenda/${id}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async deleteAgenda(id) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/agenda/delete-by-agenda/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
