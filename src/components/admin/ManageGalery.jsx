import { use, useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "../ui/Pagination"; // ✅ pakai komponen Pagination kamu
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
  const handleSave = async () => {
    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit Galeri ini?"))) {
        return;
      }

      const response = await GaleryApi.updateGaleri(editingId, {
        title,
        image,
      });
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
      resetForm();

      setGaleries((prev) =>
        prev.map((g) => (g.id === editingId ? responseBody.galeri : g))
      );

      await alertSuccess("Produk berhasil diperbarui!");
      return;
    }
    if (!title || !image) return alertError("Lengkapi judul & pilih gambar!");

    const response = await GaleryApi.createGaleri({ title, image });
    const responseBody = await response.json();

    if (response.ok) {
      await alertSuccess("Galleri berhasil ditambahkan!");
      setGaleries([responseBody.galeri, ...galeries]);
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
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin hapus foto ini?"))) {
      return;
    }

    const response = await GaleryApi.deleteGaleri(id);
    if (!response.ok) {
      const responseBody = await response.json();

      let errorMessage = "Gagal menghapus";

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
    }

    await alertSuccess("Foto berhasil dihapus!");
    setGaleries((prev) => prev.filter((g) => g.id !== id));
  };

  const handleEdit = (id) => {
    const galeri = galeries.find((g) => g.id === id);
    if (!galeri) return;
    setEditingId(galeri.id);
    setTitle(galeri.title);
    setImage(null); // Reset image to allow re-upload
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const fetchGaleries = async () => {
    const response = await GaleryApi.getGaleri(currentPage, 9);
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
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    setGaleries(responseBody.galeri);
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
  };

  useEffect(() => {
    fetchGaleries();
  }, [currentPage]);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Galeri Desa</h1>

        {/* ✅ Tombol filter kategori */}
        <div className="flex flex-wrap gap-2 mb-4">
          {kategoriList.map((k) => (
            <button
              key={k}
              className={`px-4 py-2 rounded transition ${
                kategoriFilter === k
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => {
                setKategoriFilter(k);
                setPage(1); // reset ke halaman pertama
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Tombol Tambah */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
          >
            <FaPlus /> Tambah Foto
          </button>
        )}

        {/* Form Tambah/Edit */}
        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Foto" : "Tambah Foto"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Judul Foto</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm">Upload Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                {(image ||
                  (editingId &&
                    galeries.find((b) => b.id === editingId)?.image)) && (
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : galeries.find((b) => b.id === editingId)?.image
                    }
                    alt="preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>

              {/* ✅ Pilih kategori */}
              <div>
                <label className="block text-sm">Kategori</label>
                <select
                  className="w-full border p-2 rounded"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Pemerintah">Pemerintah</option>
                  <option value="PKK">PKK</option>
                  <option value="Karang Taruna">Karang Taruna</option>
                  <option value="DPD">DPD</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Simpan
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* List Foto */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galeries.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada foto</p>
          ) : (
            galeries.map((galeri) => (
              <div
                key={galeri.id}
                className="bg-white rounded shadow overflow-hidden flex flex-col"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${
                    galeri.image
                  }`}
                  alt={galeri.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <h3 className="font-semibold text-lg">{galeri.title}</h3>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => handleEdit(galeri.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(galeri.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FaTrash /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Pagination */}
        {filteredGaleries.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
