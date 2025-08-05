import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewsApi } from "../../../libs/api/NewsApi";
import { alertConfirm, alertError, alertSuccess } from "../../../libs/alert";
import { Helper } from "../../../utils/Helper";
import Pagination from "../../ui/Pagination";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimesCircle,
  FaImage,
  FaNewspaper,
} from "react-icons/fa";

export default function ManageBerita() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    const response = await NewsApi.getOwnNews(currentPage, 6, i18n.language);
    if (!response.ok) {
      setIsLoading(false);
      return;
    }
    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.current_page);
    setNews(responseBody.data);
    setIsLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, i18n.language]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const rawData = {
      title,
      content,
      is_published: isPublished,
      featured_image: featuredImage,
    };

    try {
      if (editingId) {
        if (!(await alertConfirm(t("manageNews.confirmation.editNews"))))
          return;

        const response = await NewsApi.updateNews(
          editingId,
          rawData,
          i18n.language
        );
        const responseBody = await response.json();
        if (!response.ok) {
          throw new Error(
            responseBody.message || t("manageNews.error.updateFailed")
          );
        }

        await alertSuccess(t("manageNews.success.updateNews"));
      } else {
        const response = await NewsApi.createNews(rawData, i18n.language);
        const responseBody = await response.json();
        if (!response.ok) {
          throw new Error(
            responseBody.message || t("manageNews.error.createFailed")
          );
        }
        await alertSuccess(t("manageNews.success.addNews"));
      }

      resetForm();
      setShowForm(false);
      fetchNews();
    } catch (error) {
      alertError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm(t("manageNews.confirmation.deleteNews")))) return;

    setIsLoading(true);
    try {
      const response = await NewsApi.deleteNews(id, i18n.language);
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(
          responseBody.message || t("manageNews.error.deleteFailed")
        );
      }
      setNews(news.filter((b) => b.id !== id));
      await alertSuccess(t("manageNews.success.deleteNews"));
    } catch (error) {
      alertError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const berita = news.find((b) => b.id === id);
    if (!berita) return;
    setTitle(berita.title);
    setContent(berita.content);
    setFeaturedImage(null);
    setIsPublished(berita.is_published);
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="font-[Poppins,sans-serif] animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FaNewspaper className="text-3xl text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("manageNews.title")}
            </h1>
            <p className="text-gray-500 text-sm">
              {t("manageNews.subtitle") || "Kelola berita dan informasi desa"}
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <FaPlus className="text-sm" /> {t("manageNews.buttons.addNews")}
          </button>
        )}
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-5 max-w-3xl border border-gray-100 animate-slideDown"
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {editingId ? (
              <>
                <FaEdit /> {t("manageNews.form.editTitle") || "Edit Berita"}
              </>
            ) : (
              <>
                <FaPlus />{" "}
                {t("manageNews.form.addTitle") || "Tambah Berita Baru"}
              </>
            )}
          </h2>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700">
              {t("manageNews.form.newsTitle")}
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                t("manageNews.form.newsTitlePlaceholder") ||
                "Masukkan judul berita"
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700">
              {t("manageNews.form.content")}
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none transition"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("manageNews.form.contentPlaceholder")}
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <FaImage /> {t("manageNews.form.uploadMainImage")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
            />
            {(featuredImage ||
              (editingId &&
                news.find((b) => b.id === editingId)?.featured_image)) && (
              <div className="mt-3 flex justify-center">
                <img
                  src={
                    featuredImage
                      ? URL.createObjectURL(featuredImage)
                      : `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                          news.find((b) => b.id === editingId)?.featured_image
                        }`
                  }
                  alt={t("manageNews.preview.altText") || "preview"}
                  className="max-w-full h-48 rounded-lg object-cover shadow-sm border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              {t("manageNews.form.publishStatus")}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isPublished
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaCheck /> {t("manageNews.status.yes")}
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  !isPublished
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaTimes /> {t("manageNews.status.no")}
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FaSave />{" "}
              {editingId
                ? t("manageNews.buttons.updateNews")
                : t("manageNews.buttons.saveNews")}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2.5 rounded-lg transition"
            >
              <FaTimes /> {t("manageNews.buttons.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* LIST BERITA */}
      {isLoading && news.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FaNewspaper className="mx-auto text-4xl text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-500">
            {t("manageNews.empty.noNews") || "Belum ada berita yang tersedia"}
          </h3>
          <p className="text-gray-400 mt-1">
            {t("manageNews.empty.addFirst") ||
              'Klik tombol "Tambah Berita" untuk membuat berita pertama'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                    item.featured_image
                  }`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-lg font-semibold text-white line-clamp-2">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {Helper.truncateText(item.content, 100)}
                </p>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {Helper.formatTanggal(item.created_at)}
                    </span>
                    {item.is_published ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaCheck size={10} /> {t("manageNews.status.published")}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaTimesCircle size={10} />{" "}
                        {t("manageNews.status.unpublished")}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-indigo-600 hover:text-indigo-800 transition p-1"
                      title={t("manageNews.buttons.edit") || "Edit"}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 transition p-1"
                      title={t("manageNews.buttons.delete") || "Hapus"}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {news.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}
