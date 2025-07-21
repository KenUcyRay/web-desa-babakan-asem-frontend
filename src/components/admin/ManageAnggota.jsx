import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManageAnggota() {
  // Dummy data awal supaya ada tampilan sebelum fetch dari API
  const [members, setMembers] = useState([
    {
      id: 1,
      profile_photo: "https://via.placeholder.com/150",
      name: "Ahmad Zaki",
      position: "Kepala Desa",
      term_start: "2023",
      term_end: "2028",
      organization_type: "PEMERINTAH",
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
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    term_start: "",
    term_end: "",
    organization_type: "PEMERINTAH",
    profile_photo: null,
    is_term: true,
    important_level: 1,
  });

  // Tambah anggota
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      position: "",
      term_start: "",
      term_end: "",
      organization_type: "PEMERINTAH",
      profile_photo: null,
      is_term: true,
      important_level: 1,
    });
    setShowModal(true);
  };

  // Edit anggota (isi form)
  const handleEdit = (id) => {
    const member = members.find((a) => a.id === id);
    if (!member) return;
    setEditingId(id);
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

  // Hapus anggota
  const handleDelete = async (id) => {
    const confirmDelete = await alertConfirm(
      "Yakin ingin menghapus anggota ini?"
    );
    if (!confirmDelete) return;

    const response = await MemberApi.deleteMember(id);
    if (!response.ok) {
      alertError("Gagal menghapus anggota.");
      return;
    }
    setMembers((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess("Anggota berhasil dihapus.");
  };

  // Submit form tambah / edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const response = await MemberApi.updateMember(editingId, formData);
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
        alertError(errorMessage);
        return;
      }

      setMembers((prev) =>
        prev
          .map((m) =>
            m.id === editingId ? { ...m, ...responseBody.member } : m
          )
          .sort((a, b) => b.important_level - a.important_level)
      );
      alertSuccess("Anggota diupdate");
      setShowModal(false);
      return;
    }

    // Tambah anggota baru
    const response = await MemberApi.createMember(formData);
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
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      alertError(errorMessage);
      return;
    }

    setMembers((prev) =>
      [...prev, responseBody.member].sort(
        (a, b) => b.important_level - a.important_level
      )
    );
    setShowModal(false);
  };

  // Filter kategori
  const [kategori, setKategori] = useState("Semua");
  const kategoriList = ["Semua", "PKK", "Karang Taruna", "DPD", "PEMERINTAH"];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch anggota dari API
  const fetchMembers = async () => {
    let kategoriValue = kategori;
    if (kategoriValue === "Karang Taruna") kategoriValue = "KARANG_TARUNA";
    if (kategoriValue === "PEMERINTAH") kategoriValue = "PEMERINTAH";
    if (kategoriValue === "Semua") kategoriValue = ""; // jika backend support filter kosong = semua

    const response = await MemberApi.getMembers(kategoriValue, currentPage, 9);
    const responseBody = await response.json();

    if (!response.ok) {
      alertError("Gagal mengambil data anggota. Silakan coba lagi.");
      return;
    }

    setMembers(responseBody.members);
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, kategori]);

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
          {members.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              Tidak ada anggota untuk kategori ini.
            </p>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={
                  member.profile_photo.startsWith("http")
                    ? member.profile_photo
                    : `${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`
                }
                alt={member.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-1">
                <h2 className="text-lg font-bold">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.position}</p>
                <p className="text-xs text-gray-500">
                  Masa Jabatan:{" "}
                  <b>
                    {member.term_start} - {member.term_end}
                  </b>
                </p>
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {member.organization_type}
                </span>
                <p className="text-xs mt-1">
                  {member.is_term ? "✅ Masih menjabat" : "❌ Tidak menjabat"}
                </p>
              </div>

              <div className="flex justify-between p-4 border-t text-sm">
                <button
                  onClick={() => handleEdit(member.id)}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {members.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Anggota" : "Tambah Anggota"}
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
                  setFormData({
                    ...formData,
                    organization_type: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              >
                <option value="PEMERINTAH">Pemerintah</option>
                <option value="PKK">PKK</option>
                <option value="KARANG_TARUNA">Karang Taruna</option>
                <option value="DPD">DPD</option>
              </select>

              <div>
                <label className="block text-sm font-medium">Foto Profil</label>
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
                  {...(editingId ? {} : { required: true })}
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
                min={1}
                max={10}
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
                  {editingId ? "Update" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
