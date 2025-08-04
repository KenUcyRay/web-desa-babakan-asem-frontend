import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaEdit,
  FaCalendarAlt,
  FaUsers,
  FaList,
  FaImage,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import { ProgramApi } from "../../../libs/api/ProgramApi";
import { MemberApi } from "../../../libs/api/MemberApi";
import { AgendaApi } from "../../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function ManagePkk() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("program");

  // State untuk Program PKK
  const [programs, setPrograms] = useState([]);
  const [programPage, setProgramPage] = useState(1);
  const [programTotalPages, setProgramTotalPages] = useState(1);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [programTitle, setProgramTitle] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [programImage, setProgramImage] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);

  // State untuk Struktur PKK
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

  // State untuk Agenda PKK
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
    // Reset Program Form
    setProgramTitle("");
    setProgramDesc("");
    setProgramImage(null);
    setEditingProgramId(null);
    setShowProgramForm(false);

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

  // ==================== FUNGSI PROGRAM PKK ====================
  const fetchPrograms = async () => {
    const response = await ProgramApi.getPrograms(
      programPage,
      6,
      i18n.language
    );
    const body = await response.json();

    if (!response.ok) {
      await alertError(t("managePkk.error.fetchPrograms"));
      return;
    }

    setProgramTotalPages(body.total_page);
    setProgramPage(body.page);
    setPrograms(body.programs);
  };

  const handleProgramSave = async (e) => {
    e.preventDefault();

    if (!programTitle || !programDesc || (!programImage && !editingProgramId)) {
      return alertError(t("managePkk.validation.completeAllData"));
    }

    const rawData = {
      title: programTitle,
      description: programDesc,
      featured_image: programImage,
    };

    try {
      if (editingProgramId) {
        if (!(await alertConfirm(t("managePkk.confirmation.saveChanges"))))
          return;

        const response = await ProgramApi.updateProgram(
          editingProgramId,
          rawData,
          i18n.language
        );
        const body = await response.json();

        if (!response.ok)
          throw new Error(body.error || t("managePkk.error.saveChanges"));

        setPrograms((prev) =>
          prev.map((p) => (p.id === editingProgramId ? body.program : p))
        );
        await alertSuccess(t("managePkk.success.programUpdated"));
      } else {
        const response = await ProgramApi.createProgram(rawData, i18n.language);
        const body = await response.json();

        if (!response.ok)
          throw new Error(body.error || t("managePkk.error.saveProgram"));

        setPrograms([body.program, ...programs]);
        await alertSuccess(t("managePkk.success.programAdded"));
      }

      resetForms();
      fetchPrograms();
    } catch (error) {
      alertError(error.message);
    }
  };

  const handleProgramEdit = (id) => {
    const program = programs.find((p) => p.id === id);
    if (!program) return;
    setEditingProgramId(program.id);
    setProgramTitle(program.title);
    setProgramDesc(program.description);
    setProgramImage(null);
    setShowProgramForm(true);
  };

  const handleProgramDelete = async (id) => {
    if (!(await alertConfirm(t("managePkk.confirmation.deleteProgram"))))
      return;

    const response = await ProgramApi.deleteProgram(id, i18n.language);
    if (!response.ok) {
      await alertError(t("managePkk.error.deleteProgram"));
      return;
    }

    setPrograms((prev) => prev.filter((p) => p.id !== id));
    await alertSuccess(t("managePkk.success.programDeleted"));
  };

  // ==================== FUNGSI STRUKTUR PKK ====================
  const fetchMembers = async () => {
    const response = await MemberApi.getAllMembers(
      "PKK",
      memberPage,
      6,
      i18n.language
    );
    if (!response.ok) {
      alertError("Gagal mengambil data anggota PKK.");
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
      organization_type: "PKK", // Hardcode untuk PKK
    };

    try {
      if (editingMemberId) {
        if (
          !(await alertConfirm("Yakin ingin menyimpan perubahan anggota PKK?"))
        )
          return;

        const response = await MemberApi.updateMember(
          editingMemberId,
          rawData,
          i18n.language
        );
        if (!response.ok)
          throw new Error("Gagal menyimpan perubahan anggota PKK.");

        await alertSuccess("Anggota PKK berhasil diperbarui!");
      } else {
        const response = await MemberApi.createMember(rawData, i18n.language);
        if (!response.ok) throw new Error("Gagal menambahkan anggota PKK.");

        await alertSuccess("Anggota PKK berhasil ditambahkan!");
      }

      resetForms();
      fetchMembers();
    } catch (error) {
      alertError(error.message);
    }
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
    if (!(await alertConfirm("Yakin ingin menghapus anggota PKK ini?"))) return;

    const response = await MemberApi.deleteMember(id, i18n.language);
    if (!response.ok) {
      alertError("Gagal menghapus anggota PKK.");
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== id));
    await alertSuccess("Anggota PKK berhasil dihapus.");
  };

  // ==================== FUNGSI AGENDA PKK ====================
  const fetchAgendas = async () => {
    const response = await AgendaApi.getOwnAgenda(
      agendaPage,
      6,
      "PKK",
      i18n.language
    );
    if (!response.ok) return alertError("Gagal mengambil agenda PKK.");

    const body = await response.json();
    setAgendas(body.agenda || []);
    setAgendaPage(body.page || 1);
    setAgendaTotalPages(body.total_page || 1);
  };

  const handleAgendaSave = async (e) => {
    e.preventDefault();
    const rawData = {
      ...agendaForm,
      type: "PKK", // Hardcode untuk PKK
    };

    try {
      if (editingAgendaId) {
        if (
          !(await alertConfirm("Yakin ingin menyimpan perubahan agenda PKK?"))
        )
          return;

        const response = await AgendaApi.updateAgenda(
          editingAgendaId,
          rawData,
          i18n.language
        );
        if (!response.ok)
          throw new Error("Gagal menyimpan perubahan agenda PKK.");

        await alertSuccess("Agenda PKK berhasil diperbarui!");
      } else {
        const response = await AgendaApi.createAgenda(rawData, i18n.language);
        if (!response.ok) throw new Error("Gagal menambahkan agenda PKK.");

        await alertSuccess("Agenda PKK berhasil ditambahkan!");
      }

      resetForms();
      fetchAgendas();
    } catch (error) {
      alertError(error.message);
    }
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
    if (!(await alertConfirm("Yakin ingin menghapus agenda PKK ini?"))) return;

    const response = await AgendaApi.deleteAgenda(id, i18n.language);
    if (!response.ok) return alertError("Gagal menghapus agenda PKK.");

    setAgendas((prev) => prev.filter((a) => a.id !== id));
    await alertSuccess("Agenda PKK berhasil dihapus.");
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

  // Fetch data saat tab berubah atau halaman berubah
  useEffect(() => {
    if (activeTab === "program") fetchPrograms();
    if (activeTab === "structure") fetchMembers();
    if (activeTab === "agenda") fetchAgendas();
  }, [activeTab, programPage, memberPage, agendaPage, i18n.language]);

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          {t("managePkk.title")}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("program")}
          className={`px-4 py-2 font-medium ${
            activeTab === "program"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          <FaList className="inline mr-2" /> Program PKK
        </button>
        <button
          onClick={() => setActiveTab("structure")}
          className={`px-4 py-2 font-medium ${
            activeTab === "structure"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          <FaUsers className="inline mr-2" /> Struktur PKK
        </button>
        <button
          onClick={() => setActiveTab("agenda")}
          className={`px-4 py-2 font-medium ${
            activeTab === "agenda"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
        >
          <FaCalendarAlt className="inline mr-2" /> Agenda PKK
        </button>
      </div>

      {/* Program PKK Section */}
      {activeTab === "program" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Program PKK Desa
            </h2>
            {!showProgramForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowProgramForm(true);
                }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                <FaPlus /> {t("managePkk.buttons.addProgram")}
              </button>
            )}
          </div>

          {/* Form Program */}
          {showProgramForm && (
            <form
              onSubmit={handleProgramSave}
              className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
            >
              <h3 className="text-lg font-semibold">
                {editingProgramId
                  ? "Edit Program PKK"
                  : "Tambah Program PKK Baru"}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Nama Program
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  placeholder="Contoh: Pelatihan Keterampilan"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Gambar Program
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setProgramImage(e.target.files[0])}
                />
                {(programImage ||
                  (editingProgramId &&
                    programs.find((p) => p.id === editingProgramId)
                      ?.featured_image)) && (
                  <img
                    src={
                      programImage
                        ? URL.createObjectURL(programImage)
                        : `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                            programs.find((p) => p.id === editingProgramId)
                              ?.featured_image
                          }`
                    }
                    alt="preview"
                    className="mt-3 w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Deskripsi Program
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  placeholder="Deskripsi lengkap program..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  <FaSave /> {editingProgramId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          )}

          {/* List Program */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.length === 0 ? (
              <p className="text-gray-500 italic">
                Belum ada program PKK yang tersedia
              </p>
            ) : (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-md border hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      program.featured_image
                    }`}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {program.description}
                    </p>
                    <div className="flex justify-between mt-4 text-sm">
                      <button
                        onClick={() => handleProgramEdit(program.id)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleProgramDelete(program.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={programPage}
              totalPages={programTotalPages}
              onPageChange={setProgramPage}
            />
          </div>
        </>
      )}

      {/* Struktur PKK Section */}
      {activeTab === "structure" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Struktur Organisasi PKK
            </h2>
            {!showMemberForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowMemberForm(true);
                }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
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
              <h3 className="text-lg font-semibold">
                {editingMemberId
                  ? "Edit Anggota PKK"
                  : "Tambah Anggota PKK Baru"}
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
                  required
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
                  required
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
                    required
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
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      profile_photo: e.target.files[0],
                    })
                  }
                  required={!editingMemberId}
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
                  className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  <FaSave /> {editingMemberId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          )}

          {/* List Anggota */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length === 0 ? (
              <p className="text-gray-500 italic">
                Belum ada anggota struktur PKK
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
                      onClick={() => handleMemberEdit(member.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit /> Edit
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

      {/* Agenda PKK Section */}
      {activeTab === "agenda" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Agenda Kegiatan PKK
            </h2>
            {!showAgendaForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowAgendaForm(true);
                }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                <FaPlus /> Tambah Agenda
              </button>
            )}
          </div>

          {/* Form Agenda */}
          {showAgendaForm && (
            <form
              onSubmit={handleAgendaSave}
              className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
            >
              <h3 className="text-lg font-semibold">
                {editingAgendaId ? "Edit Agenda PKK" : "Tambah Agenda PKK Baru"}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Judul Agenda
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={agendaForm.title}
                  onChange={(e) =>
                    setAgendaForm({ ...agendaForm, title: e.target.value })
                  }
                  placeholder="Contoh: Rapat Rutin PKK"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Deskripsi Agenda
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={agendaForm.content}
                  onChange={(e) =>
                    setAgendaForm({ ...agendaForm, content: e.target.value })
                  }
                  placeholder="Deskripsi lengkap agenda..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded-lg p-3"
                    value={agendaForm.start_time}
                    onChange={(e) =>
                      setAgendaForm({
                        ...agendaForm,
                        start_time: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded-lg p-3"
                    value={agendaForm.end_time}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={agendaForm.location}
                  onChange={(e) =>
                    setAgendaForm({ ...agendaForm, location: e.target.value })
                  }
                  placeholder="Tempat/lokasi kegiatan"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Gambar Agenda
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) =>
                    setAgendaForm({
                      ...agendaForm,
                      featured_image: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agendaForm.is_published}
                  onChange={(e) =>
                    setAgendaForm({
                      ...agendaForm,
                      is_published: e.target.checked,
                    })
                  }
                />
                <span>Publikasikan agenda?</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  <FaSave /> {editingAgendaId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          )}

          {/* List Agenda */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.length === 0 ? (
              <p className="text-gray-500 italic">
                Belum ada agenda PKK yang tersedia
              </p>
            ) : (
              agendas.map((agenda) => (
                <div
                  key={agenda.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      agenda.featured_image
                    }`}
                    alt={agenda.title}
                    className="rounded-t-xl w-full h-44 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {agenda.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {agenda.content}
                    </p>

                    <div className="mt-3 text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt /> {formatDateTime(agenda.start_time)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt /> {agenda.location}
                      </div>
                    </div>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                        agenda.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {agenda.is_published ? "Published" : "Unpublished"}
                    </span>

                    <div className="flex justify-between mt-4 border-t pt-3">
                      <button
                        onClick={() => handleAgendaEdit(agenda.id)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleAgendaDelete(agenda.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrash /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={agendaPage}
              totalPages={agendaTotalPages}
              onPageChange={setAgendaPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
