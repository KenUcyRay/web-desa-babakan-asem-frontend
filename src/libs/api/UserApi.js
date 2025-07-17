export class UserApi {
  static async userLogin(email, password, rememberMe, reCaptchaToken) {
    console.log(reCaptchaToken);
    return await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        remember_me: rememberMe,
        re_captcha_token: reCaptchaToken,
      }),
    });
  }

  static async userRegister(
    name,
    email,
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
        email: email,
        password: password,
        confirm_password: confirmPassword,
        remember_me: rememberMe,
        re_captcha_token: reCaptchaToken,
      }),
    });
  }
}
