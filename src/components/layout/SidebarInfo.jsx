import berita1 from "../../assets/berita1.jpeg";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaUsers, FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useEffect, useState } from "react";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import { AgendaApi } from "../../libs/api/AgendaApi";

export default function SidebarInfo() {
  const [news, setNews] = useState([]);
  const [agenda, setAgenda] = useState([]);

  const fetchNews = async () => {
    const response = await NewsApi.getNews(1, 4);
    if (response.status === 200) {
      const responseBody = await response.json();
      setNews(responseBody.news);
    } else {
      alertError("Gagal mengambil data berita. Silakan coba lagi nanti.");
    }
  };

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 4);
    if (response.status === 200) {
      const responseBody = await response.json();
      setAgenda(responseBody.agenda);
    } else {
      alertError("Gagal mengambil data agenda. Silakan coba lagi nanti.");
    }
  };

  const fetchAll = async () => {
    await Promise.all([fetchNews(), fetchAgenda()]);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      {/* ✅ Kartu Berita Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Berita Terbaru</h2>
        {news.map((item) => (
          <div key={item.news.id} className="relative">
            <Link
              to={`/berita/${item.news.id}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/news/images/${
                  item.news.featured_image
                }`}
                alt={`Berita ${item.news.title}`}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold hover:text-green-600">
                  {item.news.title}
                </p>
                <p className="text-xs text-gray-500">
                  {Helper.formatTanggal(item.news.published_at)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ✅ Kartu Agenda Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Agenda Terbaru</h2>
        {agenda.map((item) => (
          <div key={item.agenda.id} className="relative">
            <Link
              to={`/agenda/${item.agenda.id}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                  item.agenda.featured_image
                }`}
                alt={`Agenda ${item.agenda.title}`}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold hover:text-green-600">
                  {item.agenda.title}
                </p>
                <p className="text-xs text-gray-500">
                  {Helper.formatTanggal(item.agenda.published_at)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ✅ Kartu Kontak Kami (MIRIP YANG DICONTOHKAN) */}
      <div className="space-y-4">
        {/* Telepon */}
        <a
          href="tel:081234567890"
          className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
            <FaPhoneAlt />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Telepon</h4>
            <p className="text-xs text-gray-700">(0261) 123456</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/6281234567890"
          className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
            <FaWhatsapp />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
            <p className="text-xs text-gray-700">0812‑3456‑7890</p>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:info@babakanasem.id"
          className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
            <FaEnvelope />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Email Kami</h4>
            <p className="text-xs text-gray-700">info@babakanasem.id</p>
          </div>
        </a>
      </div>
    </div>
  );
}
