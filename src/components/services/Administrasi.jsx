import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaWpforms, FaUsers, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Administrasi() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const services = [
    {
      title: t("administrasi.services.0.title"),
      desc: t("administrasi.services.0.desc"),
      button: t("administrasi.services.0.button"),
      icon: <HiOutlineMail className="text-4xl" />,
      route: "/surat-pengantar",
    },
    {
      title: t("administrasi.services.1.title"),
      desc: t("administrasi.services.1.desc"),
      button: t("administrasi.services.1.button"),
      icon: <FaWpforms className="text-4xl" />,
      route: "/formulir-layanan",
    },
    {
      title: t("administrasi.services.2.title"),
      desc: t("administrasi.services.2.desc"),
      button: t("administrasi.services.2.button"),
      icon: <FaUsers className="text-4xl" />,
      route: "/infografis/penduduk",
    },
    {
      title: t("administrasi.services.3.title"),
      desc: t("administrasi.services.3.desc"),
      button: t("administrasi.services.3.button"),
      icon: <FaGlobe className="text-4xl" />,
      route: "/layanan-online",
    },
  ];

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tombol atas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/surat-pengantar")}
            className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition"
          >
            {t("administrasi.topButtons.ajukan")}
          </button>
          <button
            onClick={() => navigate("/panduan")}
            className="bg-white text-black font-semibold px-6 py-2 rounded-full border hover:bg-gray-100 transition"
          >
            {t("administrasi.topButtons.panduan")}
          </button>
        </div>

        {/* Kartu layanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {/* Icon bulat */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-lime-100 text-green-600 mb-4">
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-gray-600 text-sm mt-2 mb-4">{service.desc}</p>
              <button
                onClick={() => navigate(service.route)}
                className="bg-lime-400 text-black font-semibold px-5 py-2 rounded-xl hover:bg-lime-300 transition"
              >
                {service.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
