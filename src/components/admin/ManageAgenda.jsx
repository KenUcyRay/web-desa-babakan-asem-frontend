import { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination"; // ✅ Tambahkan komponen pagination

export default function ManageAgenda() {
  const [agendaList, setAgendaList] = useState([
    {
      id: 1,
      title: "Musyawarah Desa",
      description: "Diskusi pembangunan desa bersama warga.",
      start_time: "2025-07-20T09:00",
      end_time: "2025-07-20T11:00",
      location: "Balai Desa",
      featuredImage: "https://source.unsplash.com/400x250/?meeting",
      isPublished: true,
    },
    {
      id: 2,
      title: "Gotong Royong Bersama",
      description: "Kerja bakti membersihkan lingkungan desa.",
      start_time: "2025-07-25T07:30",
      end_time: "2025-07-25T10:00",
      location: "Lapangan Desa",
      featuredImage: "https://source.unsplash.com/400x250/?community",
      isPublished: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imagePreview = featuredImage
      ? URL.createObjectURL(featuredImage)
      : editingId
      ? agendaList.find((a) => a.id === editingId).featuredImage
      : "https://source.unsplash.com/400x250/?village";

    const newData = {
      id: editingId || Date.now(),
      title,
      description,
      start_time: startTime,
      end_time: endTime || startTime,
      location,
      featuredImage: imagePreview,
      isPublished,
    };

    if (editingId) {
      setAgendaList((prev) =>
        prev.map((a) => (a.id === editingId ? newData : a))
      );
    } else {
      setAgendaList([...agendaList, newData]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus agenda ini?")) {
      setAgendaList(agendaList.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (id) => {
    const agenda = agendaList.find((a) => a.id === id);
    if (!agenda) return;

    setTitle(agenda.title);
    setDescription(agenda.description);
    setStartTime(agenda.start_time);
    setEndTime(agenda.end_time);
    setLocation(agenda.location);
    setFeaturedImage(null);
    setIsPublished(agenda.isPublished);
    setEditingId(id);
    setShowForm(true);
  };

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  // ✅ Hitung agenda per halaman
  const totalItems = agendaList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // minimal 1
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = agendaList.slice(startIndex, endIndex);

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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <p className="text-xs text-gray-500 mt-1">
                *Jika kosong, akan sama seperti start time
              </p>
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
                  agendaList.find((a) => a.id === editingId)?.featuredImage)) && (
                <img
                  src={
                    featuredImage
                      ? URL.createObjectURL(featuredImage)
                      : agendaList.find((a) => a.id === editingId)
                          ?.featuredImage
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
          {currentItems.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow">
              {a.featuredImage && (
                <img
                  src={a.featuredImage}
                  alt={a.title}
                  className="rounded-t-xl w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm">{a.description}</p>

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
                    a.isPublished ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {a.isPublished ? "✅ Published" : "❌ Unpublished"}
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
