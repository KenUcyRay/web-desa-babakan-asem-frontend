import { getAuthHeaders, getAuthHeadersFormData, getPublicHeaders } from './authHelpers';

export class AgendaApi {
  static async getAgenda(page = 1, limit = 10, type = "", language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/agenda/?page=${page}&limit=${limit}&type=${type}`,
      {
        method: "GET",
        headers: getPublicHeaders(language),
      }
    );
  }

  static async getDetailAgenda(id, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/agenda/${id}`, {
      method: "GET",
      headers: getPublicHeaders(language),
    });
  }

  static async getOwnAgenda(page = 1, limit = 10, type = "", language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/agenda/me?page=${page}&limit=${limit}&type=${type}`,
      {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }

  static async createAgenda(data, language) {
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
        credentials: "include",
        headers: getAuthHeadersFormData(language),
      }
    );
  }

  static async updateAgenda(id, data, language) {
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
        credentials: "include",
        headers: getAuthHeadersFormData(language),
      }
    );
  }

  static async deleteAgenda(id, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/agenda/delete-by-agenda/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }
}
