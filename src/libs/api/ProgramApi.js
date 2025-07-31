export class ProgramApi {
  static async getPrograms() {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  static async deleteProgram(id) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/programs/admin/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
  static async createProgram(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("featured_image", data.featured_image);

    return await fetch(`${import.meta.env.VITE_BASE_URL}/programs/admin/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
    });
  }

  static async updateProgram(id, data) {
    const formData = new FormData();

    formData.append("title", data.title ?? null);
    formData.append("description", data.description ?? null);
    formData.append("featured_image", data.featured_image ?? null);

    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/programs/admin/${id}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
