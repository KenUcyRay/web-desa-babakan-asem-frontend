import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Panduan() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-100 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Tombol kembali ke Ajukan Sekarang */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => navigate("/administrasi")}
            className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-lime-300 flex items-center gap-2 cursor-pointer"
          >
            <FaCheckCircle />
            {t("guide.button")}
          </button>
        </div>

        {/* Judul & Isi Panduan */}
        <h1 className="text-4xl font-extrabold text-center mb-8 text-lime-700 drop-shadow-md">
          {t("guide.title")}
        </h1>

        <p className="text-gray-700 text-center mb-12 text-lg max-w-xl mx-auto">
          {t("guide.description")}
        </p>

        {/* Langkah Umum */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-lime-600 mb-5 flex items-center gap-3">
            <FaFileAlt className="text-lime-500" /> {t("guide.stepsTitle")}
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-800 text-lg">
            {t("guide.steps", { returnObjects: true }).map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-lime-500 mt-1">📄</span> {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Jenis Layanan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-lime-600 mb-5 flex items-center gap-3">
            <FaFileAlt className="text-lime-500" /> {t("guide.servicesTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 text-lg max-w-md mx-auto">
            {t("guide.services", { returnObjects: true }).map((service, i) => (
              <li key={i}>{service}</li>
            ))}
          </ul>
        </div>

        {/* Catatan penting */}
        <div className="p-5 border-l-8 border-yellow-400 bg-yellow-50 text-yellow-900 text-lg rounded-lg flex items-center gap-4 shadow-md animate-pulse">
          <FaClock className="w-8 h-8" />
          <p
            dangerouslySetInnerHTML={{
              __html: t("guide.note"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
