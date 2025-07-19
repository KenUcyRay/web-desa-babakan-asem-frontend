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
import Pagination from "../ui/Pagination"; // ✅ Tambahkan komponen pagination

export default function ManageAgenda() {
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

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
    if (!(await alertConfirm("Yakin ingin menghapus agenda ini?"))) {
      return;
    }
    const response = await AgendaApi.deleteAgenda(id);
    if (!response.ok) {
      alertError("Gagal menghapus agenda. Silakan coba lagi.");
      return;
    }
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
    setIsPublished(item.isPublished);
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
      type: "REGULAR",
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit agenda ini?"))) {
        return;
      }

      const response = await AgendaApi.updateAgenda(editingId, rawData);
      const responseBody = await response.json();

      if (!response.ok) {
        let errorMessage = "Gagal menyimpan perubahan.";

        if (responseBody.error && Array.isArray(responseBody.error)) {
          const errorMessages = responseBody.error.map((err) => {
            if (err.path && err.path.length > 0) {
              return `${err.path[0]}: ${err.message}`;
            }
            return err.message;
          });
          errorMessage = errorMessages.join(", ");
        } else if (
          responseBody.error &&
          typeof responseBody.error === "string"
        ) {
          errorMessage = responseBody.error;
        }
        await alertError(errorMessage);
        return;
      }

      await alertSuccess("Agenda berhasil diperbarui!");
      resetForm();

      return;
    }

    const response = await AgendaApi.createAgenda(rawData);
    const responseBody = await response.json();

    if (response.ok) {
      await alertSuccess("Berita berhasil ditambahkan!");
      setAgenda([...agenda, responseBody.agenda]);
    } else {
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
    }

    resetForm();
  };

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const fetchAgenda = async () => {
    const response = await AgendaApi.getOwnAgenda(currentPage,6);

    if (!response.ok) {
      alertError("Gagal mengambil agenda. Silakan coba lagi.");
      setLoading(false);
      return;
    }
    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setAgenda(responseBody.agenda);
  };

  useEffect(() => {
    fetchAgenda();
  }, [showForm, currentPage]);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        {/* ✅ Header & Tombol */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Agenda</h1>

          {!showForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              <FiPlus /> Tambah Agenda
            </button>
          )}
        </div>

        {/* ✅ FORM TAMBAH / EDIT */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-medium">Judul Agenda</label>
              <input
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul agenda"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Deskripsi</label>
              <textarea
                className="w-full border p-2 rounded h-24 focus:ring focus:ring-blue-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan deskripsi agenda..."
                required
              ></textarea>
            </div>

            {/* ✅ Start & End Time */}
            <div>
              <label className="block font-medium">Start Time</label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">End Time</label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium">Lokasi</label>
              <input
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lokasi acara"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Upload Gambar Agenda</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
                className="w-full border p-2 rounded"
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
                  className="mt-2 w-40 rounded"
                />
              )}
            </div>

            {/* ✅ Published Yes/No */}
            <div>
              <label className="block font-medium mb-2">Published?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`px-4 py-2 rounded ${
                    isPublished
                      ? "bg-green-500 text-white shadow"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`px-4 py-2 rounded ${
                    !isPublished
                      ? "bg-red-500 text-white shadow"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                {editingId ? "✅ Update Agenda" : "💾 Simpan Agenda"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST AGENDA (per halaman) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agenda.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                  a.featured_image
                }`}
                alt={a.title}
                className="rounded-t-xl w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm">{a.content}</p>

                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <FiCalendar /> Mulai: {formatDateTime(a.start_time)}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <FiCalendar /> Selesai: {formatDateTime(a.end_time)}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <FiMapPin /> {a.location}
                </div>

                <p
                  className={`mt-2 font-medium ${
                    a.is_published ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {a.is_published ? "✅ Published" : "❌ Unpublished"}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(a.id)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination selalu muncul meski sedikit agenda */}
        <div className="mt-6 flex justify-center">
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
