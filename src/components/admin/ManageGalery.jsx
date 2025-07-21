import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import Pagination from "../ui/Pagination";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManageGalery() {
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
      return alertError("Lengkapi judul & pilih gambar!");
    }

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit foto ini?"))) return;

      const response = await GaleryApi.updateGaleri(editingId, { title, image });
      const body = await response.json();

      if (!response.ok) {
        alertError(typeof body.error === "string" ? body.error : "Gagal menyimpan perubahan.");
        return;
      }

      setGaleries((prev) => prev.map((g) => (g.id === editingId ? body.galeri : g)));
      await alertSuccess("Foto berhasil diperbarui!");
      resetForm();
      return;
    }

    const response = await GaleryApi.createGaleri({ title, image });
    const body = await response.json();

    if (!response.ok) {
      alertError(typeof body.error === "string" ? body.error : "Gagal menyimpan foto.");
      return;
    }

    setGaleries([body.galeri, ...galeries]);
    await alertSuccess("Foto berhasil ditambahkan!");
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin hapus foto ini?"))) return;

    const response = await GaleryApi.deleteGaleri(id);
    if (!response.ok) {
      const body = await response.json();
      alertError(typeof body.error === "string" ? body.error : "Gagal menghapus foto.");
      return;
    }

    setGaleries((prev) => prev.filter((g) => g.id !== id));
    await alertSuccess("Foto berhasil dihapus!");
  };

  const handleEdit = (id) => {
    const galeri = galeries.find((g) => g.id === id);
    if (!galeri) return;
    setEditingId(galeri.id);
    setTitle(galeri.title);
    setImage(null); // supaya bisa upload ulang kalau mau
    setShowForm(true);
  };

  const fetchGaleries = async () => {
    const response = await GaleryApi.getGaleri(currentPage, 9);
    const body = await response.json();

    if (!response.ok) {
      alertError(typeof body.error === "string" ? body.error : "Gagal mengambil data.");
      return;
    }

    setGaleries(body.galeri);
    setTotalPages(body.total_page);
    setCurrentPage(body.page);
  };

  useEffect(() => {
    fetchGaleries();
  }, [currentPage]);

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Kelola Galeri</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus /> Tambah Foto
          </button>
        )}
      </div>

      {/* FORM TAMBAH/EDIT FOTO */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Judul Foto
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul foto"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {(image || (editingId && galeries.find((b) => b.id === editingId)?.image)) && (
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : `${import.meta.env.VITE_BASE_URL}/galeri/images/${
                        galeries.find((b) => b.id === editingId)?.image
                      }`
                }
                alt="preview"
                className="mt-3 w-full h-40 object-cover rounded-lg shadow-sm"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              <FaSave /> {editingId ? "Update Foto" : "Simpan Foto"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* LIST GALERI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeries.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada foto</p>
        ) : (
          galeries.map((galeri) => (
            <div
              key={galeri.id}
              className="bg-white rounded-xl shadow-md border hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${galeri.image}`}
                alt={galeri.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {galeri.title}
                </h3>
                <div className="flex justify-between mt-4 text-sm">
                  <button
                    onClick={() => handleEdit(galeri.id)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(galeri.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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
