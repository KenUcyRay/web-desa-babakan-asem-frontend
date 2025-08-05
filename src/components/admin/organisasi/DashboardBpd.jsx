import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaEdit,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import { MemberApi } from "../../../libs/api/MemberApi";
import { AgendaApi } from "../../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";

export default function DashboardBpd() {
  const { t, i18n } = useTranslation();
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
      alertError("Gagal mengambil data anggota BPD.");
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

    try {
      if (editingMemberId) {
        if (
          !(await alertConfirm("Yakin ingin menyimpan perubahan anggota BPD?"))
        )
          return;

        const response = await MemberApi.updateMember(
          editingMemberId,
          rawData,
          i18n.language
        );
        if (!response.ok)
          throw new Error("Gagal menyimpan perubahan anggota BPD.");

        await alertSuccess("Anggota BPD berhasil diperbarui!");
      } else {
        const response = await MemberApi.createMember(rawData, i18n.language);
        if (!response.ok) throw new Error("Gagal menambahkan anggota BPD.");

        await alertSuccess("Anggota BPD berhasil ditambahkan!");
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
    if (!(await alertConfirm("Yakin ingin menghapus anggota BPD ini?"))) return;

    const response = await MemberApi.deleteMember(id, i18n.language);
    if (!response.ok) {
      alertError("Gagal menghapus anggota BPD.");
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
    if (!response.ok) return alertError("Gagal mengambil agenda BPD.");

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
      start_time: new Date(agendaForm.start_time).toISOString(),
      end_time: new Date(agendaForm.end_time).toISOString(),
      location: agendaForm.location,
      featured_image: agendaForm.featured_image,
      is_published: agendaForm.is_published,
      type: "BPD", // Hardcode untuk BPD
    };

    try {
      if (editingAgendaId) {
        if (
          !(await alertConfirm("Yakin ingin menyimpan perubahan agenda BPD?"))
        )
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

        await alertSuccess("Agenda BPD berhasil diperbarui!");
      } else {
        const response = await AgendaApi.createAgenda(rawData, i18n.language);
        if (!response.ok) throw new Error("Gagal menambahkan agenda BPD.");

        await alertSuccess("Agenda BPD berhasil ditambahkan!");
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
    if (!(await alertConfirm("Yakin ingin menghapus agenda BPD ini?"))) return;

    const response = await AgendaApi.deleteAgenda(id, i18n.language);
    if (!response.ok) return alertError("Gagal menghapus agenda BPD.");

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

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          {t("dashboardBpd.title") || "Dashboard BPD"}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("structure")}
          className={`px-4 py-2 font-medium ${
            activeTab === "structure"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          <FaUsers className="inline mr-2" />{" "}
          {t("dashboardBpd.tabs.structure") || "Struktur BPD"}
        </button>
        <button
          onClick={() => setActiveTab("agenda")}
          className={`px-4 py-2 font-medium ${
            activeTab === "agenda"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          <FaCalendarAlt className="inline mr-2" />{" "}
          {t("dashboardBpd.tabs.agenda") || "Agenda BPD"}
        </button>
      </div>

      {/* Struktur BPD Section */}
      {activeTab === "structure" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {t("dashboardBpd.structure.title") || "Struktur Organisasi BPD"}
            </h2>
            {!showMemberForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowMemberForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              >
                <FaPlus />{" "}
                {t("dashboardBpd.structure.addMember") || "Tambah Anggota"}
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
                  ? t("dashboardBpd.structure.editMember") || "Edit Anggota BPD"
                  : t("dashboardBpd.structure.addNewMember") ||
                    "Tambah Anggota BPD Baru"}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("dashboardBpd.form.fullName") || "Nama Lengkap"}
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                  placeholder={
                    t("dashboardBpd.form.fullNamePlaceholder") ||
                    "Nama lengkap anggota"
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("dashboardBpd.form.position") || "Jabatan"}
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={memberForm.position}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, position: e.target.value })
                  }
                  placeholder={
                    t("dashboardBpd.form.positionPlaceholder") ||
                    "Jabatan dalam struktur"
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {t("dashboardBpd.form.termStart") || "Masa Jabatan Mulai"}
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
                    placeholder={
                      t("dashboardBpd.form.termStartPlaceholder") ||
                      "Tahun mulai"
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {t("dashboardBpd.form.termEnd") || "Masa Jabatan Berakhir"}
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3"
                    value={memberForm.term_end}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, term_end: e.target.value })
                    }
                    placeholder={
                      t("dashboardBpd.form.termEndPlaceholder") ||
                      "Tahun berakhir"
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("dashboardBpd.form.profilePhoto") || "Foto Profil"}
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
                <span>
                  {t("dashboardBpd.form.stillServing") || "Masih menjabat?"}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
                >
                  <FaSave />{" "}
                  {editingMemberId
                    ? t("dashboardBpd.form.update") || "Update"
                    : t("dashboardBpd.form.save") || "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  <FaTimes /> {t("dashboardBpd.form.cancel") || "Batal"}
                </button>
              </div>
            </form>
          )}

          {/* List Anggota */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length === 0 ? (
              <p className="text-gray-500 italic">
                {t("dashboardBpd.structure.noMembers") ||
                  "Belum ada anggota struktur BPD"}
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
                      <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700">
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
                          ? t("dashboardBpd.status.serving") || "Menjabat"
                          : t("dashboardBpd.status.notServing") ||
                            "Tidak Menjabat"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between p-4 border-t text-sm">
                    <button
                      onClick={() => handleMemberEdit(member.id)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <FaEdit /> {t("dashboardBpd.buttons.edit") || "Edit"}
                    </button>
                    <button
                      onClick={() => handleMemberDelete(member.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash /> {t("dashboardBpd.buttons.delete") || "Hapus"}
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
            <h2 className="text-xl font-semibold text-gray-800">
              {t("dashboardBpd.agenda.title") || "Agenda Kegiatan BPD"}
            </h2>
            {!showAgendaForm && (
              <button
                onClick={() => {
                  resetForms();
                  setShowAgendaForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
              >
                <FaPlus />{" "}
                {t("dashboardBpd.agenda.addAgenda") || "Tambah Agenda"}
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
                {editingAgendaId
                  ? t("dashboardBpd.agenda.editAgenda") || "Edit Agenda BPD"
                  : t("dashboardBpd.agenda.addNewAgenda") ||
                    "Tambah Agenda BPD Baru"}
              </h3>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  {t("dashboardBpd.form.agendaTitle") || "Judul Agenda"}
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={agendaForm.title}
                  onChange={(e) =>
                    setAgendaForm({ ...agendaForm, title: e.target.value })
                  }
                  placeholder={
                    t("dashboardBpd.form.agendaTitlePlaceholder") ||
                    "Contoh: Rapat Rutin BPD"
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Deskripsi Agenda
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 outline-none"
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
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 outline-none"
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
                  className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
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
                {t("dashboardBpd.agenda.noAgendas") ||
                  "Belum ada agenda BPD yang tersedia"}
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
                      {agenda.is_published
                        ? t("dashboardBpd.status.published") || "Published"
                        : t("dashboardBpd.status.unpublished") || "Unpublished"}
                    </span>

                    <div className="flex justify-between mt-4 border-t pt-3">
                      <button
                        onClick={() => handleAgendaEdit(agenda.id)}
                        className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 text-sm"
                      >
                        <FaEdit /> {t("dashboardBpd.buttons.edit") || "Edit"}
                      </button>
                      <button
                        onClick={() => handleAgendaDelete(agenda.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrash />{" "}
                        {t("dashboardBpd.buttons.delete") || "Hapus"}
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
