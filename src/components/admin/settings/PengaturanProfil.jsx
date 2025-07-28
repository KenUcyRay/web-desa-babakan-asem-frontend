import { useEffect, useState } from "react";
import { FaUser, FaLock, FaSave, FaIdBadge } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { UserApi } from "../../../libs/api/UserApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function PengaturanProfil() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    const response = await UserApi.getUserProfile();
    if (!response.ok) {
      alertError(t("settingProfile.messages.errors.failedToGetProfile"));
      return;
    }
    const responseBody = await response.json();
    setProfile(responseBody.user);
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
      updatedConfirmPassword
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
  }, []);

  return (
    <div className="font-[Poppins,sans-serif] max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <FaUser className="text-green-600" /> {t("settingProfile.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("settingProfile.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ ID Admin (read-only + tombol salin) */}
        <div className="bg-white border rounded-lg p-4">
          <label className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
            <FaIdBadge className="text-green-600" />{" "}
            {t("settingProfile.form.fields.adminId")}
          </label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={profile.id || ""}
              readOnly
              className="border rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed text-gray-600"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(profile.id);
                alertSuccess(t("settingProfile.messages.success.idCopied"));
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg text-sm"
            >
              {t("settingProfile.form.buttons.copy")}
            </button>
          </div>
        </div>

        {/* ✅ Nama & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <label className="font-semibold mb-1 flex items-center gap-2 text-gray-700">
              <FaUser className="text-green-600" />{" "}
              {t("settingProfile.form.fields.name")}
            </label>
            <input
              type="text"
              placeholder={
                profile.name || t("settingProfile.form.placeholders.nameAdmin")
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg w-full p-2 mt-1"
            />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <label className="font-semibold mb-1 flex items-center gap-2 text-gray-700">
              <FaUser className="text-green-600" />{" "}
              {t("settingProfile.form.fields.email")}
            </label>
            <input
              type="email"
              placeholder={
                profile.email ||
                t("settingProfile.form.placeholders.emailAdmin")
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg w-full p-2 mt-1"
            />
          </div>
        </div>

        {/* ✅ Password Baru */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <label className="font-semibold mb-1 flex items-center gap-2 text-gray-700">
              <FaLock className="text-green-600" />{" "}
              {t("settingProfile.form.fields.newPassword")}
            </label>
            <input
              type="password"
              placeholder={t(
                "settingProfile.form.placeholders.enterNewPassword"
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg w-full p-2 mt-1"
            />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <label className="font-semibold mb-1 flex items-center gap-2 text-gray-700">
              <FaLock className="text-green-600" />{" "}
              {t("settingProfile.form.fields.confirmPassword")}
            </label>
            <input
              type="password"
              placeholder={t(
                "settingProfile.form.placeholders.confirmNewPassword"
              )}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-lg w-full p-2 mt-1"
            />
          </div>
        </div>

        {/* ✅ Tombol Simpan */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <FaSave /> {t("settingProfile.form.buttons.saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}
