import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiX,
  FiCheck,
  FiImage,
  FiType,
  FiAlignLeft,
  FiClock,
  FiNavigation,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import Pagination from "../ui/Pagination";
import { Helper } from "../../utils/Helper";

export default function ManageAgenda() {
  const { t, i18n } = useTranslation();
  const kategoriList = ["Semua", "REGULAR", "PKK", "KARANG_TARUNA", "BPD"];

  const kategoriLabel = {
    Semua: t("manageAgenda.categories.all"),
    REGULAR: t("manageAgenda.categories.regular"),
    PKK: t("manageAgenda.categories.pkk"),
    KARANG_TARUNA: t("manageAgenda.categories.karangTaruna"),
    BPD: t("manageAgenda.categories.bpd"),
  };

  const type = [
    { id: 1, name: t("manageAgenda.types.regular"), value: "REGULAR" },
    { id: 2, name: t("manageAgenda.types.pkk"), value: "PKK" },
    {
      id: 3,
      name: t("manageAgenda.types.karangTaruna"),
      value: "KARANG_TARUNA",
    },
    { id: 4, name: t("manageAgenda.types.bpd"), value: "BPD" },
  ];

  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [kategori, setKategori] = useState("Semua");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [typeSelected, setTypeSelected] = useState("REGULAR");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await alertConfirm(
        t("manageAgenda.confirmation.deleteAgenda")
      );

      if (!confirm) return;

      const response = await AgendaApi.deleteAgenda(id, i18n.language);

      if (!response.ok) {
        alertError(t("manageAgenda.error.deleteAgenda"));
        return;
      }

      await alertSuccess(t("manageAgenda.success.agendaDeleted"));
      setAgenda(agenda.filter((a) => a.id !== id));
    } catch (error) {
      alertError(t("manageAgenda.error.general", { error: error.message }));
    }
  };

  const handleEdit = (id) => {
    const item = agenda.find((a) => a.id === id);
    if (!item) return;
    setTitle(item.title);
    setContent(item.content);
    setStartTime(item.start_time);
    setEndTime(item.end_time);
    setLocation(item.location);
    setFeaturedImage(null);
    setIsPublished(item.is_published);
    setTypeSelected(item.type || "REGULAR");
    setEditingId(id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = {
      title,
      content,
      start_time: startTime
        ? new Date(startTime).toISOString()
        : agenda.find((a) => a.id === editingId)?.start_time,
      end_time: endTime
        ? new Date(endTime).toISOString()
        : agenda.find((a) => a.id === editingId)?.end_time,
      location,
      featured_image: featuredImage,
      is_published: isPublished,
      type: typeSelected,
    };

    if (editingId) {
      if (!(await alertConfirm(t("manageAgenda.confirmation.editAgenda"))))
        return;

      const response = await AgendaApi.updateAgenda(
        editingId,
        rawData,
        i18n.language
      );
      const resBody = await response.json();

      if (!response.ok) {
        alertError(
          typeof resBody.error === "string"
            ? resBody.error
            : t("manageAgenda.error.updateAgenda")
        );
        return;
      }

      await alertSuccess(t("manageAgenda.success.agendaUpdated"));
      resetForm();
      fetchAgenda();
      return;
    }

    // Kode untuk tambah baru
    const response = await AgendaApi.createAgenda(rawData, i18n.language);
    const resBody = await response.json();

    if (!response.ok) {
      alertError(
        typeof resBody.error === "string"
          ? resBody.error
          : t("manageAgenda.error.createAgenda")
      );
      return;
    }

    await alertSuccess(t("manageAgenda.success.agendaAdded"));
    await fetchAgenda();
    resetForm();
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

  const fetchAgenda = async () => {
    try {
      const response = await AgendaApi.getOwnAgenda(
        currentPage,
        6,
        kategori,
        i18n.language
      );
      if (!response.ok) {
        alertError(t("manageAgenda.error.fetchAgenda"));
        return;
      }
      const resBody = await response.json();

      let data = resBody.agenda || [];

      setAgenda(data);
      setCurrentPage(resBody.page || 1);
      setTotalPages(resBody.total_page || 1);
    } catch (error) {
      alertError(t("manageAgenda.error.fetchData"));
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, [currentPage, kategori, i18n.language]);

  return (
    <div className="font-[Poppins,sans-serif] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FiCalendar className="inline" />
            </span>
            {t("manageAgenda.title")}
          </h1>
          <p className="text-gray-500 mt-1">{t("manageAgenda.subtitle")}</p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span>{t("manageAgenda.buttons.addAgenda")}</span>
          </button>
        )}
      </div>

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-2 mb-8">
        {kategoriList.map((k) => (
          <button
            key={k}
            onClick={() => {
              setKategori(k);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-sm flex items-center gap-1 ${
              kategori === k
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {k === "Semua" ? (
              <span>{kategoriLabel[k]}</span>
            ) : (
              <>
                <span className="hidden sm:inline">{kategoriLabel[k]}</span>
                <span className="sm:hidden">
                  {kategoriLabel[k].split(" ")[0]}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Form Tambah / Edit */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100 space-y-5 max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <FiEdit2 className="text-blue-500" />
                  <span>{t("manageAgenda.form.editAgenda")}</span>
                </>
              ) : (
                <>
                  <FiPlus className="text-blue-500" />
                  <span>{t("manageAgenda.form.addAgenda")}</span>
                </>
              )}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiType size={14} />
                  <span>{t("manageAgenda.form.title")}</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("manageAgenda.form.titlePlaceholder")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiAlignLeft size={14} />
                  <span>{t("manageAgenda.form.description")}</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-32 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("manageAgenda.form.descriptionPlaceholder")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiNavigation size={14} />
                  <span>{t("manageAgenda.form.location")}</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("manageAgenda.form.locationPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiClock size={14} />
                    <span>{t("manageAgenda.form.startTime")}</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiClock size={14} />
                    <span>{t("manageAgenda.form.endTime")}</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiCalendar size={14} />
                  <span>{t("manageAgenda.form.type")}</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  value={typeSelected}
                  onChange={(e) => setTypeSelected(e.target.value)}
                >
                  {type.map((c) => (
                    <option key={c.id} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiImage size={14} />
                  <span>{t("manageAgenda.form.featuredImage")}</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                      <FiImage className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500 text-center">
                        {featuredImage
                          ? featuredImage.name
                          : t("manageAgenda.form.uploadImage")}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFeaturedImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                {(featuredImage ||
                  (editingId &&
                    agenda.find((a) => a.id === editingId)
                      ?.featured_image)) && (
                  <div className="mt-2">
                    <img
                      src={
                        featuredImage
                          ? URL.createObjectURL(featuredImage)
                          : `${
                              import.meta.env.VITE_NEW_BASE_URL
                            }/public/images/${
                              agenda.find((a) => a.id === editingId)
                                ?.featured_image
                            }`
                      }
                      alt="preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t("manageAgenda.form.publishStatus")}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPublished(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                      isPublished
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FiCheck /> {t("manageAgenda.form.publish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublished(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                      !isPublished
                        ? "bg-red-100 border-red-500 text-red-700"
                        : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FiX /> {t("manageAgenda.form.draft")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              {t("manageAgenda.form.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-2"
            >
              {editingId ? (
                <>
                  <FiEdit2 /> {t("manageAgenda.form.updateAgenda")}
                </>
              ) : (
                <>
                  <FiPlus /> {t("manageAgenda.form.saveAgenda")}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* List Agenda */}
      {agenda.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto max-w-md">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {t("manageAgenda.empty.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {kategori === "Semua"
                ? t("manageAgenda.empty.noAgenda")
                : t("manageAgenda.empty.noAgendaForCategory", {
                    category: kategoriLabel[kategori],
                  })}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                {t("manageAgenda.buttons.addAgenda")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agenda.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      a.featured_image
                    }`}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      a.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {a.is_published
                      ? t("manageAgenda.status.published")
                      : t("manageAgenda.status.draft")}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {type.find((t) => t.value === a.type)?.name || "Regular"}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {a.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {a.content}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <FiCalendar className="flex-shrink-0 mt-1 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-700">Mulai:</div>
                        <div className="text-gray-500">
                          {formatDateTime(a.start_time)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiCalendar className="flex-shrink-0 mt-1 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-700">
                          Selesai:
                        </div>
                        <div className="text-gray-500">
                          {formatDateTime(a.end_time)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin className="flex-shrink-0 mt-1 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-700">Lokasi:</div>
                        <div className="text-gray-500 line-clamp-1">
                          {a.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleEdit(a.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition"
                    >
                      <FiTrash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
