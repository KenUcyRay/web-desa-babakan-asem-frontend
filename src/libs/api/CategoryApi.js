export class CategoryApi {
  static async getCategories() {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  static async addCategory(name) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: name.name }),
      }
    );
  }
  static async updateCategory(id, name) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(name),
      }
    );
  }
  static async deleteCategory(id) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
