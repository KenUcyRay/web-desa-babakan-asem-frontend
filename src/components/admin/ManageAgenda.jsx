import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import Pagination from "../ui/Pagination";

export default function ManageAgenda() {
  const type = [
    { id: 1, name: "Regular", value: "REGULAR" },
    { id: 2, name: "Pkk", value: "PKK" },
    { id: 3, name: "Karang Taruna", value: "KARANG_TARUNA" },
    { id: 4, name: "DPD", value: "DPD" },
  ];

  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [typeSelected, setTypeSelected] = useState("REGULAR");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin ingin menghapus agenda ini?"))) return;
    const response = await AgendaApi.deleteAgenda(id);
    if (!response.ok) return alertError("Gagal menghapus agenda.");
    setAgenda(agenda.filter((a) => a.id !== id));
  };

  const handleEdit = (id) => {
    const item = agenda.find((a) => a.id === id);
    if (!item) return;
    setTitle(item.title);
    setContent(item.content);
    setStartTime(item.start_time);
    setEndTime(item.end_time);
    setLocation(item.location);
    setFeaturedImage(null);
    setIsPublished(item.is_published);
    setEditingId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawData = {
      title,
      content,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      location,
      featured_image: featuredImage,
      is_published: isPublished,
      type: typeSelected,
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit agenda ini?"))) return;
      const response = await AgendaApi.updateAgenda(editingId, rawData);
      const resBody = await response.json();
      if (!response.ok) return alertError(resBody.error || "Gagal update.");
      await alertSuccess("✅ Agenda berhasil diperbarui!");
      resetForm();
      return;
    }

    const response = await AgendaApi.createAgenda(rawData);
    const resBody = await response.json();
    if (!response.ok) return alertError(resBody.error || "Gagal menambah.");
    await alertSuccess("✅ Agenda berhasil ditambahkan!");
    setAgenda([...agenda, resBody.agenda]);
    resetForm();
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

  const fetchAgenda = async () => {
    const response = await AgendaApi.getOwnAgenda(currentPage, 6);
    if (!response.ok) return alertError("Gagal ambil agenda.");
    const resBody = await response.json();
    setAgenda(resBody.agenda);
    setCurrentPage(resBody.page);
    setTotalPages(resBody.total_page);
  };

  useEffect(() => {
    fetchAgenda();
  }, [showForm, currentPage]);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 w-full p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        {/* ✅ Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📅 Manajemen Agenda
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola semua agenda desa dengan mudah
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
            >
              <FiPlus className="text-lg" /> Tambah Agenda
            </button>
          )}
        </div>

        {/* ✅ FORM Tambah / Edit */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200 space-y-4 max-w-3xl"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {editingId ? "✏️ Edit Agenda" : "📝 Tambah Agenda Baru"}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Judul Agenda
              </label>
              <input
                className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Musyawarah Desa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                className="w-full border rounded-lg p-3 h-24 focus:ring focus:ring-blue-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan deskripsi agenda..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mulai
                </label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selesai
                </label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Lokasi Acara
              </label>
              <input
                className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Balai Desa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tipe Agenda
              </label>
              <select
                className="w-full border rounded-lg p-3"
                value={typeSelected}
                onChange={(e) => setTypeSelected(e.target.value)}
              >
                {type.map((c) => (
                  <option key={c.id} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
                className="w-full border p-2 rounded-lg"
              />
              {(featuredImage ||
                (editingId &&
                  agenda.find((a) => a.id === editingId)?.featuredImage)) && (
                <img
                  src={
                    featuredImage
                      ? URL.createObjectURL(featuredImage)
                      : agenda.find((a) => a.id === editingId)?.featuredImage
                  }
                  alt="preview"
                  className="mt-3 w-48 rounded-lg shadow"
                />
              )}
            </div>

            <div className="flex gap-3 items-center">
              <span className="font-medium text-gray-600">
                Published?
              </span>
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`px-4 py-2 rounded-lg ${
                  isPublished
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                ✅ Yes
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`px-4 py-2 rounded-lg ${
                  !isPublished
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                ❌ No
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
              >
                {editingId ? "💾 Update Agenda" : "➕ Simpan Agenda"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST Agenda */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agenda.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${a.featured_image}`}
                alt={a.title}
                className="rounded-t-xl w-full h-44 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {a.content}
                </p>

                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <FiCalendar /> {formatDateTime(a.start_time)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar /> {formatDateTime(a.end_time)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin /> {a.location}
                  </div>
                </div>

                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                    a.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.is_published ? "Published" : "Unpublished"}
                </span>

                <div className="flex justify-between mt-4 border-t pt-3">
                  <button
                    onClick={() => handleEdit(a.id)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                  >
                    <FiTrash2 /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
