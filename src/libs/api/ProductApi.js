export class ProductApi {
  static async getProducts(page = 1, limit = 10) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
