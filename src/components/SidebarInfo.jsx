import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaUsers, FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { NewsApi } from "../libs/api/NewsApi";
import { Helper } from "../utils/Helper";
import { AgendaApi } from "../libs/api/AgendaApi";

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

      {/* ✅ Kartu Kontak Kami */}
      <div className="space-y-4">
        {[
          {
            icon: <FaWhatsapp className="w-6 h-6" />,
            label: "WhatsApp",
            value: "0812-3456-7890",
          },
          {
            icon: <FaUsers className="w-6 h-6" />,
            label: "Telepon",
            value: "(0261) 123456",
          },
          {
            icon: <HiOutlineMail className="w-6 h-6" />,
            label: "Email",
            value: "info@babakanasem.id",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#B6F500] to-[#FFFCE2] p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-4"
          >
            <div className="bg-white p-2 rounded-full text-green-600">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-gray-700">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
