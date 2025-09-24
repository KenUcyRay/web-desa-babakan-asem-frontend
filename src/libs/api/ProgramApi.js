export class ProgramApi {
  static async getPrograms(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/programs`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }
  static async deleteProgram(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/programs/${id}`,
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
  static async createProgram(data, language) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("featured_image", data.featured_image);

    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/programs/`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept-Language": language,
      },
    });
  }

  static async updateProgram(id, data, language) {
    const formData = new FormData();

    formData.append("title", data.title ?? null);
    formData.append("description", data.description ?? null);
    formData.append("featured_image", data.featured_image ?? null);

    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/programs/${id}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          "Accept-Language": language,
        },
      }
    );
  }
}
