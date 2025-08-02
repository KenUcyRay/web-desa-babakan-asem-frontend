export class ProductApi {
  static async getProducts(page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/products/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async getDetailProduct(id) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  static async getOwnProducts(page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/products/me?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async createProduct(data) {
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async updateProduct(id, data) {
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  static async deleteProduct(id) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/products/delete-by-product/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  // - CREATE Rating
  static async createRating(productId, rating) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/products/rating/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({ rating }),
      }
    );
  }

  // - CHECK kalau user sudah pernah rating
  static async alreadyRated(productId) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/products/rating/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }

  // - UPDATE Rating
  static async updateRating(ratingId, rating) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/products/rating/${ratingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({ rating }),
      }
    );
  }

  // - DELETE Rating
  static async deleteRating(ratingId) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/products/rating/${ratingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
