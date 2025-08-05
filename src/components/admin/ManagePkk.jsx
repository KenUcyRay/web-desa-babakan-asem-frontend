import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { ProgramApi } from "../../libs/api/ProgramApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";

export default function ManagePkk() {
  const { t, i18n } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !desc || (!image && !editingId)) {
      return alertError(t("managePkk.validation.completeAllData"));
    }

    if (editingId) {
      if (!(await alertConfirm(t("managePkk.confirmation.saveChanges"))))
        return;

      const rawData = {
        title,
        description: desc,
        featured_image: image,
      };
      const response = await ProgramApi.updateProgram(
        editingId,
        rawData,
        i18n.language
      );
      const body = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }

      setPrograms((prev) =>
        prev.map((p) => (p.id === editingId ? body.program : p))
      );

      await alertSuccess(t("managePkk.success.programUpdated"));
    } else {
      const rawData = {
        title,
        description: desc,
        featured_image: image,
      };

      const response = await ProgramApi.createProgram(rawData, i18n.language);
      const body = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }

      setPrograms([body.program, ...programs]);
      await alertSuccess(t("managePkk.success.programAdded"));
    }

    resetForm();
  };

  const handleEdit = (id) => {
    const program = programs.find((p) => p.id === id);
    if (!program) return;
    setEditingId(program.id);
    setTitle(program.title);
    setDesc(program.description);
    setImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
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

  const fetchPrograms = async () => {
    const response = await ProgramApi.getPrograms(
      currentPage,
      9,
      i18n.language
    );
    const body = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(body);
      return;
    }

    setTotalPages(body.total_page);
    setCurrentPage(body.page);
    setPrograms(body.programs);
  };

  useEffect(() => {
    fetchPrograms();
  }, [currentPage, i18n.language]);

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-3">
            <FaCalendarAlt className="text-emerald-600" />
            {t("managePkk.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("managePkk.subtitle")}</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
          >
            <FaPlus /> {t("managePkk.buttons.addProgram")}
          </button>
        )}
      </div>

      {/* FORM TAMBAH/EDIT */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 mx-auto max-w-3xl"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            {editingId ? (
              <>
                <FaEdit className="text-emerald-500" />
                {t("managePkk.form.editProgram")}
              </>
            ) : (
              <>
                <FaPlus className="text-emerald-500" />
                {t("managePkk.form.addProgram")}
              </>
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("managePkk.form.programName")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("managePkk.form.programNamePlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("managePkk.form.description")}
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={t("managePkk.form.descriptionPlaceholder")}
                />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("managePkk.form.uploadImage")}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full mb-3"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {(image ||
                    (editingId &&
                      programs.find((p) => p.id === editingId)
                        ?.featured_image)) && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : `${
                                import.meta.env.VITE_NEW_BASE_URL
                              }/public/images/${
                                programs.find((p) => p.id === editingId)
                                  ?.featured_image
                              }`
                        }
                        alt="preview"
                        className="max-w-full h-48 rounded-lg object-contain border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Simpan/Batal */}
          <div className="flex gap-3 mt-8 pt-5 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
            >
              <FaSave />{" "}
              {editingId
                ? t("managePkk.buttons.updateProgram")
                : t("managePkk.buttons.saveProgram")}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl transition"
            >
              <FaTimes /> {t("managePkk.buttons.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* LIST PROGRAM */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {t("managePkk.empty.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {showForm
              ? t("managePkk.empty.fillFormMessage")
              : t("managePkk.empty.noPrograms")}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <FaPlus /> {t("managePkk.buttons.addProgram")}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      program.featured_image
                    }`}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 line-clamp-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {program.description}
                  </p>

                  <div className="flex justify-between mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(program.id)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaEdit size={14} /> {t("managePkk.buttons.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaTrash size={14} /> {t("managePkk.buttons.delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
