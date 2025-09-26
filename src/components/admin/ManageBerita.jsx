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
  FaNewspaper,
  FaImage,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ManageBerita() {
  const { i18n } = useTranslation();
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
    if (!response.ok) return;

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
      if (!(await alertConfirm("Yakin ingin mengedit berita ini?"))) return;

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
      await alertSuccess("Berita berhasil diperbarui");
      fetchNews();
      return;
    }

    const response = await NewsApi.createNews(rawData, i18n.language);
    const responseBody = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }
    await alertSuccess("Berita berhasil ditambahkan!");
    fetchNews();

    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (await alertConfirm("Yakin ingin menghapus berita ini?")) {
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
    <div className="font-[Poppins,sans-serif] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg">
              <FaNewspaper className="inline" />
            </span>
            Kelola Berita
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola berita dan informasi terbaru desa
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition hover:shadow-lg"
          >
            <FaPlus /> Tambah Berita
          </button>
        )}
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100 space-y-5 max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <FaEdit className="text-green-600" />
                  <span>Edit Berita</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-green-600" />
                  <span>Tambah Berita</span>
                </>
              )}
            </h2>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaNewspaper size={14} />
              <span>Judul</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul berita"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaNewspaper size={14} />
              <span>Konten</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-32 focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi berita di sini"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaImage size={14} />
              <span>Unggah gambar</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <FaImage className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500 text-center">
                    Klik untuk memilih gambar atau drag & drop
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
                news.find((b) => b.id === editingId)?.featured_image)) && (
              <div className="mt-2">
                <img
                  src={
                    featuredImage
                      ? URL.createObjectURL(featuredImage)
                      : `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                          news.find((b) => b.id === editingId)?.featured_image
                        }`
                  }
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status publish
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
                <FaCheck /> Yes
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
                <FaTimes /> No
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              <FaTimes className="inline mr-2" />
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition flex items-center gap-2"
            >
              {editingId ? (
                <>
                  <FaSave /> Ubah Berita
                </>
              ) : (
                <>
                  <FaPlus /> Simpan Berita
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* LIST BERITA */}
      {news.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto max-w-md">
            <FaNewspaper className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Belum ada berita
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Mulai tambahkan berita baru untuk menginformasikan kepada warga
              desa
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Tambah Berita
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      item.featured_image
                    }`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.is_published ? "Published" : "Unpublished"}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                    {Helper.truncateText(item.content)}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <FaCalendarAlt size={12} />
                    <span>{Helper.formatTanggal(item.created_at)}</span>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
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
