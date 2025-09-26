// mapApi.js - Fixed Version

// Enum MapType
export const MapType = {
  POLYGON: "POLYGON",
  MARKER: "MARKER",
  BENCANA: "BENCANA",
};

// Helper Validation
const validateHexColor = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);
const validateRadius = (radius) => radius >= 100 && radius <= 5000;
const validateCoordinates = (coordinates) => {
  try {
    const parsed =
      typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
    return (
      Array.isArray(parsed) &&
      (Array.isArray(parsed[0]) || typeof parsed[0] === "number")
    );
  } catch {
    return false;
  }
};

// Base URLs
const MAPS_BASE_URL = `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`;
const REGION_BASE_URL = `${import.meta.env.VITE_NEW_BASE_URL}/admin/regions`;
const POI_BASE_URL = `${import.meta.env.VITE_NEW_BASE_URL}/admin/poi`;

export class MapApi {
  // Validation
  static async validateMapData(data, isUpdate = false) {
    if (!Object.values(MapType).includes(data.type))
      throw new Error("zodErrors.invalid_value");
    if (!data.name || data.name.trim().length === 0)
      throw new Error("zodErrors.required");
    if (!data.description || data.description.trim().length === 0)
      throw new Error("zodErrors.required");
    if (!data.year || data.year < 1900) throw new Error("zodErrors.min_value");
    if (!data.coordinates || !validateCoordinates(data.coordinates))
      throw new Error("zodErrors.invalid_coordinates_format");

    if (
      data.type === MapType.POLYGON &&
      data.color &&
      !validateHexColor(data.color)
    ) {
      throw new Error("Color must be valid hex");
    }
    if (
      data.type === MapType.BENCANA &&
      data.radius &&
      !validateRadius(data.radius)
    ) {
      throw new Error("Radius must be 100-5000");
    }
    if (
      !isUpdate &&
      (data.type === MapType.MARKER || data.type === MapType.BENCANA) &&
      !data.icon
    ) {
      throw new Error("Icon is required for marker and bencana maps");
    }
  }

  // Get all map data
  static async getMapData(language) {
    try {
      const response = await fetch(`${MAPS_BASE_URL}-data`, {
        method: "GET",
         //  village,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch map data");
      return await response.json();
    } catch (err) {
      console.error("getMapData error:", err);
      throw err;
    }
  }

  // Get region by ID
  static async getRegionDataById(id, language) {
    try {
      const response = await fetch(`${REGION_BASE_URL}/${id}`, {
        method: "GET",
         //  village,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch region data");
      return await response.json();
    } catch (err) {
      console.error("getRegionDataById error:", err);
      throw err;
    }
  }

  // Create region
  static async createRegion(data, language) {
    try {
      const response = await fetch(`${REGION_BASE_URL}`, {
        method: "POST",
         //  village,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create region");
      return await response.json();
    } catch (err) {
      console.error("createRegion error:", err);
      throw err;
    }
  }

  // Create POI
  static async createPoi(data, language) {
    try {
      const response = await fetch(POI_BASE_URL, {
        method: "POST",
         //  village,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create POI");
      return await response.json();
    } catch (err) {
      console.error("createPoi error:", err);
      throw err;
    }
  }

  // Get all maps
  static async getAll(language) {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(MAPS_BASE_URL, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch maps");
      return await response.json();
    } catch (err) {
      console.error("getAll error:", err);
      throw err;
    }
  }

  // Get map by ID
  static async getById(id, language) {
    try {
      const response = await fetch(`${MAPS_BASE_URL}/${id}`, {
        method: "GET",
         //  village,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch map by ID");
      return await response.json();
    } catch (err) {
      console.error("getById error:", err);
      throw err;
    }
  }

  // Create new map - FIXED
  static async create(data, language) {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("year", data.year.toString());
      formData.append(
        "coordinates",
        typeof data.coordinates === "string"
          ? data.coordinates
          : JSON.stringify(data.coordinates)
      );
      formData.append("color", data.color);

      if (data.type === MapType.POLYGON) {
        formData.append("area", data.area);
      } else {
        formData.append("icon", data.icon === null ? undefined : data.icon);
        formData.append("radius", data.radius.toString());
      }

      const headers = {
        "Accept-Language": language,
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`,
        {
          method: "POST",
          body: formData,
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to create map" }));
        throw new Error(errorData.message || "Failed to create map");
      }

      return await response.json();
    } catch (err) {
      console.error("create error:", err);
      throw err;
    }
  }

  // Update map - FIXED
  static async update(id, data, language) {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("year", data.year.toString());
      formData.append(
        "coordinates",
        typeof data.coordinates === "string"
          ? data.coordinates
          : JSON.stringify(data.coordinates)
      );
      formData.append("color", data.color);

      if (data.type === MapType.POLYGON) {
        formData.append("area", data.area);
      } else {
        if (data.icon instanceof File) {
          formData.append("icon", data.icon);
        }
        formData.append("radius", data.radius.toString());
      }

      const headers = {
        Accept: "application/json",
        "Accept-Language": language,
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps/${id}`,
        {
          method: "PATCH",
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to update map" }));
        throw new Error(errorData.message || "Failed to update map");
      }

      return await response.json();
    } catch (err) {
      console.error("update error:", err);
      throw err;
    }
  }

  // Delete map
  static async delete(id, language) {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${MAPS_BASE_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to delete map" }));
        throw new Error(errorData.message || "Failed to delete map");
      }
      return true;
    } catch (err) {
      console.error("delete error:", err);
      throw err;
    }
  }
}
