import { useEffect, useState } from "react";
import { UserApi } from "../../libs/api/UserApi";
import { alertError, alertSuccess, alertConfirm } from "../../libs/alert";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Helper } from "../../utils/Helper";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { logout, setAdminStatus } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const fetchProfile = async () => {
    const response = await UserApi.getUserProfile();
    if (!response.ok) {
      alertError(t("profile.updateFail"));
      return;
    }
    const responseBody = await response.json();
    setUser(responseBody.user);

    setFormData({
      name: responseBody.user.name,
      email: responseBody.user.email || "",
      phone: responseBody.user.phone || "",
      password: "",
      confirm_password: "",
    });
  };

  const handleLogout = async () => {
    const confirm = await alertConfirm(t("profile.logoutConfirm"));
    if (!confirm) return;

    setAdminStatus(false);
    logout();
    await alertSuccess(t("profile.logoutSuccess"));
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirm = await alertConfirm(t("profile.deleteConfirm"));
    if (!confirm) return;

    const response = await UserApi.deleteUser(user.id);
    if (!response.ok) {
      const responseBody = await response.json();
      let errorMessage = t("profile.deleteFail");

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
      return;
    }

    setAdminStatus(false);
    logout();
    await alertSuccess(t("profile.deleteSuccess"));
    navigate("/");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const confirm = await alertConfirm(t("profile.updateConfirm"));
    if (!confirm) return;

    const payload = {
      name: formData.name,
      password: formData.password,
      email: formData.email || null,
      phone: formData.phone || null,
    };

    if (formData.password.trim() !== "") {
      if (formData.password !== formData.confirm_password) {
        return alertError(t("profile.passwordMismatch"));
      } else {
        payload.password = formData.password;
      }
    }

    const response = await UserApi.updateUser(
      payload.name,
      payload.email,
      payload.password,
      payload.phone
    );

    if (!response.ok) {
      const responseBody = await response.json();
      let errorMessage = t("profile.updateFail");

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
      return;
    }
    await alertSuccess(t("profile.updateSuccess"));
    setEditMode(false);
    await fetchProfile();
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        alertSuccess(t("profile.copied"));
      } catch (err) {
        alertError(t("profile.copyFail"));
      }
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alertSuccess(t("profile.copied"));
      } catch (err) {
        alertError(t("profile.copyFail"));
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        {t("profile.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FiArrowLeft className="text-lg" /> {t("profile.back")}
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
              {user.name.charAt(0)}
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              {user.name}
            </h1>
            <p className="text-gray-500">
              {user.email ? user.email : user.phone ? user.phone : "-"}
            </p>
          </div>

          {!editMode && (
            <>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t("profile.id")}</span>
                  <div className="flex gap-2 items-center">
                    <span className="font-medium text-gray-800">{user.id}</span>
                    <button
                      className="text-xs text-green-600 underline"
                      onClick={() => copyToClipboard(user.id)}
                    >
                      {t("profile.copy")}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>{t("profile.name")}</span>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("profile.email")}</span>
                  <span className="font-medium text-gray-800">
                    {user.email ? user.email : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("profile.phone")}</span>
                  <span className="font-medium text-gray-800">
                    {user.phone_number ? user.phone_number : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("profile.joined")}</span>
                  <span className="font-medium text-gray-800">
                    {Helper.formatTanggal(user.created_at)}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:opacity-90 transition"
                >
                  {t("profile.edit")}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold hover:opacity-90 transition"
                >
                  {t("profile.logout")}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full py-3 rounded-lg border border-red-400 text-red-500 font-semibold hover:bg-red-50 transition"
                >
                  {t("profile.delete")}
                </button>
              </div>
            </>
          )}

          {editMode && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("profile.name")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("profile.email")}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder={t("profile.form.emailPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("profile.phone")}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder={t("profile.form.phonePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder={t("profile.form.passwordPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder={t("profile.form.passwordPlaceholder")}
                />
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user.name,
                      email: user.email || "",
                      phone: user.phone || "",
                      password: "",
                    });
                  }}
                  className="w-1/2 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  {t("profile.form.cancel")}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-lg bg-green-500 text-white font-semibold hover:opacity-90 transition"
                >
                  {t("profile.form.save")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
