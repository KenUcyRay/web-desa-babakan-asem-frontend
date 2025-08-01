export class UserApi {
  static async userLogin(
    email,
    password,
    phone_number,
    rememberMe,
    reCaptchaToken
  ) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email === "" ? undefined : email,
        phone_number: phone_number === "" ? undefined : phone_number,
        password: password,
        remember_me: rememberMe,
        recaptcha_token: reCaptchaToken,
      }),
    });
  }
  static async userRegister(
    name,
    email,
    phone_number,
    password,
    confirmPassword,
    rememberMe,
    reCaptchaToken
  ) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
      `${import.meta.env.VITE_BASE_URL}/users/forgot-password`,
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
        import.meta.env.VITE_BASE_URL
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
      `${import.meta.env.VITE_BASE_URL}/users/reset-password?token=${token}`,
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
  static async getUserProfile() {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
    });
  }
  static async updateUser(name, email, password, phone) {
    console.log();
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
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
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
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
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
    });
  }
  static async getAllUsers(page = 1, limit = 10) {
    return await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/users/admin/user?page=${page}&limit=${limit}`,
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
  static async updateRoleById(userId, role) {
    return await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/admin/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({
          role: role,
        }),
      }
    );
  }
}
