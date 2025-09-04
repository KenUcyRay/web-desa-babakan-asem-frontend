export class EmergencyApi {
  static async create(data) {
    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/emergencies`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const body = await response.json();

    if (!response.ok) {
      console.log(body);
      throw new Error(body || "Failed to create emergency");
    }

    return body;
  }
  static async get(page = 1, limit = 10, isHandled = false) {
    const response = await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/emergencies?page=${page}&limit=${limit}&is_handled=${isHandled}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body || "Failed to fetch emergencies");
    }

    return body;
  }
  static async update(id) {
    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body || "Failed to update emergency");
    }
    return body;
  }
  static async delete(id) {
    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body || "Failed to delete emergency");
    }

    return true;
  }
  static async count() {
    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/emergencies/count`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body || "Failed to count emergencies");
    }

    return body;
  }
}
