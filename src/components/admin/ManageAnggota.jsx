import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

// Import font Poppins di global (opsional bisa taruh di index.css)
// body { font-family: 'Poppins', sans-serif; }

export default function ManageAnggota() {
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

  const handleDelete = async (id) => {
    const confirmDelete = await alertConfirm("Yakin ingin menghapus anggota ini?");
    if (!confirmDelete) return;

    const response = await MemberApi.deleteMember(id);
    if (!response.ok) {
      alertError("Gagal menghapus anggota.");
      return;
    }
    setMembers((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess("Anggota berhasil dihapus.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const response = await MemberApi.updateMember(editingId, formData);
      if (!response.ok) {
        alertError("Gagal menyimpan perubahan.");
        return;
      }
      alertSuccess("Anggota berhasil diperbarui!");
      setShowModal(false);
      return;
    }

    const response = await MemberApi.createMember(formData);
    if (!response.ok) {
      alertError("Gagal menambah anggota.");
      return;
    }
    alertSuccess("Anggota berhasil ditambahkan!");
    setShowModal(false);
  };

  const [kategori, setKategori] = useState("Semua");
  const kategoriList = ["Semua", "PKK", "Karang Taruna", "DPD", "PEMERINTAH"];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = async () => {
    let kategoriValue = kategori === "Semua" ? "" : kategori;
    const response = await MemberApi.getMembers(kategoriValue, currentPage, 9);
    if (!response.ok) {
      alertError("Gagal mengambil data anggota.");
      return;
    }
    const responseBody = await response.json();
    setMembers(responseBody.members);
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, kategori]);

  return (
    <div className="flex flex-col md:flex-row font-[Poppins,sans-serif]">
      <AdminSidebar />

      <div className="md:ml-64 flex-1 p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-gray-800">
            <FiUsers className="text-3xl text-green-600" />
            <h1 className="text-3xl font-bold">Struktur Organisasi</h1>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus /> Tambah Anggota
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-6">
          {kategoriList.map((k) => (
            <button
              key={k}
              onClick={() => {
                setKategori(k);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                kategori === k
                  ? "bg-green-500 text-white shadow"
                  : "bg-gray-100 hover:bg-green-50 text-gray-700"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* GRID ANGGOTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Tidak ada anggota untuk kategori ini.
            </p>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={
                  member.profile_photo.startsWith("http")
                    ? member.profile_photo
                    : `${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`
                }
                alt={member.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.position}</p>

                <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                    {member.organization_type}
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {member.term_start} - {member.term_end}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      member.is_term ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
                  >
                    {member.is_term ? "Menjabat" : "Tidak Menjabat"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-4 border-t">
                <button
                  onClick={() => handleEdit(member.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              {editingId ? <FaEdit /> : <FaPlus />}
              {editingId ? "Edit Anggota" : "Tambah Anggota"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
                  required
                />

                <input
                  type="text"
                  placeholder="Jabatan"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring focus:ring-green-200"
                  required
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mulai Jabatan"
                    value={formData.term_start}
                    onChange={(e) =>
                      setFormData({ ...formData, term_start: e.target.value })
                    }
                    className="w-1/2 border rounded-lg p-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Akhir Jabatan"
                    value={formData.term_end}
                    onChange={(e) =>
                      setFormData({ ...formData, term_end: e.target.value })
                    }
                    className="w-1/2 border rounded-lg p-2"
                    required
                  />
                </div>

                <select
                  value={formData.organization_type}
                  onChange={(e) =>
                    setFormData({ ...formData, organization_type: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="PEMERINTAH">Pemerintah</option>
                  <option value="PKK">PKK</option>
                  <option value="KARANG_TARUNA">Karang Taruna</option>
                  <option value="DPD">DPD</option>
                </select>

                <div>
                  <label className="text-sm font-medium">Foto Profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, profile_photo: e.target.files[0] })
                    }
                    className="w-full border rounded-lg p-2"
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
                  placeholder="Tingkat Penting (1-10)"
                  value={formData.important_level}
                  onChange={(e) =>
                    setFormData({ ...formData, important_level: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  required
                  min={1}
                  max={10}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
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
