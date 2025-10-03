import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotImage from "../../assets/forgot.png";
import { UserApi } from "../../libs/api/UserApi";
import { alertError, alertSuccess } from "../../libs/alert";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../hook/useProfile";
import { Helper } from "../../utils/Helper";
import { AnimatePresence, motion } from "framer-motion";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [resetMethod, setResetMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { profile, isReady } = useProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();

    alertSuccess(t("forgotPassword.loading"));

    const response = await UserApi.forgetPassword(
      resetMethod === "email" ? email : "",
      resetMethod === "phone" ? phone : "",
      i18n.language
    );

    if (response.status === 204) {
      await alertSuccess(t("forgotPassword.successSend"));
      navigate("/wait");
      return;
    }
    await Helper.errorResponseHandler(await response.json(), Helper.CONTEXT.FORGOT_PASSWORD);
    setEmail("");
    setPhone("");
  };

  useEffect(() => {
    if (isReady && profile !== null) {
      navigate("/");
    }
  }, [isReady]);

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Form Forgot Password */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl text-gray-900 font-normal text-center mb-2">
            {t("forgotPassword.title")}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {t("forgotPassword.subtitle")}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-700 font-medium">
                  {resetMethod === "email"
                    ? t("forgotPassword.emailLabel")
                    : "Nomor Telepon"}
                </label>
                <div className="flex gap-4">
                  <label
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setResetMethod("email")}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        resetMethod === "email"
                          ? "border-green-400"
                          : "border-gray-300"
                      }`}
                    >
                      {resetMethod === "email" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-[#B6F500]" />
                      )}
                    </span>
                    <span className="text-xs text-gray-700">
                      Email
                    </span>
                  </label>

                  <label
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setResetMethod("phone")}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        resetMethod === "phone"
                          ? "border-green-400"
                          : "border-gray-300"
                      }`}
                    >
                      {resetMethod === "phone" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-[#B6F500]" />
                      )}
                    </span>
                    <span className="text-xs text-gray-700">
                      Telepon
                    </span>
                  </label>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {resetMethod === "email" ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="email"
                      placeholder={t("forgotPassword.emailPlaceholder")}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="tel"
                      placeholder="Masukkan nomor telepon"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              {t("forgotPassword.button")}
            </button>
          </form>
        </div>
      </div>

      {/* Gambar */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={forgotImage}
          alt="Forgot Password"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
