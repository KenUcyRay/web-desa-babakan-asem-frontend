import axios from "axios";

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const params = new URLSearchParams();
  params.append("secret", process.env.RECAPTCHA_SECRET_KEY || "");
  params.append("response", token);

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.success;
};
