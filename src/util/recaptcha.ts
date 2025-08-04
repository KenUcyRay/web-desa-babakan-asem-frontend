import axios from "axios";

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    }
  );

  return response.data.success;
};
