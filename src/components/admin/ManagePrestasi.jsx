import { useEffect, useState } from "react";
import { alertConfirm, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { getAuthHeaders, getAuthHeadersFormData } from "../../libs/api/authHelpers";
import Pagination from "../ui/Pagination";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
  FaTrophy,
} from "react-icons/fa";

const getImageUrl = (filename) => {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  return `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${filename}`;
};

export default function ManagePrestasi() {
  const [prestasi, setPrestasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [date, setDate] = useState("");
  const [imageError, setImageError] = useState("");

  const fetchPrestasi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/village-achievements?page=${currentPage}&per_page=${itemsPerPage}`,
        {
          headers: getAuthHeaders("id")
        }
      );
      const json = await response.json();
      setPrestasi(json.data || []);
      if (json.meta) {
        setTotalPages(Math.ceil(json.meta.total / itemsPerPage) || 1);
      } else {
        setTotalPages(Math.ceil((json.data || []).length / itemsPerPage) || 1);
      }
    } catch (err) {
      Helper.errorResponseHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasi();
  }, [currentPage]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setEditingId(null);
    setDate("");
    setImageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);
    formData.append("date", date);
    if (featuredImage) formData.append("featured_image", featuredImage);
    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengubah prestasi ini?"))) return;

      const response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/admin/village-achievements/${editingId}`,
        {
          method: "PATCH",
          headers: getAuthHeadersFormData("id"),
          body: formData,
        }
      );
      if (!response.ok) {
        Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Prestasi berhasil diperbarui");
    } else {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-achievements`,
        {
          method: "POST",
          headers: getAuthHeadersFormData("id"),
          body: formData,
        }
      );
      if (!response.ok) {
        Helper.errorResponseHandler(await response.json());
        return;
      }
      await alertSuccess("Prestasi berhasil ditambahkan");
    }
    resetForm();
    setShowForm(false);
    fetchPrestasi();
  };

  const handleDelete = async (id) => {
    if (await alertConfirm("Yakin ingin menghapus prestasi ini?")) {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-achievements/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders("id")
        }
      );
      if (!response.ok) {
        Helper.errorResponseHandler(await response.json());
        return;
      }

      await alertSuccess("Prestasi berhasil dihapus");
      fetchPrestasi();
    }
  };

  const handleEdit = (id) => {
    const item = prestasi.find((p) => p.id === id);
    if (!item) return;
    setTitle(item.title);
    setContent(item.description);
    setDate(item.date ? item.date.split("T")[0] : "");
    setEditingId(id);
    setImageError("");
    setShowForm(true);
  };

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Kelola Prestasi
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola prestasi dan penghargaan desa
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-5 py-2.5 rounded-lg shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <FaPlus />
            Tambah Prestasi
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && (
        <form
          id={editingId ? `edit-prestasi-form-${editingId}` : "create-prestasi-form"}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? "Edit Prestasi" : "Tambah Prestasi"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Prestasi
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul prestasi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Masukkan deskripsi prestasi"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Prestasi
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar
                  {!editingId && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setFeaturedImage(e.target.files[0]);
                      if (e.target.files[0]) setImageError("");
                    }}
                    className={`w-full mb-3 ${
                      imageError ? "border-red-500" : ""
                    }`}
                  />
                  {imageError && (
                    <p className="text-red-500 text-sm mt-1">{imageError}</p>
                  )}
                  {(featuredImage ||
                    (editingId &&
                      prestasi.find((p) => p.id === editingId)
                        ?.featured_image)) && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={
                          featuredImage
                            ? URL.createObjectURL(featuredImage)
                            : getImageUrl(
                                prestasi.find((p) => p.id === editingId)
                                  ?.featured_image
                              )
                        }
                        alt="Preview"
                        className="max-w-full h-48 rounded-lg object-contain border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-5 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FaSave />
              {editingId ? "Simpan Perubahan" : "Simpan Prestasi "}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl transition cursor-pointer"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* LIST PRESTASI */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : prestasi.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaTrophy className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Belum Ada Prestasi
          </h3>
          <p className="text-gray-500 mb-4">
            {showForm
              ? "Silakan lengkapi form di atas untuk menambahkan prestasi"
              : "Klik tombol 'Tambah Prestasi' untuk mulai menambahkan prestasi"}
          </p>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-5 py-2.5 rounded-lg shadow-md transition cursor-pointer"
            >
              <FaPlus /> Tambah Prestasi
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestasi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(item.featured_image)}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mt-2">
                    {Helper.truncateText
                      ? Helper.truncateText(item.description)
                      : item.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    {Helper.formatTanggal
                      ? Helper.formatTanggal(item.created_at)
                      : item.created_at}
                  </div>
                  <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                    <a
                      href={`#edit-prestasi-form-${item.id}`}
                      onClick={() => handleEdit(item.id)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <FaEdit size={14} /> Edit
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <FaTrash size={14} /> Hapus
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
