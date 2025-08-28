import { useEffect, useState, useRef } from "react";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaEdit,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import { MemberApi } from "../../../libs/api/MemberApi";
import { AgendaApi } from "../../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";
import { Helper } from "../../../utils/Helper";

export default function DashboardBpd() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("structure");

  // State untuk Struktur BPD
  const [members, setMembers] = useState([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberTotalPages, setMemberTotalPages] = useState(1);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    position: "",
    term_start: "",
    term_end: "",
    profile_photo: null,
    is_term: true,
    important_level: 1,
  });
  const [editingMemberId, setEditingMemberId] = useState(null);

  // State untuk Agenda BPD
  const [agendas, setAgendas] = useState([]);
  const [agendaPage, setAgendaPage] = useState(1);
  const [agendaTotalPages, setAgendaTotalPages] = useState(1);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    title: "",
    content: "",
    start_time: "",
    end_time: "",
    location: "",
    featured_image: null,
    is_published: false,
  });
  const [editingAgendaId, setEditingAgendaId] = useState(null);

  // Fungsi untuk reset semua form
  const resetForms = () => {
    // Reset Member Form
    setMemberForm({
      name: "",
      position: "",
      term_start: "",
      term_end: "",
      profile_photo: null,
      is_term: true,
      important_level: 1,
    });
    setEditingMemberId(null);
    setShowMemberForm(false);

    // Reset Agenda Form
    setAgendaForm({
      title: "",
      content: "",
      start_time: "",
      end_time: "",
      location: "",
      featured_image: null,
      is_published: false,
    });
    setEditingAgendaId(null);
    setShowAgendaForm(false);
  };

  // ==================== FUNGSI STRUKTUR BPD ====================
  const fetchMembers = async () => {
    const response = await MemberApi.getAllMembers(
      "BPD",
      memberPage,
      6,
      i18n.language
    );
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }
    const body = await response.json();
    setMembers(body.members);
    setMemberTotalPages(body.total_page);
    setMemberPage(body.page);
  };

  const handleMemberSave = async (e) => {
    e.preventDefault();
    const rawData = {
      ...memberForm,
      organization_type: "BPD", // Hardcode untuk BPD
    };

    if (editingMemberId) {
      const confirm = await alertConfirm(
        "Anda yakin ingin menyimpan perubahan?"
      );
      if (!confirm) return;

      const response = await MemberApi.updateMember(
        editingMemberId,
        rawData,
        i18n.language
      );
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Anggota BPD berhasil diperbarui.");
    } else {
      const response = await MemberApi.createMember(rawData, i18n.language);
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Anggota BPD berhasil ditambahkan.");
    }

    resetForms();
    fetchMembers();
  };

  const handleMemberEdit = (id) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;
    setEditingMemberId(id);
    setMemberForm({
      name: member.name,
      position: member.position,
      term_start: member.term_start,
      term_end: member.term_end,
      profile_photo: null,
      is_term: member.is_term,
      important_level: member.important_level,
    });
    setShowMemberForm(true);
  };

  const handleMemberDelete = async (id) => {
    const confirm = await alertConfirm(
      "Anda yakin ingin menghapus anggota BPD ini?"
    );
    if (!confirm) return;

    const response = await MemberApi.deleteMember(id, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== id));
    await alertSuccess("Anggota BPD berhasil dihapus.");
  };

  // ==================== FUNGSI AGENDA BPD ====================
  const fetchAgendas = async () => {
    const response = await AgendaApi.getOwnAgenda(
      agendaPage,
      6,
      "BPD",
      i18n.language
    );
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    const body = await response.json();
    setAgendas(body.agenda || []);
    setAgendaPage(body.page || 1);
    setAgendaTotalPages(body.total_page || 1);
  };

  const handleAgendaSave = async (e) => {
    e.preventDefault();
    const rawData = {
      title: agendaForm.title,
      content: agendaForm.content,
      start_time: agendaForm.start_time
        ? new Date(agendaForm.start_time).toISOString()
        : agendas.find((a) => a.id === editingAgendaId)?.start_time,
      end_time: agendaForm.end_time
        ? new Date(agendaForm.end_time).toISOString()
        : agendas.find((a) => a.id === editingAgendaId)?.end_time,
      location: agendaForm.location,
      featured_image: agendaForm.featured_image,
      is_published: agendaForm.is_published,
      type: "BPD", // Hardcode untuk BPD
    };

    if (editingAgendaId) {
      const confirm = await alertConfirm(
        "Anda yakin ingin memperbarui agenda ini?"
      );
      if (!confirm) return;

      const response = await AgendaApi.updateAgenda(
        editingAgendaId,
        rawData,
        i18n.language
      );
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Agenda BPD berhasil diperbarui.");
    } else {
      const response = await AgendaApi.createAgenda(rawData, i18n.language);
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Agenda BPD berhasil ditambahkan.");
    }

    resetForms();
    fetchAgendas();
  };

  const handleAgendaEdit = (id) => {
    const agenda = agendas.find((a) => a.id === id);
    if (!agenda) return;
    setEditingAgendaId(id);
    setAgendaForm({
      title: agenda.title,
      content: agenda.content,
      start_time: agenda.start_time,
      end_time: agenda.end_time,
      location: agenda.location,
      featured_image: null,
      is_published: agenda.is_published,
    });
    setShowAgendaForm(true);
  };

  const handleAgendaDelete = async (id) => {
    const confirm = await alertConfirm(
      "Anda yakin ingin menghapus agenda ini?"
    );
    if (!confirm) return;

    const response = await AgendaApi.deleteAgenda(id, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
    }

    setAgendas((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess("Agenda BPD berhasil dihapus.");
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

  // Fetch data saat tab berubah atau halaman berubah
  useEffect(() => {
    if (activeTab === "structure") fetchMembers();
    if (activeTab === "agenda") fetchAgendas();
  }, [activeTab, memberPage, agendaPage, i18n.language]);

  const fileInputMemberRef = useRef(null);
  const fileInputAgendaRef = useRef(null);
  const handleClickMemberImage = () => {
    if (fileInputMemberRef.current) {
      fileInputMemberRef.current.click();
    }
  };
  const handleClickAgendaImage = () => {
    if (fileInputAgendaRef.current) {
      fileInputAgendaRef.current.click();
    }
  };
  const handleMemberImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMemberForm((prev) => ({
      ...prev,
      profile_photo: file,
    }));
  };
  const handleAgendaImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAgendaForm((prev) => ({
      ...prev,
      featured_image: file,
    }));
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Dashboard BPD</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("structure")}
          className={`px-4 py-2 font-medium ${
            activeTab === "structure"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          <FaUsers className="inline mr-2" /> Struktur BPD
        </button>
        <button
          onClick={() => setActiveTab("agenda")}
          className={`px-4 py-2 font-medium ${
            activeTab === "agenda"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          <FaCalendarAlt className="inline mr-2" />
          Agenda BPD
        </button>
      </div>

      {/* Struktur BPD Section */}
      {activeTab === "structure" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-gray-800">
              <FaUsers className="text-2xl text-green-600" />
              <h2 className="text-xl font-semibold">Struktur Organisasi BPD</h2>
            </div>
            {!showMemberForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowMemberForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FaPlus /> Tambah Anggota
              </button>
            )}
          </div>

          {/* Form Anggota */}
          {showMemberForm && (
            <form
              onSubmit={handleMemberSave}
              className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {editingMemberId ? (
                  <>
                    <FaEdit className="text-emerald-500" />
                    Edit Anggota BPD
                  </>
                ) : (
                  <>
                    <FaPlus className="text-emerald-500" />
                    Tambah Anggota BPD Baru
                  </>
                )}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                  placeholder="Nama lengkap anggota"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Jabatan
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={memberForm.position}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, position: e.target.value })
                  }
                  placeholder="Jabatan dalam struktur"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Masa Jabatan Mulai
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3"
                    value={memberForm.term_start}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        term_start: e.target.value,
                      })
                    }
                    placeholder="Tahun mulai"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Masa Jabatan Berakhir
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3"
                    value={memberForm.term_end}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, term_end: e.target.value })
                    }
                    placeholder="Tahun berakhir"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat kepentingan
                </label>
                <input
                  type="number"
                  placeholder="Skala 1-10 (1 paling penting)"
                  value={memberForm.important_level}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      important_level: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  min={1}
                  max={10}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Foto Profil
                </label>
                <button
                  type="button"
                  onClick={handleClickMemberImage}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 
                   hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-lg 
                   shadow hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <FaImage />
                  Unggah Gambar
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputMemberRef}
                  className="w-full border rounded-lg p-2 hidden"
                  onChange={handleMemberImageChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={memberForm.is_term}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, is_term: e.target.checked })
                  }
                />
                <span>Masih menjabat?</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition"
                >
                  <FaSave /> {editingMemberId ? "Edit" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          )}

          {/* List Anggota */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full italic">
                Belum ada anggota struktur BPD
              </p>
            ) : (
              members.map((member) => (
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
                      onClick={() => handleMemberEdit(member.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMemberDelete(member.id)}
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
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={memberPage}
              totalPages={memberTotalPages}
              onPageChange={setMemberPage}
            />
          </div>
        </>
      )}

      {/* Agenda BPD Section */}
      {activeTab === "agenda" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-gray-800">
              <FaCalendarAlt className="text-2xl text-green-600" />
              <h2 className="text-xl font-semibold">Agenda Kegiatan BPD</h2>
            </div>
            {!showAgendaForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowAgendaForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FaPlus /> Tambah Agenda
              </button>
            )}
          </div>

          {/* Form Agenda */}
          {showAgendaForm && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {editingAgendaId ? (
                  <>
                    <FaEdit className="text-emerald-500" />
                    Edit Agenda BPD
                  </>
                ) : (
                  <>
                    <FaPlus className="text-emerald-500" />
                    Tambah Agenda BPD Baru
                  </>
                )}
              </h3>

              <form onSubmit={handleAgendaSave} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Judul Agenda
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.title}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, title: e.target.value })
                    }
                    placeholder="Contoh: Rapat Rutin BPD"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Deskripsi Agenda
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.content}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, content: e.target.value })
                    }
                    placeholder="Deskripsi lengkap agenda..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Waktu Mulai
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                      value={agendaForm.start_time}
                      onChange={(e) =>
                        setAgendaForm({
                          ...agendaForm,
                          start_time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Waktu Selesai
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                      value={agendaForm.end_time}
                      onChange={(e) =>
                        setAgendaForm({
                          ...agendaForm,
                          end_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Lokasi
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.location}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, location: e.target.value })
                    }
                    placeholder="Tempat/lokasi kegiatan"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Gambar Agenda
                  </label>
                  <button
                    type="button"
                    onClick={handleClickAgendaImage}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 
                   hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-lg 
                   shadow hover:shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <FaImage />
                    Unggah Gambar
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputAgendaRef}
                    className="w-full border rounded-lg p-2 hidden"
                    onChange={handleAgendaImageChange}
                  />
                  {(agendaForm.featured_image ||
                    (editingAgendaId &&
                      agendas.find((a) => a.id === editingAgendaId)
                        ?.featured_image)) && (
                    <div className="mt-3">
                      <img
                        src={
                          agendaForm.featured_image
                            ? URL.createObjectURL(agendaForm.featured_image)
                            : `${
                                import.meta.env.VITE_NEW_BASE_URL
                              }/public/images/${
                                agendas.find((a) => a.id === editingAgendaId)
                                  ?.featured_image
                              }`
                        }
                        alt="preview"
                        className="w-full h-40 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={agendaForm.is_published}
                    onChange={(e) =>
                      setAgendaForm({
                        ...agendaForm,
                        is_published: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="is_published" className="text-gray-700">
                    Publikasikan agenda?
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <FaSave /> {editingAgendaId ? "Edit" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForms}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
                  >
                    <FaTimes /> Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Agenda */}
          <div className="space-y-4">
            {agendas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 italic text-lg">
                  Belum ada agenda BPD yang tersedia
                </p>
              </div>
            ) : (
              agendas.map((agenda) => (
                <div
                  key={agenda.id}
                  className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    {agenda.featured_image && (
                      <div className="lg:w-1/3">
                        <img
                          src={`${
                            import.meta.env.VITE_NEW_BASE_URL
                          }/public/images/${agenda.featured_image}`}
                          alt={agenda.title}
                          className="w-full h-48 lg:h-40 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Content Section */}
                    <div
                      className={`${
                        agenda.featured_image ? "lg:w-2/3" : "w-full"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {agenda.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {agenda.content}
                          </p>

                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-green-500" />
                              <span>
                                {formatDateTime(agenda.start_time)} -{" "}
                                {formatDateTime(agenda.end_time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-red-500" />
                              <span>{agenda.location}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                agenda.is_published
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {agenda.is_published
                                ? "Published"
                                : "Unpublished"}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 lg:flex-col">
                          <button
                            onClick={() => handleAgendaEdit(agenda.id)}
                            className="flex items-center gap-1 px-3 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition text-sm"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleAgendaDelete(agenda.id)}
                            className="flex items-center gap-1 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition text-sm"
                          >
                            <FaTrash /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {agendaTotalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={agendaPage}
                totalPages={agendaTotalPages}
                onPageChange={setAgendaPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
