import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUserAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";

export default function ManageAnggota() {
  const { t, i18n } = useTranslation();
  const [members, setMembers] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const kategoriList = [
    { key: "Semua", label: "Semua" },
    { key: "PKK", label: "PKK" },
    { key: "KARANG TARUNA", label: "Karang Taruna" },
    { key: "PEMERINTAH", label: "Pemerintah" },
    { key: "BPD", label: "BPD" },
  ];

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to get translated organization name
  const getOrganizationLabel = (orgType) => {
    return orgType;
  };

  const fetchMembers = async () => {
    let kategoriValue = kategori === "Semua" ? "" : kategori;
    kategoriValue === "KARANG TARUNA" && (kategoriValue = "KARANG_TARUNA");
    const response = await MemberApi.getAllMembers(
      kategoriValue,
      currentPage,
      9,
      i18n.language
    );
    if (!response.ok) {
      Helper.errorResponseHandler(await response.json());
      return;
    }
    const body = await response.json();
    body.members = body.members.map((a) => {
      if (a.organization_type === "KARANG_TARUNA") {
        a.organization_type = "Karang Taruna";
        return a;
      }
      return a;
    });
    setMembers(body.members);
    setTotalPages(body.total_page);
    setCurrentPage(body.page);
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, kategori, i18n.language]);

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
      organization_type:
        member.organization_type === "Karang Taruna"
          ? "KARANG_TARUNA"
          : member.organization_type,
      profile_photo: null,
      is_term: member.is_term,
      important_level: member.important_level,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin ingin menghapus anggota ini?"))) return;
    const response = await MemberApi.deleteMember(id, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }
    setMembers((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess("Anggota berhasil dihapus.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format data sebelum dikirim ke API
    const formattedData = {
      ...formData,
      // Pastikan organization_type dalam format yang benar
      organization_type:
        formData.organization_type === "Karang Taruna"
          ? "KARANG_TARUNA"
          : formData.organization_type,
      // Konversi is_term ke boolean jika diperlukan
      is_term: Boolean(formData.is_term),
      // Konversi important_level ke number
      important_level: Number(formData.important_level),
      // Konversi tahun ke string
      term_start: String(formData.term_start),
      term_end: String(formData.term_end),
    };

    const apiCall = editingId
      ? MemberApi.updateMember(editingId, formattedData, i18n.language)
      : MemberApi.createMember(formattedData, i18n.language);

    const response = await apiCall;
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    await alertSuccess(
      editingId
        ? "Anggota berhasil diperbarui."
        : "Anggota berhasil ditambahkan."
    );
    setShowModal(false);
    fetchMembers();
  };

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-gray-800">
          <FiUsers className="text-3xl text-green-600" />
          <h1 className="text-2xl font-bold">Struktur Organisasi</h1>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
        >
          <FaPlus /> Tambah anggota
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2 mb-6">
        {kategoriList.map((k) => (
          <button
            key={k.key}
            onClick={() => {
              setKategori(k.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              kategori === k.key
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                : "bg-gray-100 hover:bg-green-50 text-gray-700"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* GRID ANGGOTA */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            Tidak ada anggota ditemukan.
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
                  : `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      member.profile_photo
                    }`
              }
              alt={member.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h2>
              <p className="text-sm text-gray-600">{member.position}</p>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                  {getOrganizationLabel(member.organization_type)}
                </span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                  {member.term_start} - {member.term_end}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    member.is_term
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {member.is_term ? "Menjabat" : "Tidak Menjabat"}
                </span>
              </div>
            </div>

            <div className="flex justify-between p-4 border-t text-sm">
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

      {/* MODAL TAMBAH/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FaUserAlt />
                {editingId ? "Edit Anggota" : "Tambah Anggota"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <FaTimes size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="Jabatan"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Mulai
                  </label>
                  <input
                    type="number"
                    placeholder="Tahun Mulai"
                    value={formData.term_start}
                    onChange={(e) =>
                      setFormData({ ...formData, term_start: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Berakhir
                  </label>
                  <input
                    type="number"
                    placeholder="Tahun Berakhir"
                    value={formData.term_end}
                    onChange={(e) =>
                      setFormData({ ...formData, term_end: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisasi
                  </label>
                  <select
                    value={formData.organization_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization_type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  >
                    <option value="PEMERINTAH">Pemerintah</option>
                    <option value="PKK">PKK</option>
                    <option value="KARANG_TARUNA">Karang Taruna</option>
                    <option value="BPD">BPD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Penting(1-10)
                  </label>
                  <input
                    type="number"
                    placeholder="Tingkat Penting"
                    value={formData.important_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        important_level: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Jabatan
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="relative inline-block w-14 h-7">
                    <input
                      type="checkbox"
                      checked={formData.is_term}
                      onChange={(e) =>
                        setFormData({ ...formData, is_term: e.target.checked })
                      }
                      className="opacity-0 w-0 h-0 peer"
                      id="statusToggle"
                    />
                    <label
                      htmlFor="statusToggle"
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300
                        before:content-[''] before:absolute before:w-5 before:h-5 before:left-1.5 before:bottom-1 before:bg-white before:rounded-full before:transition before:duration-300
                        peer-checked:bg-green-500 peer-checked:before:translate-x-7`}
                    ></label>
                  </div>
                  <span
                    className={`font-medium ${
                      formData.is_term ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {formData.is_term ? "Sedang Menjabat" : "Tidak Menjabat"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition shadow"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg transition transform hover:-translate-y-0.5"
                >
                  {editingId ? Simpan : Tambah}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
