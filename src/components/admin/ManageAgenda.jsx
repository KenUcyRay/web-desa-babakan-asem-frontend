import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function ManageAgenda() {
  const [agendaList, setAgendaList] = useState([
    {
      id: 1,
      title: "Musyawarah Desa",
      description: "Diskusi terkait pembangunan desa bersama warga.",
      date: "2025-07-15",
      location: "Balai Desa",
      isPublished: true,
    },
    {
      id: 2,
      title: "Gotong Royong Bersama",
      description: "Kerja bakti membersihkan lingkungan desa.",
      date: "2025-07-25",
      location: "Lapangan Desa",
      isPublished: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  // filter state
  const [filter, setFilter] = useState("all");

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAgenda = {
      id: Date.now(),
      title,
      description,
      date: date || today, // ✅ auto hari ini kalau kosong
      location,
      isPublished,
    };

    setAgendaList([...agendaList, newAgenda]);

    // reset form
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setIsPublished(false);

    // sembunyikan form setelah simpan
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus agenda ini?")) {
      setAgendaList(agendaList.filter((a) => a.id !== id));
    }
  };

  // ✅ filter agenda berdasarkan status
  const filteredAgenda = agendaList.filter((a) => {
    if (filter === "past") return a.date < today;
    if (filter === "upcoming") return a.date >= today;
    return true; // all
  });

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        {/* ✅ Header & Tombol */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Agenda</h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ➕ Tambah Agenda
            </button>
          )}
        </div>

        {/* ✅ FILTER BUTTON */}
        {!showForm && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 rounded ${
                filter === "past" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Sudah Berlangsung
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded ${
                filter === "upcoming" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Akan Datang
            </button>
          </div>
        )}

        {/* ✅ FORM MUNCUL SETELAH KLIK */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-medium">Judul Agenda</label>
              <input
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul agenda"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Deskripsi</label>
              <textarea
                className="w-full border p-2 rounded h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan deskripsi agenda..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Tanggal</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                *Jika kosong, otomatis tanggal hari ini
              </p>
            </div>

            <div>
              <label className="block font-medium">Lokasi</label>
              <input
                className="w-full border p-2 rounded"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lokasi acara"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Published?</label>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-4 py-2 rounded ${
                  isPublished ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {isPublished ? "YES" : "NO"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Simpan Agenda
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST AGENDA */}
        <div className="space-y-4">
          {filteredAgenda.length === 0 ? (
            <p className="text-gray-500 italic">Tidak ada agenda</p>
          ) : (
            filteredAgenda.map((a) => (
              <div
                key={a.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{a.title}</h2>
                  <p className="text-gray-600 text-sm">{a.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {a.date} | 📍 {a.location}
                  </p>
                  <p
                    className={`text-sm ${
                      a.isPublished ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {a.isPublished ? "Published" : "Unpublished"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
