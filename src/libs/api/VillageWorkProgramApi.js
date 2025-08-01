export class VillageWorkProgramApi {
  static async getVillageWorkPrograms() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching village work programs:", error);
      throw error;
    }
  }

  static async getVillageWorkProgramById(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      console.error(
        `Error fetching village work program with id ${id}:`,
        error
      );
      throw error;
    }
  }
}
