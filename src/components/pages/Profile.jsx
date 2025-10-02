import { useEffect, useState } from "react";
import { UserApi } from "../../libs/api/UserApi";
import { alertError, alertSuccess, alertConfirm } from "../../libs/alert";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Helper } from "../../utils/Helper";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { setProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const fetchProfile = async () => {
    const response = await UserApi.profile(i18n.language);
    if (!response.ok) return;

    const responseBody = await response.json();
    setUser(responseBody.data);

    setFormData({
      name: responseBody.data.name,
      email: responseBody.data.email || "",
      phone: responseBody.data.phone_number || "",
      password: "",
      confirm_password: "",
    });
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    const confirm = await alertConfirm(t("profile.logoutConfirm"));
    if (!confirm) return;

    try {
      await logout(true); // Pass true to show success alert
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if server call fails
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  const handleDelete = async () => {
    const confirm = await alertConfirm(t("profile.deleteConfirm"));
    if (!confirm) return;

    const response = await UserApi.deleteUser(i18n.language);
    if (!response.ok) {
      const responseBody = await response.json();
      await Helper.errorResponseHandler(responseBody, Helper.CONTEXT.DELETE);
      return;
    }
    setProfile(null);
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
      confirm_password: formData.confirm_password,
      email: formData.email || null,
      phone: formData.phone || null,
    };

    const response = await UserApi.updateUser(
      payload.name,
      payload.email,
      payload.password,
      payload.confirm_password,
      payload.phone,
      i18n.language
    );

    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json(), Helper.CONTEXT.UPDATE);
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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    fetchProfile();
  }, [i18n.language]);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        {t("profile.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium cursor-pointer"
        >
          <FiArrowLeft className="text-lg" /> {t("profile.back")}
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center text-white">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-green-100 text-sm mt-1">
              {user.email || user.phone_number || "User"}
            </p>
          </div>

          {!editMode && (
            <div className="p-6">
              {/* User Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{t("profile.id")}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm">{user.id}</span>
                    <button
                      className="text-xs text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={() => copyToClipboard(user.id)}
                    >
                      {t("profile.copy")}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{t("profile.email")}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {user.email || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{t("profile.phone")}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {user.phone_number || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 text-sm">{t("profile.joined")}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {Helper.formatTanggal(user.created_at)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition cursor-pointer"
                >
                  {t("profile.edit")}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  {t("profile.logout")}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full py-3 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition cursor-pointer"
                >
                  {t("profile.delete")}
                </button>
              </div>
            </div>
          )}

          {editMode && (
            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("profile.name")}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("profile.email")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t("profile.form.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("profile.phone")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t("profile.form.phonePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t("profile.form.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t("profile.form.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={handleShowConfirmPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user.name,
                      email: user.email || "",
                      phone: user.phone_number || "",
                      password: "",
                      confirm_password: "",
                    });
                  }}
                  className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  {t("profile.form.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition cursor-pointer"
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
