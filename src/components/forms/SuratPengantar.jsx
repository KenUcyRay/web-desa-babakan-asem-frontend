import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { alertSuccess } from "../../libs/alert";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";
import { useAuth } from "../../contexts/AuthContext";

export default function SuratPengantar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { profile, isInitialized } = useAuth();
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
    // Require login before submitting
    if (isInitialized && !profile) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
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
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              {t("formLetter.title")}
            </h1>
            <p className="text-gray-600 text-lg">Silakan lengkapi formulir di bawah ini</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-semibold text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t("formLetter.form.nameLabel")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("formLetter.form.namePlaceholder")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* NIK */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-semibold text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  {t("formLetter.form.nikLabel")}
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder={t("formLetter.form.nikPlaceholder")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Jenis Surat */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("formLetter.form.typeLabel")}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
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
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-semibold text-sm">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t("formLetter.form.noteLabel")}
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder={t("formLetter.form.notePlaceholder")}
                rows="5"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
              ></textarea>
            </div>

            {/* Tombol */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
              >
                {t("formLetter.form.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t("formLetter.form.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}