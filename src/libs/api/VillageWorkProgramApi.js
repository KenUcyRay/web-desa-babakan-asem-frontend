export class VillageWorkProgramApi {
  static async getVillageWorkPrograms(language) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": language,
          },
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getVillageWorkProgramById(id, language) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": language,
          },
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
