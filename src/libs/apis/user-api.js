export class UserApi {
  static async userLogin(email, password, reCaptchaToken) {
    return await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
