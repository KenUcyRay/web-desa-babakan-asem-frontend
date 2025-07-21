export class MemberApi {
  static async getMembers(type) {
    return await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/organizations/members?organizationType=${type}`,
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
