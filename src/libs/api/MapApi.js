export class MapApi {
  static async getMapData(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/map-data`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async getRegionDataById(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/regions/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }

  static async createRegion(data, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/region`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify(data),
    });
  }

  static async createPoi(data, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/poi`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify(data),
    });
  }

  static async getAll(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async create(data, language) {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("year", data.year);
    formData.append("coordinates", data.coordinates);
    if (data.icon) {
      formData.append("icon", data.icon);
    }
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: formData,
    });
  }

  static async update(id, data, language) {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("year", data.year);
    formData.append("coordinates", data.coordinates);
    if (data.color) {
      formData.append("color", data.color);
    }
    if (data.icon) {
      formData.append("icon", data.icon);
    }
    formData.append("_method", "PUT");
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: formData,
      }
    );
  }

  static async delete(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
}
