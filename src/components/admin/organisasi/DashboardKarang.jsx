import { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import { FiUsers, FiCalendar, FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import { MemberApi } from "../../../libs/api/MemberApi";
import { AgendaApi } from "../../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function DashboardKarangTaruna() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("struktur");

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header Dashboard */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          {t("dashboardKarangTaruna.title") || "Dashboard Karang Taruna"}
        </h1>
        <p className="text-gray-600">
          {t("dashboardKarangTaruna.subtitle") ||
            "Kelola struktur organisasi dan agenda Karang Taruna"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-lg ${
            activeTab === "struktur"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("struktur")}
        >
          <FaUsers />{" "}
          {t("dashboardKarangTaruna.tabs.structure") || "Struktur Organisasi"}
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-lg ${
            activeTab === "agenda"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("agenda")}
        >
          <FaCalendarAlt /> {t("dashboardKarangTaruna.tabs.agenda") || "Agenda"}{" "}
          Kegiatan
        </button>
      </div>

      {/* Konten Tab */}
      {activeTab === "struktur" ? <StrukturSection /> : <AgendaSection />}
    </div>
  );
}

// ======================== STRUKTUR SECTION ========================
function StrukturSection() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hanya untuk Karang Taruna
  const kategori = "KARANG_TARUNA";

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    term_start: "",
    term_end: "",
    organization_type: kategori,
    profile_photo: null,
    is_term: true,
    important_level: 5,
  });

  const fetchMembers = async () => {
    const response = await MemberApi.getAllMembers(kategori, currentPage, 9);
    if (!response.ok) {
      alertError(
        t("dashboardKarangTaruna.alerts.fetchMembersError") ||
          "Gagal mengambil data anggota."
      );
      return;
    }
    const body = await response.json();
    setMembers(body.members || []);
    setTotalPages(body.total_page || 1);
    setCurrentPage(body.page || 1);
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      position: "",
      term_start: "",
      term_end: "",
      organization_type: kategori,
      profile_photo: null,
      is_term: true,
      important_level: 5,
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
    if (
      !(await alertConfirm(
        t("dashboardKarangTaruna.alerts.deleteConfirm") ||
          "Yakin ingin menghapus anggota ini?"
      ))
    )
      return;
    const response = await MemberApi.deleteMember(id);
    if (!response.ok) {
      alertError(
        t("dashboardKarangTaruna.alerts.deleteError") ||
          "Gagal menghapus anggota."
      );
      return;
    }
    setMembers((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess(
      t("dashboardKarangTaruna.alerts.deleteSuccess") ||
        "Anggota berhasil dihapus."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiCall = editingId
      ? MemberApi.updateMember(editingId, formData)
      : MemberApi.createMember(formData);

    const response = await apiCall;
    if (!response.ok) {
      alertError(
        editingId
          ? t("dashboardKarangTaruna.alerts.saveError") ||
              "Gagal menyimpan perubahan."
          : t("dashboardKarangTaruna.alerts.addError") ||
              "Gagal menambah anggota."
      );
      return;
    }

    await alertSuccess(
      editingId
        ? t("dashboardKarangTaruna.alerts.updateSuccess") ||
            "Anggota diperbarui!"
        : t("dashboardKarangTaruna.alerts.addSuccess") || "Anggota ditambahkan!"
    );
    setShowModal(false);
    fetchMembers();
  };

  return (
    <div>
      {/* Header Struktur */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-800">
          <FiUsers className="text-2xl text-blue-600" />
          <h2 className="text-xl font-bold">
            {t("dashboardKarangTaruna.structure.title") ||
              "Struktur Karang Taruna"}
          </h2>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus />{" "}
          {t("dashboardKarangTaruna.structure.addMember") || "Tambah Anggota"}
        </button>
      </div>

      {/* Grid Anggota */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FiUsers className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("dashboardKarangTaruna.structure.emptyTitle") ||
                "Belum ada anggota"}
            </h3>
            <p className="text-gray-500 mb-4">
              {t("dashboardKarangTaruna.structure.emptyDesc") ||
                "Tambahkan anggota untuk membentuk struktur organisasi"}
            </p>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <FaPlus />{" "}
              {t("dashboardKarangTaruna.structure.addMember") ||
                "Tambah Anggota"}
            </button>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
            >
              {member.profile_photo ? (
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
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <FiUsers className="text-4xl text-gray-400" />
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h2>
                <p className="text-sm text-gray-600">{member.position}</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
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
          ))
        )}
      </div>

      {/* Pagination */}
      {members.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              {editingId ? <FaEdit /> : <FaPlus />}
              {editingId ? "Edit Anggota" : "Tambah Anggota"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Jabatan
                </label>
                <input
                  type="text"
                  placeholder="Jabatan"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mulai Jabatan
                  </label>
                  <input
                    type="number"
                    placeholder="Tahun mulai"
                    value={formData.term_start}
                    onChange={(e) =>
                      setFormData({ ...formData, term_start: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Akhir Jabatan
                  </label>
                  <input
                    type="number"
                    placeholder="Tahun akhir"
                    value={formData.term_end}
                    onChange={(e) =>
                      setFormData({ ...formData, term_end: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
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
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600"
                    checked={formData.is_term}
                    onChange={(e) =>
                      setFormData({ ...formData, is_term: e.target.checked })
                    }
                  />
                  <span className="text-sm">Masih menjabat?</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
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

// ======================== AGENDA SECTION ========================
function AgendaSection() {
  const { t } = useTranslation();
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Hanya untuk Karang Taruna
  const kategori = "KARANG_TARUNA";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setFeaturedImage(null);
    setIsPublished(true);
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
    setStartTime(item.start_time.split(".")[0]); // Format datetime-local
    setEndTime(item.end_time.split(".")[0]); // Format datetime-local
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
      type: kategori,
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit agenda ini?"))) return;

      const response = await AgendaApi.updateAgenda(editingId, rawData);
      if (!response.ok) return alertError("Gagal update agenda.");
      await alertSuccess("Agenda berhasil diperbarui!");
      resetForm();
      fetchAgenda();
      return;
    }

    const response = await AgendaApi.createAgenda(rawData);
    const resBody = await response.json();
    if (!response.ok)
      return alertError(resBody.error || "Gagal menambah agenda.");
    await alertSuccess("Agenda berhasil ditambahkan!");
    setAgenda((prev) => [...prev, resBody.agenda]);
    resetForm();
  };

  const formatDateTime = (dt) => {
    const date = new Date(dt);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAgenda = async () => {
    const response = await AgendaApi.getOwnAgenda(currentPage, 6, kategori);
    if (!response.ok) return alertError("Gagal ambil agenda.");
    const resBody = await response.json();

    setAgenda(resBody.agenda || []);
    setCurrentPage(resBody.page || 1);
    setTotalPages(resBody.total_page || 1);
  };

  useEffect(() => {
    fetchAgenda();
  }, [currentPage]);

  return (
    <div>
      {/* Header Agenda */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Agenda Karang Taruna</h2>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            <FaPlus className="text-lg" /> Tambah Agenda
          </button>
        )}
      </div>

      {/* Form Agenda */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200 space-y-4"
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
              placeholder="Contoh: Rapat Rutin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              className="w-full border rounded-lg p-3 h-24 focus:ring focus:ring-blue-200"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan deskripsi agenda..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mulai</label>
              <input
                type="datetime-local"
                className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selesai</label>
              <input
                type="datetime-local"
                className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <input
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Balai Desa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Gambar Utama
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
                className="hidden"
                id="agenda-image"
              />
              <label htmlFor="agenda-image" className="cursor-pointer">
                {featuredImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(featuredImage)}
                      alt="preview"
                      className="w-48 h-32 object-cover rounded-lg mb-2"
                    />
                    <span className="text-blue-600 text-sm">Ganti gambar</span>
                  </div>
                ) : editingId &&
                  agenda.find((a) => a.id === editingId)?.featured_image ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={`${
                        import.meta.env.VITE_NEW_BASE_URL
                      }/public/images/${
                        agenda.find((a) => a.id === editingId).featured_image
                      }`}
                      alt="preview"
                      className="w-48 h-32 object-cover rounded-lg mb-2"
                    />
                    <span className="text-blue-600 text-sm">Ganti gambar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaImage className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500">Klik untuk upload gambar</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Format: JPG, PNG (max 2MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Publikasikan?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`px-4 py-2 rounded-lg ${
                  isPublished
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Ya
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
                Tidak
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-2"
            >
              <FaSave /> {editingId ? "Update Agenda" : "Simpan Agenda"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition flex items-center gap-2"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* List Agenda */}
      {agenda.length === 0 && !showForm ? (
        <div className="bg-gray-50 rounded-xl border border-dashed p-8 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FiCalendar className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Belum ada agenda
          </h3>
          <p className="text-gray-500 mb-4">
            Tambahkan agenda untuk kegiatan Karang Taruna
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <FaPlus /> Tambah Agenda
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agenda.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100"
              >
                {a.featured_image ? (
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      a.featured_image
                    }`}
                    alt={a.title}
                    className="rounded-t-xl w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                    <FiCalendar className="text-4xl text-gray-400" />
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {a.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {a.content}
                  </p>

                  <div className="mt-4 text-sm text-gray-500 space-y-2">
                    <div className="flex items-start gap-2">
                      <FiCalendar className="mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Mulai:</div>
                        <div>{formatDateTime(a.start_time)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiCalendar className="mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Selesai:</div>
                        <div>{formatDateTime(a.end_time)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin className="mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Lokasi:</div>
                        <div>{a.location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {a.is_published ? "Published" : "Draft"}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(a.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {agenda.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
