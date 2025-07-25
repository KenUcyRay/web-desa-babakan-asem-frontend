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
    console.log(phone_number);
    console.log(email);
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
        phone_number: phone !== "" ? phone : undefined,
      }),
    });
  }
  static async createAdmin(name, email, password, confirmPassword) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirm_password: confirmPassword,
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
  static async createAdmin({ name, email, password, confirm_password }) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirm_password: confirm_password,
        role: "ADMIN",
      }),
    });
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
