import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";

const BASE_URL = "http://192.168.1.8:3001/api"; // URL API kamu

export default function ManageAnggota() {
  // ✅ Dummy awal supaya ada data untuk tes edit
  const [anggota, setAnggota] = useState([
    {
      id: 1,
      profile_photo: "https://via.placeholder.com/150",
      name: "Ahmad Zaki",
      position: "Kepala Desa",
      term_start: "2023",
      term_end: "2028",
      organization_type: "Pemerintah",
      is_term: true,
      important_level: 5,
    },
    {
      id: 2,
      profile_photo: "https://via.placeholder.com/150",
      name: "Siti Aminah",
      position: "Ketua PKK",
      term_start: "2024",
      term_end: "2029",
      organization_type: "PKK",
      is_term: true,
      important_level: 4,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    term_start: "",
    term_end: "",
    organization_type: "Pemerintah",
    profile_photo: null,
    is_term: true,
    important_level: 1,
  });

  // ✅ Tambah anggota
  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      name: "",
      position: "",
      term_start: "",
      term_end: "",
      organization_type: "Pemerintah",
      profile_photo: null,
      is_term: true,
      important_level: 1,
    });
    setShowModal(true);
  };

  // ✅ Edit anggota (isi form)
  const handleEdit = (member) => {
    setEditMode(true);
    setSelectedMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      term_start: member.term_start,
      term_end: member.term_end,
      organization_type: member.organization_type,
      profile_photo: null,
      is_term: member.is_term,
      important_level: member.important_level,
    });
    setShowModal(true);
  };

  // ✅ Hapus anggota
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus anggota ini?");
    if (!confirmDelete) return;
    setAnggota(anggota.filter((a) => a.id !== id));
    window.alert("✅ Anggota dihapus dari dummy");
  };

  // ✅ Submit form tambah / edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode && selectedMember) {
      // Update dummy (sementara)
      setAnggota((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id ? { ...m, ...formData } : m
        )
      );
      window.alert("✅ Dummy anggota diupdate");
    } else {
      // Tambah dummy baru (sementara)
      const newMember = {
        id: Date.now(),
        profile_photo:
          formData.profile_photo
            ? URL.createObjectURL(formData.profile_photo)
            : "https://via.placeholder.com/150",
        ...formData,
      };
      setAnggota((prev) => [...prev, newMember]);
      window.alert("✅ Dummy anggota ditambahkan");
    }

    setShowModal(false);
  };

  // ✅ Pagination & filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [kategori, setKategori] = useState("Semua");
  const kategoriList = ["Semua", "PKK", "Karang Taruna", "DPD", "Pemerintah"];

  const filteredAnggota =
    kategori === "Semua"
      ? anggota
      : anggota.filter((a) => a.organization_type === kategori);

  const totalPages = Math.ceil(filteredAnggota.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAnggota.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="md:ml-64 flex-1 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Struktur Organisasi</h1>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Tambah Anggota
          </button>
        </div>

        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2 mb-4">
          {kategoriList.map((k) => (
            <button
              key={k}
              className={`px-4 py-2 rounded transition ${
                kategori === k
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => {
                setKategori(k);
                setCurrentPage(1);
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Grid anggota */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={a.profile_photo}
                alt={a.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-1">
                <h2 className="text-lg font-bold">{a.name}</h2>
                <p className="text-sm text-gray-600">{a.position}</p>
                <p className="text-xs text-gray-500">
                  Masa Jabatan: <b>{a.term_start} - {a.term_end}</b>
                </p>
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {a.organization_type}
                </span>
                <p className="text-xs mt-1">
                  {a.is_term ? "✅ Masih menjabat" : "❌ Tidak menjabat"}
                </p>
              </div>

              <div className="flex justify-between p-4 border-t text-sm">
                <button
                  onClick={() => handleEdit(a)}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Jika kosong */}
        {filteredAnggota.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            Tidak ada anggota untuk kategori ini.
          </p>
        )}

        {/* Pagination */}
        {filteredAnggota.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ✅ Modal Tambah/Edit Anggota */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Anggota" : "Tambah Anggota"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nama"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Jabatan / Position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Term Start (ex: 2025)"
                  value={formData.term_start}
                  onChange={(e) =>
                    setFormData({ ...formData, term_start: e.target.value })
                  }
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Term End (ex: 2028)"
                  value={formData.term_end}
                  onChange={(e) =>
                    setFormData({ ...formData, term_end: e.target.value })
                  }
                  className="w-1/2 border p-2 rounded"
                  required
                />
              </div>

              <select
                value={formData.organization_type}
                onChange={(e) =>
                  setFormData({ ...formData, organization_type: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="Pemerintah">Pemerintah</option>
                <option value="PKK">PKK</option>
                <option value="Karang Taruna">Karang Taruna</option>
                <option value="DPD">DPD</option>
              </select>

              <div>
                <label className="block text-sm font-medium">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_photo: e.target.files[0],
                    })
                  }
                  className="w-full border p-2 rounded"
                  {...(editMode ? {} : { required: true })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_term}
                  onChange={(e) =>
                    setFormData({ ...formData, is_term: e.target.checked })
                  }
                />
                <span>Masih menjabat?</span>
              </div>

              <input
                type="number"
                placeholder="Important Level (contoh Kepala Desa = 5)"
                value={formData.important_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    important_level: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {editMode ? "Update" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
