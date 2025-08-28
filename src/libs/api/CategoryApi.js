export class CategoryApi {
  static async getCategories(language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
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
  static async addCategory(name, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({ name: name.name }),
      }
    );
  }
  static async updateCategory(id, name,language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify(name),
      }
    );
  }
  static async deleteCategory(id, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories/${id}`,
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
