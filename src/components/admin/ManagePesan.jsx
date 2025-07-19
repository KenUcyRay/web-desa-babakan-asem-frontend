import { useEffect, useState } from "react";
import { FaTrash, FaEnvelopeOpen } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { MessageApi } from "../../libs/api/MessageApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManagePesan() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all"); // all | read | unread
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchMessages = async () => {
    let query = `?page=${page}&limit=${perPage}`;
    if (filter === "read") query += `&is_read=true`;
    if (filter === "unread") query += `&is_read=false`;

    const response = await MessageApi.getMessages();
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil pesan.");
      return;
    }
    setMessages(responseBody.messages || []);
  };

  useEffect(() => {
    fetchMessages();
  }, [filter, page]);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm(
      "Apakah Anda yakin ingin menghapus pesan ini?"
    );
    if (!confirm) return;

    const response = await MessageApi.deleteMessage(id);
    if (!response.ok) {
      await alertError("Gagal menghapus pesan.");
      return;
    }

    await alertSuccess("Pesan berhasil dihapus.");
    setMessages(messages.filter((p) => p.id !== id));
  };

  const handleMarkRead = async (id) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, is_read: true } : m
    );
    setMessages(updated);

    // Jika ada API mark as read, jalankan di sini
    await MessageApi.markAsRead(id);
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "read") return m.is_read;
    if (filter === "unread") return !m.is_read;
    return true;
  });

  const totalPages = Math.ceil(filteredMessages.length / perPage);
  const paginatedMessages = filteredMessages.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Pesan Masuk</h1>

        {/* FILTER */}
        <div className="flex gap-2 mb-4">
          {["all", "read", "unread"].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded ${
                filter === f ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
            >
              {f === "all"
                ? "Semua"
                : f === "read"
                ? "Sudah Dibaca"
                : "Belum Dibaca"}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {paginatedMessages.length === 0 ? (
            <p className="text-gray-500 italic">Tidak ada pesan</p>
          ) : (
            paginatedMessages.map((p) => (
              <div
                key={p.id}
                className={`bg-white p-4 rounded-xl shadow flex justify-between ${
                  p.is_read ? "opacity-80" : ""
                }`}
              >
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-gray-500">{p.email}</p>
                  <p className="mt-2 text-gray-700">{p.message}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {!p.is_read && (
                    <button
                      onClick={() => handleMarkRead(p.id)}
                      className="flex items-center gap-1 text-green-500 hover:text-green-700"
                    >
                      <FaEnvelopeOpen /> Tandai Dibaca
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
