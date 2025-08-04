import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { alertSuccess } from "../../libs/alert";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

export default function SuratPengantar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    type: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await AdministrasiApi.createPengantar(
      formData,
      i18n.language
    );
    const responseBody = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }

    await alertSuccess("Pengajuan surat pengantar berhasil dikirim!");
    navigate("/administrasi");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t("formLetter.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLetter.form.nameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("formLetter.form.namePlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLetter.form.nikLabel")}
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder={t("formLetter.form.nikPlaceholder")}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Jenis Surat */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLetter.form.typeLabel")}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="">{t("formLetter.form.typeDefault")}</option>
              <option value="KTP">
                {t("formLetter.form.typeOptions.KTP")}
              </option>
              <option value="KK">{t("formLetter.form.typeOptions.KK")}</option>
              <option value="SKCK">
                {t("formLetter.form.typeOptions.SKCK")}
              </option>
              <option value="LAINNYA">
                {t("formLetter.form.typeOptions.LAINNYA")}
              </option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t("formLetter.form.noteLabel")}
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder={t("formLetter.form.notePlaceholder")}
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
              {t("formLetter.form.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              {t("formLetter.form.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
