import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

// Helper untuk mengambil image url
const getImageUrl = (filename) => {
  if (!filename) return "";
  // Jika sudah full url, balikin langsung
  if (filename.startsWith("http")) return filename;
  return `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${filename}`;
};

export default function ManagePrestasi() {
  const { t } = useTranslation();
  const [prestasi, setPrestasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(true); // Default publikasi aktif
  const [date, setDate] = useState("");
  const [imageError, setImageError] = useState("");

  // Fetch prestasi dari API
  const fetchPrestasi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/village-achievements?page=${currentPage}&per_page=${itemsPerPage}`,
        {
          credentials: "include",
        }
      );
      const json = await response.json();

      // Set data
      setPrestasi(json.data || []);

      // Set pagination info
      if (json.meta) {
        setTotalPages(Math.ceil(json.meta.total / itemsPerPage) || 1);
      } else {
        setTotalPages(Math.ceil((json.data || []).length / itemsPerPage) || 1);
      }
    } catch (err) {
      alertError("Gagal mengambil data prestasi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestasi();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setIsPublished(true); // Default publikasi aktif
    setEditingId(null);
    setDate("");
    setImageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !date) {
      alertError("Title, Deskripsi, dan Tanggal wajib diisi!");
      return;
    }

    const isEdit = Boolean(editingId);

    // Validasi gambar wajib saat membuat baru, opsional saat edit
    if (!isEdit && !featuredImage) {
      setImageError("Gambar wajib diupload saat membuat prestasi baru!");
      return;
    } else {
      setImageError("");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);
    formData.append("date", date);
    formData.append(
      "featured_image",
      featuredImage ? featuredImage : undefined
    );

    try {
      if (isEdit) {
        if (
          !(await alertConfirm(
            t(
              "managePrestasi.confirmation.editPrestasi",
              "Yakin ingin mengubah prestasi ini?"
            )
          ))
        )
          return;

        await fetch(
          `${
            import.meta.env.VITE_NEW_BASE_URL
          }/admin/village-achievements/${editingId}`,
          {
            method: "PATCH",
            body: formData,
            credentials: "include",
          }
        );

        await alertSuccess(
          t(
            "managePrestasi.success.updatePrestasi",
            "Prestasi berhasil diperbarui!"
          )
        );
      } else {
        await fetch(
          `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-achievements`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        await alertSuccess(
          t(
            "managePrestasi.success.addPrestasi",
            "Prestasi berhasil ditambahkan!"
          )
        );
      }
      resetForm();
      setShowForm(false);
      fetchPrestasi();
    } catch (error) {
      console.error("Error:", error);
      alertError(
        isEdit ? "Gagal memperbarui prestasi." : "Gagal menambahkan prestasi."
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      await alertConfirm(
        t(
          "managePrestasi.confirmation.deletePrestasi",
          "Yakin ingin menghapus prestasi ini?"
        )
      )
    ) {
      try {
        await fetch(
          `${
            import.meta.env.VITE_NEW_BASE_URL
          }/admin/village-achievements/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        await alertSuccess(
          t(
            "managePrestasi.success.deletePrestasi",
            "Prestasi berhasil dihapus!"
          )
        );
        fetchPrestasi();
      } catch {
        alertError("Gagal menghapus prestasi.");
      }
    }
  };

  const handleEdit = (id) => {
    const item = prestasi.find((p) => p.id === id);
    if (!item) return;
    setTitle(item.title);
    setContent(item.description);
    setIsPublished(item.is_published || false);
    setDate(item.date ? item.date.split("T")[0] : ""); // Format YYYY-MM-DD
    setEditingId(id);
    setImageError("");
    setShowForm(true);
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          {t("managePrestasi.title", "Manajemen Prestasi")}
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus />
            {t("managePrestasi.buttons.addPrestasi", "Tambah Prestasi")}
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
              {t("managePrestasi.form.prestasiTitle", "Judul Prestasi")}
            </label>
            <input
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul prestasi"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("managePrestasi.form.content", "Deskripsi")}
            </label>
            <textarea
              className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-green-300 outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan deskripsi prestasi"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("managePrestasi.form.date", "Tanggal")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              {t("managePrestasi.form.uploadMainImage", "Gambar Utama")}
              {!editingId && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFeaturedImage(e.target.files[0]);
                if (e.target.files[0]) setImageError("");
              }}
              className={`w-full border p-2 rounded ${
                imageError ? "border-red-500" : ""
              }`}
            />
            {imageError && (
              <p className="text-red-500 text-sm mt-1">{imageError}</p>
            )}
            {(featuredImage ||
              (editingId &&
                prestasi.find((p) => p.id === editingId)?.featured_image)) && (
              <img
                src={
                  featuredImage
                    ? URL.createObjectURL(featuredImage)
                    : getImageUrl(
                        prestasi.find((p) => p.id === editingId)?.featured_image
                      )
                }
                alt={t("managePrestasi.preview", "Pratinjau")}
                className="mt-3 w-40 rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              <FaSave />
              {editingId
                ? t("managePrestasi.buttons.updatePrestasi", "Simpan Perubahan")
                : t("managePrestasi.buttons.savePrestasi", "Simpan Prestasi")}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <FaTimes /> {t("managePrestasi.buttons.cancel", "Batal")}
            </button>
          </div>
        </form>
      )}

      {/* LIST PRESTASI */}
      {isLoading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestasi.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Belum ada data prestasi
            </div>
          ) : (
            prestasi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
              >
                <img
                  src={getImageUrl(item.featured_image)}
                  alt={item.title}
                  className="rounded-t-xl w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/640x360?text=Tidak+Ada+Gambar";
                  }}
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                    {Helper.truncateText
                      ? Helper.truncateText(item.description)
                      : item.description}
                  </p>

                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    {Helper.formatTanggal
                      ? Helper.formatTanggal(item.created_at)
                      : item.created_at}
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                    >
                      <FaEdit /> {t("managePrestasi.buttons.edit", "Edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                    >
                      <FaTrash /> {t("managePrestasi.buttons.delete", "Hapus")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PAGINATION */}
      {prestasi.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
