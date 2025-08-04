import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewsApi } from "../../libs/api/NewsApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Pagination from "../ui/Pagination";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimesCircle,
} from "react-icons/fa";

export default function ManageBerita() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const fetchNews = async () => {
    const response = await NewsApi.getOwnNews(currentPage, 6, i18n.language);
    if (!response.ok) {
      alertError(t("manageNews.error.fetchFailed"));
      return;
    }
    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.current_page);
    setNews(responseBody.data);
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
    const rawData = {
      title,
      content,
      is_published: isPublished,
      featured_image: featuredImage,
    };

    if (editingId) {
      if (!(await alertConfirm(t("manageNews.confirmation.editNews")))) return;

      const response = await NewsApi.updateNews(
        editingId,
        rawData,
        i18n.language
      );
      const responseBody = await response.json();
      if (!response.ok) {
        await Helper.errorResponseHandler(responseBody);
        return;
      }

      resetForm();
      setShowForm(false);
      await alertSuccess(t("manageNews.success.updateNews"));
      fetchNews();
      return;
    }

    const response = await NewsApi.createNews(rawData, i18n.language);
    const responseBody = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }
    await alertSuccess(t("manageNews.success.addNews"));
    fetchNews();

    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (await alertConfirm(t("manageNews.confirmation.deleteNews"))) {
      const response = await NewsApi.deleteNews(id, i18n.language);
      if (!response.ok) {
        const responseBody = await response.json();
        await Helper.errorResponseHandler(responseBody);
        return;
      }
      setNews(news.filter((b) => b.id !== id));
    }
  };

  const handleEdit = (id) => {
    const berita = news.find((b) => b.id === id);
    if (!berita) return;
    setTitle(berita.title);
    setContent(berita.content);
    setFeaturedImage(null);
    setIsPublished(berita.isPublished);
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          {t("manageNews.title")}
        </h1>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus /> {t("manageNews.buttons.addNews")}
          </button>
        )}
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("manageNews.form.newsTitle")}
            </label>
            <input
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("manageNews.form.titlePlaceholder")}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("manageNews.form.content")}
            </label>
            <textarea
              className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-green-300 outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("manageNews.form.contentPlaceholder")}
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("manageNews.form.uploadMainImage")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              className="w-full border p-2 rounded"
            />
            {(featuredImage ||
              (editingId &&
                news.find((b) => b.id === editingId)?.featuredImage)) && (
              <img
                src={
                  featuredImage
                    ? URL.createObjectURL(featuredImage)
                    : news.find((b) => b.id === editingId)?.featuredImage
                }
                alt={t("manageNews.preview")}
                className="mt-3 w-40 rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              {t("manageNews.form.publishStatus")}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isPublished
                    ? "bg-green-500 text-white shadow"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaCheck /> {t("manageNews.status.yes")}
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  !isPublished
                    ? "bg-red-500 text-white shadow"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaTimes /> {t("manageNews.status.no")}
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
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
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <FaTimes /> {t("manageNews.buttons.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* LIST BERITA */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <img
              src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                item.featured_image
              }`}
              alt={item.title}
              className="rounded-t-xl w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                {Helper.truncateText(item.content)}
              </p>

              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>{Helper.formatTanggal(item.created_at)}</span>
                {item.is_published ? (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <FaCheck /> {t("manageNews.status.published")}
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <FaTimesCircle /> {t("manageNews.status.unpublished")}
                  </span>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                >
                  <FaEdit /> {t("manageNews.buttons.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                >
                  <FaTrash /> {t("manageNews.buttons.delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
