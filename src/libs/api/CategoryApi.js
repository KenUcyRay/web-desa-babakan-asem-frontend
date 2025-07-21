export class CategoryApi {
  static async getCategories() {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/admin/categories`,
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
      `${import.meta.env.VITE_BASE_URL}/products/admin/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({ name }),
      }
    );
  }
  static async deleteCategory(id) {
    console.log(id);
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/admin/categories/${id}`,
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
