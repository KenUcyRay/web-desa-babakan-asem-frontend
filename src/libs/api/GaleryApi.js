export class GaleryApi {
  static async getGaleri(page = 1) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/galeri/?limit=3&page=${page}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "anyvalue",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
