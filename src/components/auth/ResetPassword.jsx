import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import resetImage from "../../assets/reset.png";
import { alertError, alertSuccess } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";
import { useTranslation, Trans } from "react-i18next";
import { useProfile } from "../../hook/useProfile";

export default function ResetPassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { profile, isReady } = useProfile(); // Assuming useAuth provides profile and isReady

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const response = await UserApi.resetPassword(
      token,
      password,
      confirmPassword,
      i18n.language
    );

    if (response.status === 204) {
      await alertSuccess(t("resetPassword.success"));
      navigate("/login");
    } else {
      await Helper.errorResponseHandler(await response.json());
    }

    setPassword("");
    setConfirmPassword("");
  };

  const verifyToken = async () => {
    const response = await UserApi.verifyResetToken(token, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      navigate("/forgot-password");
    }
  };

  useEffect(() => {
    verifyToken();
  }, [i18n.language]);

  useEffect(() => {
    if (isReady && profile !== null) {
      navigate("/");
    }
  }, [isReady]);

  return (
    <div className="flex min-h-screen font-poppins">
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl text-gray-900 font-normal mb-2 text-center">
            {t("resetPassword.title")}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            <Trans
              i18nKey="resetPassword.subtitle"
              components={{ strong: <strong className="font-semibold" /> }}
            />
          </p>

          <form className="space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {t("resetPassword.newPasswordLabel")}
              </label>
              <input
                type="password"
                placeholder={t("resetPassword.newPasswordPlaceholder")}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {t("resetPassword.confirmPasswordLabel")}
              </label>
              <input
                type="password"
                placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
              disabled={!token}
            >
              {t("resetPassword.button")}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={resetImage}
          alt="Reset Password"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
