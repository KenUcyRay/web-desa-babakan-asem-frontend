// Helper function to get auth headers
const getAuthHeaders = (language = "id") => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("🔑 EmergencyApi getAuthHeaders:", {
    hasToken: !!token,
    tokenLength: token?.length,
  });

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (language) {
    headers["Accept-Language"] = language;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header added");
  } else {
    console.error("❌ No token found for Authorization header");
  }

  return headers;
};

export class EmergencyApi {
  static async create(data) {
    console.log("[EmergencyApi] create payload:", data);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/private/emergencies`,
        {
          method: "POST",

          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      // Handle different response types
      let body;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        body = await response.json();
      } else {
        body = await response.text();
      }

      console.log("[EmergencyApi] response:", {
        status: response.status,
        body,
      });

      if (!response.ok) {
        console.log("[EmergencyApi] create failed:", body);

        // Handle different error response formats
        let errorMessage = "Failed to create emergency";

        if (typeof body === "object" && body !== null) {
          errorMessage =
            body.message || body.error || body.errors || errorMessage;
        } else if (typeof body === "string") {
          errorMessage = body;
        }

        throw new Error(errorMessage);
      }

      console.log("[EmergencyApi] create success:", body);
      return body;
    } catch (error) {
      console.error("[EmergencyApi] create error:", error);

      // Network errors
      if (
        error.name === "TypeError" ||
        error.message.includes("Failed to fetch")
      ) {
        throw new Error("Network error: Unable to connect to server");
      }

      throw error;
    }
  }

  static async get(page = 1, limit = 10, isHandled = false) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/admin/emergencies?page=${page}&limit=${limit}&is_handled=${isHandled}`,
        {
          method: "GET",

          headers: getAuthHeaders(),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.message || body.error || "Failed to fetch emergencies"
        );
      }

      return body;
    } catch (error) {
      console.error("[EmergencyApi] get error:", error);
      throw error;
    }
  }

  static async update(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/${id}`,
        {
          method: "PATCH",

          headers: getAuthHeaders(),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.message || body.error || "Failed to update emergency"
        );
      }

      return body;
    } catch (error) {
      console.error("[EmergencyApi] update error:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/${id}`,
        {
          method: "DELETE",

          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        let errorBody = "Failed to delete emergency";
        try {
          const body = await response.json();
          errorBody = body.message || body.error || errorBody;
        } catch (e) {
          // Response might not be JSON
        }
        throw new Error(errorBody);
      }

      return true;
    } catch (error) {
      console.error("[EmergencyApi] delete error:", error);
      throw error;
    }
  }

  static async count() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/count`,
        {
          method: "GET",

          headers: getAuthHeaders(),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.message || body.error || "Failed to count emergencies"
        );
      }

      return body;
    } catch (error) {
      console.error("[EmergencyApi] count error:", error);
      throw error;
    }
  }
}
