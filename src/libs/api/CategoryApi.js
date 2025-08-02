export class CategoryApi {
  static async getCategories() {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
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
  static async addCategory(name) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/products/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      }
    );
  }
}
