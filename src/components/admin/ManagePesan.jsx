import { useEffect, useState } from "react";
import { FaEnvelopeOpen, FaEnvelope, FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { MessageApi } from "../../libs/api/MessageApi";
import Pagination from "../ui/Pagination";

export default function ManagePesan() {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchMessages = async () => {
    const query = `?page=${page}&size=${perPage}${
      filter === "read"
        ? "&isRead=true"
        : filter === "unread"
        ? "&isRead=false"
        : ""
    }`;

    const response = await MessageApi.get(query, i18n.language);
    const responseBody = await response.json();

    if (!response.ok) {
      return;
    }

    setMessages(responseBody.data || []);
    setTotalPages(responseBody.total_page);
  };

  useEffect(() => {
    fetchMessages();
  }, [filter, page]);

  const handleMarkRead = async (id) => {
    const response = await MessageApi.markAsRead(id, i18n.language);
    const responseBody = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }
    const updated = messages.map((m) =>
      m.id === id ? { ...m, is_read: true } : m
    );
    setMessages(updated);
  };

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* - Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            📩 Kelola Pesan Masuk
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola pesan yang masuk dari pengunjung
          </p>
        </div>
      </div>

      {/* - FILTER BUTTONS */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <h2 className="font-medium text-gray-700">Filter Pesan</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "read", "unread"].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                filter === f
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
            >
              {f === "read" && <FaEnvelopeOpen size={12} />}
              {f === "unread" && <FaEnvelope size={12} />}
              {f === "all"
                ? "Semua Pesan"
                : f === "read"
                ? "Pesan Dibaca"
                : "Pesan Belum Dibaca"}
            </button>
          ))}
        </div>
      </div>

      {/* - LIST PESAN */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-5 rounded-full">
                <FaEnvelope className="text-4xl text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Belum Ada Pesan
            </h3>
            <p className="text-gray-500">Tidak ada pesan</p>
          </div>
        ) : (
          messages.map((p) => (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition flex flex-col md:flex-row justify-between gap-4 ${
                p.is_read ? "opacity-90" : "border-l-4 border-blue-500"
              }`}
            >
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h2 className="font-bold text-gray-800">{p.name}</h2>
                  <span className="hidden md:block text-gray-400">•</span>
                  <p className="text-sm text-gray-600">{p.email}</p>
                </div>
                <p className="text-gray-700 mt-2">{p.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!p.is_read && (
                  <button
                    onClick={() => handleMarkRead(p.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    <FaEnvelopeOpen size={14} /> Tandai Dibaca
                  </button>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(p.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* - PAGINATION */}
      {messages.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
