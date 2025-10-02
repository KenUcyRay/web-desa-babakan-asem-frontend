/**
 * Centralized authentication helpers for API calls
 * This ensures consistent header handling across all API files
 */

/**
 * Get authentication token from localStorage or sessionStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Get headers for JSON API calls with authentication
 * @param {string} language - Language code (e.g., 'id', 'en')
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with auth token if available
 */
export const getAuthHeaders = (language, additionalHeaders = {}) => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": language,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...additionalHeaders,
  };
};

/**
 * Get headers for FormData API calls with authentication
 * Note: Content-Type is not set to allow browser to set multipart/form-data boundary
 * @param {string} language - Language code (e.g., 'id', 'en')
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with auth token if available
 */
export const getAuthHeadersFormData = (language, additionalHeaders = {}) => {
  const token = getToken();
  return {
    "Accept-Language": language,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...additionalHeaders,
  };
};

/**
 * Get headers for public API calls (no authentication required)
 * @param {string} language - Language code (e.g., 'id', 'en')
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object without auth token
 */
export const getPublicHeaders = (language, additionalHeaders = {}) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": language,
    ...additionalHeaders,
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};


















