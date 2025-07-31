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

// Dummy data for prestasi
const initialPrestasi = [
  {
    id: 1,
    title: "Prestasi A",
    content: "Deskripsi prestasi A yang luar biasa.",
    featured_image: "https://via.placeholder.com/150",
    created_at: new Date().toISOString(),
    is_published: true,
  },
  {
    id: 2,
    title: "Prestasi B",
    content: "Deskripsi prestasi B yang luar biasa.",
    featured_image: "https://via.placeholder.com/150",
    created_at: new Date().toISOString(),
    is_published: false,
  },
  // Tambah data dummy lainnya sesuai kebutuhan
];

export default function ManagePrestasi() {
  const { t } = useTranslation();
  const [prestasi, setPrestasi] = useState(initialPrestasi);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(prestasi.length / itemsPerPage);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  // Paginated data
  const paginatedPrestasi = prestasi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setIsPublished(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      if (!(await alertConfirm(t("managePrestasi.confirmation.editPrestasi")))) return;
      // Update locally
      setPrestasi((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                content,
                featured_image: featuredImage
                  ? URL.createObjectURL(featuredImage)
                  : item.featured_image,
                is_published: isPublished,
              }
            : item
        )
      );
      resetForm();
      setShowForm(false);
      await alertSuccess(t("managePrestasi.success.updatePrestasi"));
      return;
    }

    // Add new dummy
    const newItem = {
      id: Date.now(),
      title,
      content,
      featured_image: featuredImage
        ? URL.createObjectURL(featuredImage)
        : "https://via.placeholder.com/150",
      created_at: new Date().toISOString(),
      is_published: isPublished,
    };
    setPrestasi((prev) => [newItem, ...prev]);
    await alertSuccess(t("managePrestasi.success.addPrestasi"));
    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (await alertConfirm(t("managePrestasi.confirmation.deletePrestasi"))) {
      setPrestasi((prev) => prev.filter((p) => p.id !== id));
      await alertSuccess(t("managePrestasi.success.deletePrestasi"));
    }
  };

  const handleEdit = (id) => {
    const item = prestasi.find((p) => p.id === id);
    if (!item) return;
    setTitle(item.title);
    setContent(item.content);
    setIsPublished(item.is_published);
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          {t("managePrestasi.title")}
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus /> {t("managePrestasi.buttons.addPrestasi")}
          </button>
        )}
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
        >
          {/* title, content, image, status, buttons as before */}
          {/* ... reuse form JSX from original with minor adjustments ... */}
          {/* For brevity, insert the form code here as in the example above */}
        </form>
      )}

      {/* LIST PRESTASI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPrestasi.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <img
              src={item.featured_image}
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
                    <FaCheck /> {t("managePrestasi.status.published")}
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <FaTimesCircle /> {t("managePrestasi.status.unpublished")}
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                >
                  <FaEdit /> {t("managePrestasi.buttons.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                >
                  <FaTrash /> {t("managePrestasi.buttons.delete")}
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
