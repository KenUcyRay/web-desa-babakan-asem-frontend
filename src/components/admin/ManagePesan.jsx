import { useEffect, useState } from "react";
import { FaTrash, FaEnvelopeOpen } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { MessageApi } from "../../libs/api/MessageApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import Pagination from "../ui/Pagination";

export default function ManagePesan() {
  const { t, i18n } = useTranslation();
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
    <div className="font-[Poppins,sans-serif]">
      {/* - Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("managePesan.title")}
        </h1>
      </div>

      {/* - FILTER BUTTONS */}
      <div className="flex gap-2 mb-4">
        {["all", "read", "unread"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === f
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          >
            {t(`managePesan.filters.${f}`)}
          </button>
        ))}
      </div>

      {/* - LIST PESAN */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">
            {t("managePesan.empty.noMessages")}
          </p>
        ) : (
          messages.map((p) => (
            <div
              key={p.id}
              className={`bg-white p-4 rounded-xl shadow flex justify-between items-start transition ${
                p.is_read ? "opacity-80" : "border-l-4 border-blue-400"
              }`}
            >
              <div>
                <h2 className="font-semibold text-gray-800">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.email}</p>
                <p className="mt-2 text-gray-700">{p.message}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {!p.is_read && (
                  <button
                    onClick={() => handleMarkRead(p.id)}
                    className="flex items-center gap-1 text-green-500 hover:text-green-700 text-sm"
                  >
                    <FaEnvelopeOpen /> {t("managePesan.buttons.markRead")}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* - PAGINATION */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
