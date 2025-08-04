export class UserApi {
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
        email: body.email === "" ? undefined : body.email,
        phone_number: body.phone_number === "" ? undefined : body.phone_number,
        password: body.password,
        remember_me: body.rememberMe,
        recaptcha_token: body.reCaptchaToken,
      }),
    });
  }
  static async profile() {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/private/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  static async logout() {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/private/users/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  static async register(
    name,
    email,
    phone_number,
    password,
    confirmPassword,
    rememberMe,
    reCaptchaToken,
    language
  ) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({
        name: name,
        email: email === "" ? undefined : email,
        phone_number: phone_number === "" ? undefined : phone_number,
        password: password,
        confirm_password: confirmPassword,
        remember_me: rememberMe,
        recaptcha_token: reCaptchaToken,
      }),
    });
  }
  static async forgetPassword(email) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/users/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
  }
  static async verifyResetToken(token) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/users/verify-reset-token?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
  static async resetPassword(token, password, confirmPassword) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/users/reset-password?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          password: password,
          confirm_password: confirmPassword,
        }),
      }
    );
  }

  static async updateUser(name, email, password, phone) {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email !== null ? email : undefined,
        password: password !== "" ? password : undefined,
        phone_number: phone ? phone : undefined,
      }),
    });
  }
  static async createAdmin(body) {
    console.log(body);
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/admin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
        confirm_password: body.confirm_password,
        role: body.role || "ADMIN",
      }),
    });
  }
  static async deleteUser() {
    return await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/users/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
  static async getAllUsers(page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_NEW_BASE_URL
      }/admin/users?page=${page}&limit=${limit}`,
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
  static async updateRoleById(userId, role) {
    return await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/users/admin/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          role: role,
        }),
      }
    );
  }
}
