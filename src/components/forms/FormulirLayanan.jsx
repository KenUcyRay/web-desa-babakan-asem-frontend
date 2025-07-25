import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { alertError, alertSuccess } from "../../libs/alert";
import { useTranslation } from "react-i18next";

export default function FormulirLayanan() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AdministrasiApi.createLayanan(formData);
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

    await alertSuccess("Pengajuan surat layanan berhasil dikirim!");
    navigate("/administrasi");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t("formLayanan.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLayanan.form.nameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t("formLayanan.form.namePlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLayanan.form.emailLabel")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t("formLayanan.form.emailPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Jenis Layanan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLayanan.form.typeLabel")}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="">{t("formLayanan.form.typeDefault")}</option>
              <option value="PENGADUAN">{t("formLayanan.form.typeOptions.PENGADUAN")}</option>
              <option value="PERMOHONAN">{t("formLayanan.form.typeOptions.PERMOHONAN")}</option>
              <option value="LAINNYA">{t("formLayanan.form.typeOptions.LAINNYA")}</option>
            </select>
          </div>

          {/* Pesan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLayanan.form.messageLabel")}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("formLayanan.form.messagePlaceholder")}
              rows="4"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>

          {/* Tombol */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              {t("formLayanan.form.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              {t("formLayanan.form.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
