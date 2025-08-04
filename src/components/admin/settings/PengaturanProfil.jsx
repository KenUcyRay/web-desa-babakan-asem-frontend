import { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaSave,
  FaIdBadge,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { UserApi } from "../../../libs/api/UserApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function PengaturanProfil() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfile = async () => {
    const response = await UserApi.profile(i18n.language);
    if (!response.ok) return;

    const responseBody = await response.json();
    setProfile(responseBody.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      alertError(t("settingProfile.messages.errors.fillMinimumField"));
      return;
    }

    if (
      !(await alertConfirm(
        t("settingProfile.messages.confirmations.saveChanges")
      ))
    )
      return;

    if (password.trim() !== "" && confirmPassword.trim() === "") {
      alertError(t("settingProfile.messages.errors.fillConfirmPassword"));
      return;
    }

    if (password !== confirmPassword) {
      alertError(t("settingProfile.messages.errors.passwordMismatch"));
      return;
    }

    const updatedName = name === "" ? undefined : name;
    const updatedEmail = email === "" ? undefined : email;
    const updatedPassword = password === "" ? undefined : password;
    const updatedConfirmPassword =
      confirmPassword === "" ? undefined : confirmPassword;

    const response = await UserApi.updateUser(
      updatedName,
      updatedEmail,
      updatedPassword,
      updatedConfirmPassword,
      i18n.language
    );

    const responseBody = await response.json();

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    if (!response.ok) {
      let errorMessage = t(
        "settingProfile.messages.errors.failedToSaveChanges"
      );
      if (responseBody.error && Array.isArray(responseBody.error)) {
        errorMessage = responseBody.error
          .map((err) =>
            err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
          )
          .join(", ");
      } else if (typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      alertError(errorMessage);
      return;
    }

    setProfile(responseBody.user);
    alertSuccess(t("settingProfile.messages.success.changesSaved"));
  };

  useEffect(() => {
    fetchProfile();
  }, [i18n.language]);

  return (
    <div className="font-[Poppins,sans-serif] min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* HEADER - Enhanced with gradient */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-20"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex justify-center items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-xl" />
                </div>
                {t("settingProfile.title")}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {t("settingProfile.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID Admin - Enhanced with gradient */}
          <div className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
                <label className="font-semibold mb-3 flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <FaIdBadge className="text-white" />
                  </div>
                  <span className="text-lg">
                    {t("settingProfile.form.fields.adminId")}
                  </span>
                </label>
                <div className="flex gap-3 mt-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={profile.id || ""}
                      readOnly
                      className="border border-gray-200 rounded-xl w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-not-allowed text-gray-600 font-mono text-sm shadow-inner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.id);
                      alertSuccess(
                        t("settingProfile.messages.success.idCopied")
                      );
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {t("settingProfile.form.buttons.copy")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nama & Email - Enhanced with gradients */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-lime-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
                  <label className="font-semibold mb-3 flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaUser className="text-white" />
                    </div>
                    <span className="text-lg">
                      {t("settingProfile.form.fields.name")}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        profile.name ||
                        t("settingProfile.form.placeholders.nameAdmin")
                      }
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-200 rounded-xl w-full p-4 mt-2 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gradient-to-r from-white to-green-50/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
                  <label className="font-semibold mb-3 flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaUser className="text-white" />
                    </div>
                    <span className="text-lg">
                      {t("settingProfile.form.fields.email")}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder={
                        profile.email ||
                        t("settingProfile.form.placeholders.emailAdmin")
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-200 rounded-xl w-full p-4 mt-2 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gradient-to-r from-white to-emerald-50/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Fields - Enhanced with gradients and eye icons */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* New Password Field */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
                  <label className="font-semibold mb-3 flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaLock className="text-white" />
                    </div>
                    <span className="text-lg">
                      {t("settingProfile.form.fields.newPassword")}
                    </span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t(
                        "settingProfile.form.placeholders.enterNewPassword"
                      )}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-gray-200 rounded-xl w-full p-4 pr-12 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-gradient-to-r from-white to-red-50/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-200">
                  <label className="font-semibold mb-3 flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                      <FaLock className="text-white" />
                    </div>
                    <span className="text-lg">
                      {t("settingProfile.form.fields.confirmPassword")}
                    </span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t(
                        "settingProfile.form.placeholders.confirmNewPassword"
                      )}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border border-gray-200 rounded-xl w-full p-4 pr-12 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/30"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button - Enhanced with gradient */}
          <div className="flex justify-end pt-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                type="submit"
                className="relative bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:shadow-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <FaSave className="text-sm" />
                </div>
                {t("settingProfile.form.buttons.saveChanges")}
              </button>
            </div>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="fixed bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-lime-400/20 to-green-400/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="fixed top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
}
