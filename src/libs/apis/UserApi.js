export class UserApi {
  static async userLogin(email, password, reCaptchaToken) {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        remember_me: false,
        re_captcha_token: reCaptchaToken,
      }),
    });
  }
}
