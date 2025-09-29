import { getAuthHeaders } from "./authHelpers";

export class ContactApi {
  static async get(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/contacts?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders("id"),
        }
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || body.error || "Failed to fetch contacts");
      return body;
    } catch (error) {
      console.error("[ContactApi] get error:", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/contacts`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            ...getAuthHeaders("id"),
            "Content-Type": "application/json", // ✅ biar body JSON kebaca
          },
          body: JSON.stringify(data),
        }
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || body.error || "Failed to create contact");
      return body;
    } catch (error) {
      console.error("[ContactApi] create error:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/contacts/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            ...getAuthHeaders("id"),
            "Content-Type": "application/json", // ✅ sama di update
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 404 || response.status === 405) {
        response = await fetch(
          `${import.meta.env.VITE_NEW_BASE_URL}/admin/contacts/${id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              ...getAuthHeaders("id"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      }

      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || body.error || "Failed to update contact");
      return body;
    } catch (error) {
      console.error("[ContactApi] update error:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/contacts/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: getAuthHeaders("id"),
        }
      );
      if (!response.ok) {
        let errorBody = "Failed to delete contact";
        try {
          const body = await response.json();
          errorBody = body.message || body.error || errorBody;
        } catch {}
        throw new Error(errorBody);
      }
      return true;
    } catch (error) {
      console.error("[ContactApi] delete error:", error);
      throw error;
    }
  }

  static async getPublic() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/contacts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.message || body.error || "Failed to fetch public contacts"
        );
      return body;
    } catch (error) {
      console.error("[ContactApi] getPublic error:", error);
      throw error;
    }
  }
}
