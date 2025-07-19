import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { NewsApi } from "../../libs/api/NewsApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Pagination from "../ui/Pagination"; // ✅ pastikan path benar

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = {
      title,
      content,
      is_published: isPublished,
      featured_image: featuredImage,
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit berita ini?"))) {
        return;
      }

      const response = await NewsApi.updateNews(editingId, rawData);
      const responseBody = await response.json();

      if (!response.ok) {
        let errorMessage = "Gagal menyimpan perubahan.";

        if (responseBody.error && Array.isArray(responseBody.error)) {
          const errorMessages = responseBody.error.map((err) => {
            if (err.path && err.path.length > 0) {
              return `${err.path[0]}: ${err.message}`;
            }
            return err.message;
          });
          errorMessage = errorMessages.join(", ");
        } else if (
          responseBody.error &&
          typeof responseBody.error === "string"
        ) {
          errorMessage = responseBody.error;
        }
        await alertError(errorMessage);
        return;
      }

      setTitle("");
      setContent("");
      setFeaturedImage(null);
      setIsPublished(false);
      setEditingId(null);
      setShowForm(false);
      await alertSuccess("Berita berhasil diperbarui!");
      return;
    }

    const response = await NewsApi.createNews(rawData);
    const responseBody = await response.json();

    if (response.ok) {
      await alertSuccess("Berita berhasil ditambahkan!");
      setNews([...news, responseBody.news]);
    } else {
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
    }

    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
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

  const handleEdit = async (id) => {
    const berita = news.find((b) => b.id === id);
    if (!berita) return;

    setTitle(berita.title);
    setContent(berita.content);
    setFeaturedImage(null);
    setIsPublished(berita.isPublished);
    setEditingId(id);
    setShowForm(true);
  };

  const fetchNews = async () => {
    const response = await NewsApi.getOwnNews(1, 6);

    if (!response.ok) {
      alertError("Gagal mengambil berita. Silakan coba lagi.");
      setLoading(false);
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

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Berita</h1>

          {/* ✅ Tombol hanya muncul kalau form belum dibuka */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ➕ Tambah Berita
            </button>
          )}
        </div>

        {/* ✅ FORM TAMBAH / EDIT */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-medium">Judul</label>
              <input
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Konten</label>
              <textarea
                className="w-full border p-2 rounded h-28"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan isi berita..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Upload Gambar Utama</label>
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
                  className="mt-2 w-40 rounded"
                />
              )}
            </div>

            {/* ✅ Published Yes/No */}
            <div>
              <label className="block font-medium mb-1">Published?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`px-4 py-2 rounded ${
                    isPublished
                      ? "bg-green-500 text-white shadow"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`px-4 py-2 rounded ${
                    !isPublished
                      ? "bg-red-500 text-white shadow"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                {editingId ? "✅ Update Berita" : "💾 Simpan Berita"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setFeaturedImage(null);
                  setIsPublished(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST BERITA (hanya untuk halaman ini) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/news/images/${
                  item.featured_image
                }`}
                alt={item.title}
                className="rounded-t-xl w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {Helper.truncateText(item.content)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  📅 {Helper.formatTanggal(item.created_at)}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    item.is_published ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.is_published ? "Published ✅" : "Unpublished ❌"}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination selalu muncul meski sedikit berita */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages} // minimal 1
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
