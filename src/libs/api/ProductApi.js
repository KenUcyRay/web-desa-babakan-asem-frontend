import {
  getAuthHeaders,
  getAuthHeadersFormData,
  getPublicHeaders,
} from "./authHelpers";

export class ProductApi {
  static async getProducts(page = 1, limit = 10, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/products/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getPublicHeaders(language),
      }
    );
  }

  static async getDetailProduct(id, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: getPublicHeaders(language),
    });
  }

  static async getOwnProducts(page = 1, limit = 10, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/products/me?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }

  static async createProduct(data, language) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("link_whatsapp", data.link_whatsapp);
    formData.append("category_id", data.category_id);
    formData.append("featured_image", data.featured_image);

    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/create`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: getAuthHeadersFormData(language),
      }
    );
  }

  static async updateProduct(id, data, language) {
    const formData = new FormData();
    formData.append("title", data.title ?? null);
    formData.append("description", data.description ?? null);
    formData.append("price", data.price ?? null);
    formData.append("link_whatsapp", data.link_whatsapp ?? null);
    formData.append("category_id", data.category_id ?? null);
    formData.append("featured_image", data.featured_image ?? null);

    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/products/update-by-product/${id}`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
        headers: getAuthHeadersFormData(language),
      }
    );
  }

  static async deleteProduct(id, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/products/delete-by-product/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }

  // - CREATE Rating
  static async createRating(productId, rating, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/products/rating/${productId}`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify({ rating }),
      }
    );
  }

  // - CHECK kalau user sudah pernah rating
  static async alreadyRated(productId, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/products/rating/${productId}`,
      {
        method: "GET",
        credentials: "include",

        headers: getAuthHeaders(language),
      }
    );
  }

  // - UPDATE Rating
  static async updateRating(ratingId, rating, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/products/rating/${ratingId}`,
      {
        method: "PATCH",
        credentials: "include",

        headers: getAuthHeaders(language),
        body: JSON.stringify({ rating }),
      }
    );
  }

  // - DELETE Rating
  static async deleteRating(ratingId, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/private/products/rating/${ratingId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }
}
