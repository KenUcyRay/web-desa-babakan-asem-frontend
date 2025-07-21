import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { NewsApi } from "../../libs/api/NewsApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Pagination from "../ui/Pagination";
import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash, FaCheck, FaTimesCircle } from "react-icons/fa";

export default function ManageBerita() {
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
    const response = await NewsApi.getOwnNews(1, 6);
    if (!response.ok) {
      alertError("Gagal mengambil berita. Silakan coba lagi.");
      return;
    }
    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setNews(responseBody.news);
  };

  useEffect(() => {
    fetchNews();
  }, [showForm, currentPage]);

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

      const response = await NewsApi.updateNews(editingId, rawData);
      const responseBody = await response.json();
      if (!response.ok) {
        let errorMessage = Helper.parseError(responseBody);
        await alertError(errorMessage);
        return;
      }

      resetForm();
      setShowForm(false);
      await alertSuccess("Berita berhasil diperbarui!");
      fetchNews();
      return;
    }

    const response = await NewsApi.createNews(rawData);
    const responseBody = await response.json();

    if (response.ok) {
      await alertSuccess("Berita berhasil ditambahkan!");
      fetchNews();
    } else {
      let errorMessage = Helper.parseError(responseBody);
      alertError(errorMessage);
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (await alertConfirm("Yakin hapus berita ini?")) {
      const response = await NewsApi.deleteNews(id);
      if (!response.ok) {
        const responseBody = await response.json();
        alertError(
          `Gagal menghapus berita. Silakan coba lagi nanti. ${responseBody.error}`
        );
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
    <div className="flex font-[Poppins,sans-serif]">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Kelola Berita</h1>

          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
            >
              <FaPlus /> Tambah Berita
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
                Judul
              </label>
              <input
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Konten
              </label>
              <textarea
                className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-green-300 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan isi berita..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Upload Gambar Utama
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
                  alt="preview"
                  className="mt-3 w-40 rounded-lg shadow-sm"
                />
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Status Publish
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
                  <FaCheck /> Yes
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
                  <FaTimes /> No
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                <FaSave /> {editingId ? "Update Berita" : "Simpan Berita"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                <FaTimes /> Batal
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
                src={`${import.meta.env.VITE_BASE_URL}/news/images/${item.featured_image}`}
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
                      <FaCheck /> Published
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      <FaTimesCircle /> Unpublished
                    </span>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                  >
                    <FaTrash /> Hapus
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
    </div>
  );
}
