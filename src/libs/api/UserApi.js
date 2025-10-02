// Helper function to get auth headers
const getAuthHeaders = (language) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": language,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export class UserApi {
  static async register(body, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email && body.email !== "" ? body.email : undefined,
        phone_number: body.phone && body.phone !== "" ? body.phone : undefined,
        password: body.password,
        confirm_password: body.confirmPassword,
        remember_me: body.rememberMe,
        recaptcha_token: body.reCaptchaToken,
      }),
    });
  }
  static async login(body, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/login`, {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({
        email: body.email && body.email !== "" ? body.email : undefined,
        phone_number:
          body.phone_number && body.phone_number !== ""
            ? body.phone_number
            : undefined,
        password: body.password,
        remember_me: body.rememberMe,
        recaptcha_token: body.reCaptchaToken,
      }),
    });
  }
  static async profile(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/private/users`, {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(language),
    });
  }
  static async logout(language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/users/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }

  static async forgetPassword(email, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/users/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
  }
  static async verifyResetToken(token, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/users/verify-reset-token?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
      }
    );
  }
  static async resetPassword(token, password, confirmPassword, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/users/reset-password?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({
          password: password,
          confirm_password: confirmPassword,
        }),
      }
    );
  }

  static async updateUser(
    name,
    email,
    password,
    confirm_password,
    phone,
    language
  ) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/private/users`, {
      method: "PATCH",
      credentials: "include",
      headers: getAuthHeaders(language),
      body: JSON.stringify({
        name: name,
        email: email !== null ? email : undefined,
        password: password !== "" ? password : undefined,
        confirm_password:
          confirm_password !== "" ? confirm_password : undefined,
        phone_number: phone ? phone : undefined,
      }),
    });
  }
  static async createAdmin(body, language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/users`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(language),
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
        confirm_password: body.confirm_password,
        role: body.role,
      }),
    });
  }
  static async deleteUser(language) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/private/users/`, {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(language),
    });
  }
  static async getAllUsers(page = 1, limit = 10, language) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/users?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(language),
      }
    );
  }
  static async updateRoleById(userId, role, language) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/users/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(language),
        body: JSON.stringify({
          role: role,
        }),
      }
    );
  }
}
