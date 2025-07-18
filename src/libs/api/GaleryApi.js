export class GaleryApi {
  static async getGaleri(page = 1, limit = 9) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/galeri/?limit=${limit}&page=${page}`,
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
