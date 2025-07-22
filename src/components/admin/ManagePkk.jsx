import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import Pagination from "../ui/Pagination";
import { ProgramApi } from "../../libs/api/ProgramApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManagePkk() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !desc || (!image && !editingId)) {
      return alertError("Lengkapi semua data sebelum simpan!");
    }

    if (editingId) {
      if (!(await alertConfirm("Yakin simpan perubahan ini?"))) return;

      const rawData = {
        title,
        description: desc,
        featured_image: image,
      };
      const response = await ProgramApi.updateProgram(editingId, rawData);
      const body = await response.json();

      if (!response.ok) {
        alertError(typeof body.error === "string" ? body.error : "Gagal menyimpan perubahan.");
        return;
      }

      setPrograms((prev) =>
        prev.map((p) => (p.id === editingId ? body.program : p))
      );

      await alertSuccess("Program berhasil diperbarui!");
    } else {
      const rawData = {
        title,
        description: desc,
        featured_image: image,
      };

      const response = await ProgramApi.createProgram(rawData);
      const body = await response.json();

      if (!response.ok) {
        alertError(typeof body.error === "string" ? body.error : "Gagal menyimpan program.");
        return;
      }

      setPrograms([body.program, ...programs]);
      await alertSuccess("Program berhasil ditambahkan!");
    }

    resetForm();
  };

  const handleEdit = (id) => {
    const program = programs.find((p) => p.id === id);
    if (!program) return;
    setEditingId(program.id);
    setTitle(program.title);
    setDesc(program.description);
    setImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin hapus program ini?"))) return;

    const response = await ProgramApi.deleteProgram(id);
    if (!response.ok) {
      await alertError("Gagal menghapus program");
      return;
    }

    setPrograms((prev) => prev.filter((p) => p.id !== id));
    await alertSuccess("Program berhasil dihapus!");
  };

  const fetchPrograms = async () => {
    const response = await ProgramApi.getPrograms(currentPage, 9);
    const body = await response.json();

    if (!response.ok) {
      await alertError("Gagal mengambil data program");
      return;
    }

    setTotalPages(body.total_page);
    setCurrentPage(body.page);
    setPrograms(body.programs);
  };

  useEffect(() => {
    fetchPrograms();
  }, [currentPage]);

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Kelola Program PKK</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus /> Tambah Program
          </button>
        )}
      </div>

      {/* FORM TAMBAH/EDIT */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
        >
          {/* Nama Program */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nama Program</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan nama program"
              required
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {(image || (editingId && programs.find((p) => p.id === editingId)?.featured_image)) && (
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : `${import.meta.env.VITE_BASE_URL}/programs/images/${
                        programs.find((p) => p.id === editingId)?.featured_image
                      }`
                }
                alt="preview"
                className="mt-3 w-full h-40 object-cover rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tuliskan deskripsi program..."
              required
            />
          </div>

          {/* Tombol Simpan/Batal */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              <FaSave /> {editingId ? "Update Program" : "Simpan Program"}
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

      {/* LIST PROGRAM */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada program</p>
        ) : (
          programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl shadow-md border hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/programs/images/${program.featured_image}`}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {program.description}
                </p>
                <div className="flex justify-between mt-4 text-sm">
                  <button
                    onClick={() => handleEdit(program.id)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
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
