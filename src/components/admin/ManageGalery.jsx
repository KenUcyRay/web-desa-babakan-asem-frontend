import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaImage,
  FaEdit,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManageGalery() {
  const { t, i18n } = useTranslation();
  const [galeries, setGaleries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setImage(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || (!image && !editingId)) {
      return alertError(t("manageGallery.validation.completeData"));
    }

    if (editingId) {
      if (!(await alertConfirm(t("manageGallery.confirmation.editPhoto"))))
        return;

      const response = await GaleryApi.updateGaleri(
        editingId,
        { title, image },
        i18n.language
      );
      const body = await response.json();

      if (!response.ok) {
        alertError(
          typeof body.error === "string"
            ? body.error
            : t("manageGallery.error.saveChanges")
        );
        return;
      }

      setGaleries((prev) =>
        prev.map((g) => (g.id === editingId ? body.galeri : g))
      );
      await alertSuccess(t("manageGallery.success.photoUpdated"));
      resetForm();
      return;
    }

    const response = await GaleryApi.createGaleri(
      { title, image },
      i18n.language
    );
    const body = await response.json();

    if (!response.ok) {
      alertError(
        typeof body.error === "string"
          ? body.error
          : t("manageGallery.error.savePhoto")
      );
      return;
    }

    setGaleries([body.galeri, ...galeries]);
    await alertSuccess(t("manageGallery.success.photoAdded"));
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm(t("manageGallery.confirmation.deletePhoto"))))
      return;

    const response = await GaleryApi.deleteGaleri(id, i18n.language);
    if (!response.ok) {
      const body = await response.json();
      alertError(
        typeof body.error === "string"
          ? body.error
          : t("manageGallery.error.deletePhoto")
      );
      return;
    }

    setGaleries((prev) => prev.filter((g) => g.id !== id));
    await alertSuccess(t("manageGallery.success.photoDeleted"));
  };

  const handleEdit = (id) => {
    const galeri = galeries.find((g) => g.id === id);
    if (!galeri) return;
    setEditingId(galeri.id);
    setTitle(galeri.title);
    setImage(null);
    setShowForm(true);
  };

  const fetchGaleries = async () => {
    const response = await GaleryApi.getGaleri(currentPage, 9, i18n.language);
    const body = await response.json();

    if (!response.ok) {
      alertError(
        typeof body.error === "string"
          ? body.error
          : t("manageGallery.error.fetchData")
      );
      return;
    }

    setGaleries(body.galeri);
    setTotalPages(body.total_page);
    setCurrentPage(body.page);
  };

  useEffect(() => {
    fetchGaleries();
  }, [currentPage, i18n.language]);

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaImage className="text-blue-500" />
            {t("manageGallery.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("manageGallery.subtitle")}</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
          >
            <FaPlus /> {t("manageGallery.buttons.addPhoto")}
          </button>
        )}
      </div>

      {/* FORM TAMBAH/EDIT FOTO */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 mx-auto max-w-2xl"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId
                ? t("manageGallery.form.editPhoto")
                : t("manageGallery.form.addPhoto")}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("manageGallery.form.photoTitle")}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("manageGallery.form.photoTitlePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("manageGallery.form.uploadImage")}
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
                    galeries.find((b) => b.id === editingId)?.image)) && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : `${
                              import.meta.env.VITE_NEW_BASE_URL
                            }/public/images/${
                              galeries.find((b) => b.id === editingId)?.image
                            }`
                      }
                      alt={t("manageGallery.preview.altText")}
                      className="max-w-full h-48 rounded-lg object-contain border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
            >
              <FaSave />{" "}
              {editingId
                ? t("manageGallery.buttons.updatePhoto")
                : t("manageGallery.buttons.savePhoto")}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl transition"
            >
              <FaTimes /> {t("manageGallery.buttons.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* LIST GALERI */}
      {galeries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {t("manageGallery.empty.title")}
          </h3>
          <p className="text-gray-500 mb-4">
            {showForm
              ? t("manageGallery.empty.completeForm")
              : t("manageGallery.empty.noPhotos")}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <FaPlus /> {t("manageGallery.buttons.addPhoto")}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galeries.map((galeri) => (
              <div
                key={galeri.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      galeri.image
                    }`}
                    alt={galeri.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 line-clamp-2">
                    {galeri.title}
                  </h3>
                  <div className="flex justify-between mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(galeri.id)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaEdit size={14} /> {t("manageGallery.buttons.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(galeri.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaTrash size={14} /> {t("manageGallery.buttons.delete")}
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
