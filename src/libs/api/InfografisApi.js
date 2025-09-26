import { getAuthHeaders } from './authHelpers';

export class InfografisApi {
  static async updateBansos(id, data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }
  static async deleteBansos(id, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }

  static async createBansos(data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/bansos`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }

  static async getPenduduk(language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/penduduk`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async updatePenduduk(id, data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/penduduk/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }
  static async getIdm(language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/idm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }
  static async createIdm(data, language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(language),
      body: JSON.stringify(data),
    });
  }

  static async getExtraIdm(language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/extra-idm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }

  static async updateExtraIdm(id, data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/extra-idm/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }

  static async updateIdm(id, data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }
  static async deleteIdm(id, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/idm/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }
  static async getBansos(language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/bansos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }
  static async getSdg(language) {
    return fetch(`${import.meta.env.VITE_NEW_BASE_URL}/infografis/sdg`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
    });
  }
  static async updateSdg(id, data, language) {
    return fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/infografis/sdg/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify(data),
      }
    );
  }
}
