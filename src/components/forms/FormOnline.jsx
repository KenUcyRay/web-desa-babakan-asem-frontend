import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { alertError, alertSuccess } from "../../libs/alert";
import { useTranslation } from "react-i18next";

export default function FormOnline() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AdministrasiApi.createOnline(formData);
    const responseBody = await response.json();
    if (!response.ok) {
      let errorMessage = "Gagal menyimpan perubahan.";
      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) =>
          err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
        );
        errorMessage = errorMessages.join(", ");
      } else if (typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    await alertSuccess("Permohonan layanan online berhasil dikirim!");
    navigate("/administrasi");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t("formOnline.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formOnline.form.nameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t("formOnline.form.namePlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formOnline.form.emailLabel")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t("formOnline.form.emailPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formOnline.form.phoneLabel")}
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t("formOnline.form.phonePlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Layanan Online */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formOnline.form.typeLabel")}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="">{t("formOnline.form.typeDefault")}</option>
              <option value="TRACKING_SURAT">
                {t("formOnline.form.typeOptions.TRACKING_SURAT")}
              </option>
              <option value="CEK_STATUS_LAYANAN">
                {t("formOnline.form.typeOptions.CEK_STATUS_LAYANAN")}
              </option>
              <option value="PERMOHONAN">
                {t("formOnline.form.typeOptions.PERMOHONAN")}
              </option>
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              {t("formOnline.form.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              {t("formOnline.form.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
