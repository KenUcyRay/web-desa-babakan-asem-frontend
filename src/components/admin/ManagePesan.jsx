import { useEffect, useState } from "react";
import { FaTrash, FaEnvelopeOpen } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { MessageApi } from "../../libs/api/MessageApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManagePesan() {
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
    setMessage(message.filter((p) => p.id !== id));
  };

  const [message, setMessage] = useState([]);

  const fetchMessage = async () => {
    const response = await MessageApi.getMessages();
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil pesan.");
      return;
    }
    setMessage(responseBody.messages);
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Pesan Masuk</h1>

        {/* Filter */}
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
              {f === "all" ? "Semua" : f === "read" ? "Sudah Dibaca" : "Belum Dibaca"}
            </button>
          ))}
        </div>

        {/* List Pesan */}
        <div className="space-y-4">
          {message.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.email}</p>
                <p className="mt-2 text-gray-700">{p.message}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {!p.read && (
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
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
