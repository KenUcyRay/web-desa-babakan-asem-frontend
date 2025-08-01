export class MemberApi {
  static async getMembers(type, page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/organizations/members?organizationType=${type}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  static async createMember(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    formData.append("term_start", data.term_start);
    formData.append("term_end", data.term_end);
    formData.append("organization_type", data.organization_type);
    formData.append("profile_photo", data.profile_photo);
    formData.append("is_term", data.is_term);
    formData.append("important_level", data.important_level);
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/organizations/members`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async getAllMembers(type, page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/organizations/members?organizationType=${type}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async updateMember(id, data) {
    const formData = new FormData();
    formData.append("name", data.name) ?? undefined;
    formData.append("position", data.position) ?? undefined;
    formData.append("term_start", data.term_start) ?? undefined;
    formData.append("term_end", data.term_end) ?? undefined;
    formData.append("organization_type", data.organization_type);
    formData.append("profile_photo", data.profile_photo ?? undefined);
    formData.append("is_term", data.is_term);
    formData.append("important_level", data.important_level) ?? undefined;

    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/organizations/members/${id}`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
  static async deleteMember(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/organizations/members/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
