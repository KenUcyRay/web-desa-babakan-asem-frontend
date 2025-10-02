import { Link } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { ContactApi } from "../../libs/api/ContactApi";
import { useTranslation } from "react-i18next";

export default function SidebarInfo() {
  const [news, setNews] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { t, i18n } = useTranslation();

  const iconMap = {
    LOKASI: FaMapMarkerAlt,
    WHATSAPP: FaWhatsapp,
    EMAIL: FaEnvelope,
  };

  const getContactIcon = (type) => {
    return iconMap[type] || FaEnvelope;
  };

  const getContactLink = (contact) => {
    switch (contact.type) {
      case "WHATSAPP":
        const waNumber = contact.value.startsWith("0")
          ? "62" + contact.value.substring(1)
          : contact.value;
        return `https://wa.me/${waNumber}`;
      case "EMAIL":
        return `mailto:${contact.value}`;
      default:
        return null;
    }
  };

  const fetchNews = async () => {
    const response = await NewsApi.getNews(1, 4, i18n.language);
    if (!response.ok) return;
    const responseBody = await response.json();
    setNews(responseBody.news);
  };

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 4, "", i18n.language);
    if (!response.ok) return;

    const responseBody = await response.json();
    setAgenda(responseBody.agenda);
  };

  const fetchContacts = async () => {
    try {
      const response = await ContactApi.getPublic();
      // Filter hanya WhatsApp, Email, dan Lokasi
      const filteredContacts = response.filter(contact => 
        ['WHATSAPP', 'EMAIL', 'LOKASI'].includes(contact.type)
      );
      setContacts(filteredContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchAll = async () => {
    await Promise.all([fetchNews(), fetchAgenda(), fetchContacts()]);
  };

  useEffect(() => {
    fetchAll();
  }, [i18n.language]);

  return (
    <div className="space-y-6">
      {/* ✅ Kartu Berita Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">
          {t("sidebarInfo.latest_news")}
        </h2>
        {news.map((item) => (
          <div key={item.news.id} className="relative">
            <Link
              to={`/berita/${item.news.id}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
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
        <h2 className="font-bold text-lg mb-4 border-b pb-2">
          {t("sidebarInfo.latest_agenda")}
        </h2>
        {agenda.map((item) => (
          <div key={item.agenda.id} className="relative">
            <Link
              to={`/agenda/${item.agenda.id}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
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
        {contacts.map((contact) => {
          const Icon = getContactIcon(contact.type);
          const link = getContactLink(contact);
          const isClickable = link !== null;

          if (isClickable) {
            return (
              <a
                key={contact.id}
                href={link}
                className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
                target={contact.type === "WHATSAPP" ? "_blank" : undefined}
                rel={contact.type === "WHATSAPP" ? "noopener noreferrer" : undefined}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                  <Icon />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {contact.label}
                  </h4>
                  <p className="text-xs text-gray-700">
                    {contact.value}
                  </p>
                </div>
              </a>
            );
          }

          return (
            <div
              key={contact.id}
              className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                <Icon />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {contact.label}
                </h4>
                <p className="text-xs text-gray-700">
                  {contact.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
