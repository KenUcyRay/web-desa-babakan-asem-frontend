export class CallCenterApi {
  static async get(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/callcenters?page=${page}&limit=${limit}`,
        { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json" } }
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Failed to fetch call centers");
      return body;
    } catch (error) {
      console.error("[CallCenterApi] get error:", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/callcenters`,
        { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Failed to create call center");
      return body;
    } catch (error) {
      console.error("[CallCenterApi] create error:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/callcenters/${id}`,
        { method: "PUT", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Failed to update call center");
      return body;
    } catch (error) {
      console.error("[CallCenterApi] update error:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/callcenters/${id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json", Accept: "application/json" } }
      );
      if (!response.ok) {
        let errorBody = "Failed to delete call center";
        try { const body = await response.json(); errorBody = body.message || body.error || errorBody; } catch {}
        throw new Error(errorBody);
      }
      return true;
    } catch (error) {
      console.error("[CallCenterApi] delete error:", error);
      throw error;
    }
  }

  static async getPublic() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/callcenters`,
        { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json" } }
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || body.error || "Failed to fetch public call centers");
      return body;
    } catch (error) {
      console.error("[CallCenterApi] getPublic error:", error);
      throw error;
    }
  }
}
