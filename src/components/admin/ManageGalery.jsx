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
import { Helper } from "@/utils/Helper";

export default function ManageGalery() {
  const { i18n } = useTranslation();
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

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin menyimpan perubahan?"))) return;

      const response = await GaleryApi.updateGaleri(
        editingId,
        { title, image },
        i18n.language
      );
      const body = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }

      setGaleries((prev) =>
        prev.map((g) => (g.id === editingId ? body.galeri : g))
      );
      await alertSuccess("Galeri berhasil diperbarui.");
      resetForm();
      return;
    }

    const response = await GaleryApi.createGaleri(
      { title, image },
      i18n.language
    );
    const body = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(body);
      return;
    }

    setGaleries([body.galeri, ...galeries]);
    await alertSuccess("Galeri berhasil ditambahkan.");
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin ingin menghapus foto ini?"))) return;

    const response = await GaleryApi.deleteGaleri(id, i18n.language);
    if (!response.ok) {
      const body = await response.json();
      await Helper.errorResponseHandler(body);
      return;
    }

    setGaleries((prev) => prev.filter((g) => g.id !== id));
    await alertSuccess("Galeri berhasil dihapus.");
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
      await Helper.errorResponseHandler(body);
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
            <FaImage className="text-green-500" />
            Kelola Galeri
          </h1>
          <p className="text-gray-600 mt-1">Kelola Foto Desa</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md transition transform"
          >
            <FaPlus /> Tambah Foto
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
              {editingId ? "Edit Galeri" : "Tambah Galeri"}
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
                Judul Foto
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul foto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unggah Gambar
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
                      alt="Preview"
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
              className="flex items-center gap-2 bg-gradient-to-r bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md transition transform "
            >
              <FaSave /> {editingId ? "Ubah Galeri" : "Simpan Galeri"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl transition"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* LIST GALERI */}
      {galeries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Belum Ada Galeri
          </h3>
          <p className="text-gray-500 mb-4">
            {showForm
              ? "Silakan lengkapi form di atas untuk menambahkan galeri."
              : "Belum ada foto"}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <FaPlus /> Tambah Foto
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
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-green-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(galeri.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
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
