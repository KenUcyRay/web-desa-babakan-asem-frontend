// src/libs/api/RegulationApi.js
const BASE_URL = import.meta.env.VITE_NEW_BASE_URL || "http://localhost:3001/api";
const SERVER_URL = import.meta.env.VITE_NEW_BASE_URL || "http://localhost:3001";

export const RegulationApi = {
  // ---- Public Endpoints ----
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/regulations`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await response.json();
      if (!response.ok) {
        console.error("RegulationApi.getAll error body:", json);
        return { success: false, data: [], errors: json.errors || json.message || "Failed to fetch regulations" };
      }
      // Backend return {success: true, data: [...]}
      return { success: true, data: json.data || json };
    } catch (error) {
      console.error("RegulationApi.getAll network error:", error);
      return { success: false, data: [], errors: "Network error" };
    }
  },

  // ✅ Preview URL (inline di iframe)
  getPreviewUrl: (id) => {
    if (!id) return "#";
    return `${BASE_URL}/regulations/${id}/preview`;
  },

  // Simplified download method - hanya pakai ID
  getDownloadUrl: (id) => {
    if (!id) return "#";
    return `${BASE_URL}/regulations/${id}/download`;
  },

  // Method untuk download langsung (untuk window.open atau href)
  downloadFile: async (id) => {
    try {
      const url = `${BASE_URL}/regulations/${id}/download`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed");
    }
  },

  // ---- Admin Endpoints ----
  create: async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/regulations`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("RegulationApi.create error body:", result);
        return { success: false, errors: result.errors || result.message || "Upload failed" };
      }
      return { success: true, data: result.data || result };
    } catch (error) {
      console.error("RegulationApi.create network error:", error);
      return { success: false, errors: "Network error" };
    }
  },

  update: async (id, formData) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/regulations/${id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("RegulationApi.update error body:", result);
        return { success: false, errors: result.errors || result.message || "Update failed" };
      }
      return { success: true, data: result.data || result };
    } catch (error) {
      console.error("RegulationApi.update network error:", error);
      return { success: false, errors: "Network error" };
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/regulations/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("RegulationApi.delete error body:", result);
        return { success: false, errors: result.errors || result.message || "Delete failed" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.error("RegulationApi.delete network error:", error);
      return { success: false, errors: "Network error" };
    }
  },
};
