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
import { Helper } from "../../../utils/Helper";

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
      await Helper.errorResponseHandler(body);
      return;
    }

    setProgramTotalPages(body.total_page);
    setProgramPage(body.page);
    setPrograms(body.programs);
  };

  const handleProgramSave = async (e) => {
    e.preventDefault();

    const rawData = {
      title: programTitle,
      description: programDesc,
      featured_image: programImage,
    };

    if (editingProgramId) {
      if (!(await alertConfirm(t("managePkk.confirmation.saveChanges"))))
        return;

      const response = await ProgramApi.updateProgram(
        editingProgramId,
        rawData,
        i18n.language
      );
      const body = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }

      setPrograms((prev) =>
        prev.map((p) => (p.id === editingProgramId ? body.program : p))
      );
      await alertSuccess(t("managePkk.success.programUpdated"));
    } else {
      const response = await ProgramApi.createProgram(rawData, i18n.language);
      const body = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }

      setPrograms([body.program, ...programs]);
      await alertSuccess(t("managePkk.success.programAdded"));
    }

    resetForms();
    fetchPrograms();
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
      await Helper.errorResponseHandler(await response.json());
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
      organization_type: "PKK", // Hardcode untuk PKK
    };

    if (editingMemberId) {
      if (!(await alertConfirm("Yakin ingin menyimpan perubahan anggota PKK?")))
        return;

      const response = await MemberApi.updateMember(
        editingMemberId,
        rawData,
        i18n.language
      );
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Anggota PKK berhasil diperbarui!");
    } else {
      const response = await MemberApi.createMember(rawData, i18n.language);
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Anggota PKK berhasil ditambahkan!");
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
    if (!(await alertConfirm("Yakin ingin menghapus anggota PKK ini?"))) return;

    const response = await MemberApi.deleteMember(id, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
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
      type: "PKK", // Hardcode untuk PKK
    };

    if (editingAgendaId) {
      if (!(await alertConfirm("Yakin ingin menyimpan perubahan agenda PKK?")))
        return;

      const response = await AgendaApi.updateAgenda(
        editingAgendaId,
        rawData,
        i18n.language
      );
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }
      await alertSuccess("Agenda PKK berhasil diperbarui!");
    } else {
      const response = await AgendaApi.createAgenda(rawData, i18n.language);
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Agenda PKK berhasil ditambahkan!");
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
    if (!(await alertConfirm("Yakin ingin menghapus agenda PKK ini?"))) return;

    const response = await AgendaApi.deleteAgenda(id, i18n.language);
    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

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
            <div className="flex items-center gap-2 text-gray-800">
              <FaList className="text-2xl text-green-600" />
              <h2 className="text-xl font-semibold">
                {t("pkkAdminProgram.title")}
              </h2>
            </div>
            {!showProgramForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowProgramForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FaPlus /> {t("pkkAdminProgram.buttons.add")}
              </button>
            )}
          </div>

          {/* Form Program */}
          {showProgramForm && (
            <form
              onSubmit={handleProgramSave}
              className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {editingProgramId ? (
                  <>
                    <FaEdit className="text-emerald-500" />
                    {t("pkkAdminProgram.modal.editTitle")}
                  </>
                ) : (
                  <>
                    <FaPlus className="text-emerald-500" />
                    {t("pkkAdminProgram.modal.addTitle")}
                  </>
                )}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("pkkAdminProgram.form.programName.label")}
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  placeholder={t(
                    "pkkAdminProgram.form.programName.placeholder"
                  )}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("pkkAdminProgram.form.image.label")}
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
                  {t("pkkAdminProgram.form.description.label")}
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  placeholder={t(
                    "pkkAdminProgram.form.description.placeholder"
                  )}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition"
                >
                  <FaSave />{" "}
                  {editingProgramId
                    ? t("pkkAdminProgram.buttons.update")
                    : t("pkkAdminProgram.buttons.save")}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  <FaTimes /> {t("pkkAdminProgram.buttons.cancel")}
                </button>
              </div>
            </form>
          )}

          {/* List Program */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full italic">
                {t("pkkAdminProgram.empty.noPrograms")}
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
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                      >
                        <FaEdit /> {t("pkkAdminProgram.buttons.edit")}
                      </button>
                      <button
                        onClick={() => handleProgramDelete(program.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        <FaTrash /> {t("pkkAdminProgram.buttons.delete")}
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
            <div className="flex items-center gap-2 text-gray-800">
              <FaUsers className="text-2xl text-green-600" />
              <h2 className="text-xl font-semibold">
                {t("pkkAdminStructure.title")}
              </h2>
            </div>

            <button
              onClick={() => {
                resetForms();
                setShowMemberForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
            >
              <FaPlus /> {t("pkkAdminStructure.buttons.add")}
            </button>
          </div>

          {/* List Anggota */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full italic">
                {t("pkkAdminStructure.empty.noMembers")}
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
                        {t("pkkAdminStructure.labels.orgType")}
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
                        {member.is_term
                          ? t("pkkAdminStructure.labels.active")
                          : t("pkkAdminStructure.labels.inactive")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between p-4 border-t text-sm">
                    <button
                      onClick={() => handleMemberEdit(member.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit /> {t("pkkAdminStructure.buttons.edit")}
                    </button>
                    <button
                      onClick={() => handleMemberDelete(member.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash /> {t("pkkAdminStructure.buttons.delete")}
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

          {/* Modal Form Anggota */}
          {showMemberForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                {/* Header Modal */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <FaUsers />
                    {editingMemberId
                      ? t("pkkAdminStructure.modal.editTitle")
                      : t("pkkAdminStructure.modal.addTitle")}
                  </h2>
                  <button
                    onClick={resetForms}
                    className="text-white hover:text-gray-200 transition"
                  >
                    <FaTimes size={22} />
                  </button>
                </div>

                <form
                  onSubmit={handleMemberSave}
                  className="p-6 max-h-[80vh] overflow-y-auto space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("pkkAdminStructure.form.name.label")}
                      </label>
                      <input
                        type="text"
                        placeholder={t(
                          "pkkAdminStructure.form.name.placeholder"
                        )}
                        value={memberForm.name}
                        onChange={(e) =>
                          setMemberForm({ ...memberForm, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("pkkAdminStructure.form.position.label")}
                      </label>
                      <input
                        type="text"
                        placeholder={t(
                          "pkkAdminStructure.form.position.placeholder"
                        )}
                        value={memberForm.position}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            position: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("pkkAdminStructure.form.termStart.label")}
                      </label>
                      <input
                        type="number"
                        placeholder={t(
                          "pkkAdminStructure.form.termStart.placeholder"
                        )}
                        value={memberForm.term_start}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            term_start: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("pkkAdminStructure.form.termEnd.label")}
                      </label>
                      <input
                        type="number"
                        placeholder={t(
                          "pkkAdminStructure.form.termEnd.placeholder"
                        )}
                        value={memberForm.term_end}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            term_end: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("pkkAdminStructure.form.importance.label")}
                    </label>
                    <input
                      type="number"
                      placeholder={t(
                        "pkkAdminStructure.form.importance.placeholder"
                      )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("pkkAdminStructure.form.photo.label")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          profile_photo: e.target.files[0],
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("pkkAdminStructure.form.status.label")}
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="relative inline-block w-14 h-7">
                        <input
                          type="checkbox"
                          checked={memberForm.is_term}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              is_term: e.target.checked,
                            })
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
                          memberForm.is_term
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {memberForm.is_term
                          ? t("pkkAdminStructure.form.status.active")
                          : t("pkkAdminStructure.form.status.inactive")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition shadow"
                      onClick={resetForms}
                    >
                      {t("pkkAdminStructure.buttons.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg transition transform hover:-translate-y-0.5"
                    >
                      {editingMemberId
                        ? t("pkkAdminStructure.buttons.update")
                        : t("pkkAdminStructure.buttons.save")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Agenda PKK Section */}
      {activeTab === "agenda" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {t("pkkAdmin.agenda.title")}
            </h2>
            {!showAgendaForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowAgendaForm(true);
                }}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                <FaPlus /> {t("pkkAdmin.agenda.buttons.addAgenda")}
              </button>
            )}
          </div>

          {/* Form Agenda */}
          {showAgendaForm && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 border">
              <h3 className="text-lg font-semibold mb-4">
                {editingAgendaId
                  ? t("pkkAdmin.agenda.form.editTitle")
                  : t("pkkAdmin.agenda.form.addTitle")}
              </h3>

              <form onSubmit={handleAgendaSave} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {t("pkkAdmin.agenda.form.agendaTitle")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.title}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, title: e.target.value })
                    }
                    placeholder={t(
                      "pkkAdmin.agenda.form.agendaTitlePlaceholder"
                    )}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {t("pkkAdmin.agenda.form.agendaDescription")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.content}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, content: e.target.value })
                    }
                    placeholder={t(
                      "pkkAdmin.agenda.form.agendaDescriptionPlaceholder"
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      {t("pkkAdmin.agenda.form.startTime")}{" "}
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
                      {t("pkkAdmin.agenda.form.endTime")}{" "}
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
                    {t("pkkAdmin.agenda.form.location")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                    value={agendaForm.location}
                    onChange={(e) =>
                      setAgendaForm({ ...agendaForm, location: e.target.value })
                    }
                    placeholder={t("pkkAdmin.agenda.form.locationPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {t("pkkAdmin.agenda.form.agendaImage")}
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
                        alt={t("pkkAdmin.agenda.form.imagePreview")}
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
                    {t("pkkAdmin.agenda.form.publishAgenda")}
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                  >
                    <FaSave />{" "}
                    {editingAgendaId
                      ? t("pkkAdmin.agenda.buttons.update")
                      : t("pkkAdmin.agenda.buttons.save")}
                  </button>
                  <button
                    type="button"
                    onClick={resetForms}
                    className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    <FaTimes /> {t("pkkAdmin.agenda.buttons.cancel")}
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
                  {t("pkkAdmin.agenda.empty.noAgenda")}
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
                                ? t("pkkAdmin.agenda.status.published")
                                : t("pkkAdmin.agenda.status.draft")}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 lg:flex-col">
                          <button
                            onClick={() => handleAgendaEdit(agenda.id)}
                            className="flex items-center gap-1 px-3 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition text-sm"
                          >
                            <FaEdit /> {t("pkkAdmin.agenda.buttons.edit")}
                          </button>
                          <button
                            onClick={() => handleAgendaDelete(agenda.id)}
                            className="flex items-center gap-1 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition text-sm"
                          >
                            <FaTrash /> {t("pkkAdmin.agenda.buttons.delete")}
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
