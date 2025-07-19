import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "../ui/Pagination"; // ✅ pakai komponen Pagination kamu

export default function ManageGalery() {
  const [galeries, setGaleries] = useState([
    { id: 1, title: "Kegiatan Gotong Royong", image: "https://picsum.photos/400/250?random=1" },
    { id: 2, title: "Perayaan HUT Desa", image: "https://picsum.photos/400/250?random=2" },
    { id: 3, title: "Panen Raya Bersama", image: "https://picsum.photos/400/250?random=3" },
    { id: 4, title: "Bakti Sosial", image: "https://picsum.photos/400/250?random=4" },
    { id: 5, title: "Festival Desa", image: "https://picsum.photos/400/250?random=5" },
    { id: 6, title: "Pelatihan Warga", image: "https://picsum.photos/400/250?random=6" },
    { id: 7, title: "Kegiatan Rutin PKK", image: "https://picsum.photos/400/250?random=7" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", image: "" });

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // tampilkan 6 per halaman

  // ✅ Hitung total halaman
  const totalPages = Math.ceil(galeries.length / itemsPerPage);

  // ✅ Data yang ditampilkan hanya per halaman
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedGaleries = galeries.slice(startIndex, startIndex + itemsPerPage);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title || !form.image) return alert("Lengkapi judul & pilih gambar!");
    if (form.id) {
      setGaleries((prev) => prev.map((g) => (g.id === form.id ? { ...form } : g)));
    } else {
      setGaleries((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm("Yakin hapus foto ini?")) {
      setGaleries((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleEdit = (g) => {
    setForm(g);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ id: null, title: "", image: "" });
    setShowForm(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Galeri Desa</h1>

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
            <h2 className="text-lg font-semibold mb-3">{form.id ? "Edit Foto" : "Tambah Foto"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Judul Foto</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm">Upload Gambar</label>
                <input type="file" accept="image/*" className="w-full border p-2 rounded" onChange={handleImageUpload} />
                {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Simpan</button>
              <button onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        {/* List Foto */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedGaleries.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada foto</p>
          ) : (
            paginatedGaleries.map((g) => (
              <div key={g.id} className="bg-white rounded shadow overflow-hidden flex flex-col">
                <img src={g.image} alt={g.title} className="w-full h-48 object-cover" />
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <h3 className="font-semibold text-lg">{g.title}</h3>
                  <div className="flex justify-between mt-3">
                    <button onClick={() => handleEdit(g)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                      <FaTrash /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Pagination */}
        {galeries.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
