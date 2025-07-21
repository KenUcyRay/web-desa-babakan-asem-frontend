import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
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

  const handleSave = async () => {
    if (editingId) {
      if (!(await alertConfirm("Yakin simpan perubahan ini?"))) {
        return;
      }
      const rawData = {
        title: title ?? null,
        description: desc ?? null,
        featured_image: image ?? null,
      };
      const response = await ProgramApi.updateProgram(editingId, rawData);
      const responseBody = await response.json();
      if (!response.ok) {
        let errorMessage = "Gagal menyimpan perubahan.";
        if (responseBody.error && Array.isArray(responseBody.error)) {
          const errorMessages = responseBody.error.map((err) =>
            err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
          );
          errorMessage = errorMessages.join(", ");
        } else if (typeof responseBody.error === "string") {
          errorMessage = responseBody.error;
        }
        alertError(errorMessage);
        return;
      }

      setPrograms((prev) =>
        prev.map((p) => (p.id === editingId ? responseBody.program : p))
      );

      await alertSuccess("Program berhasil diperbarui!");
    } else {
      if (!title || !desc || !image)
        return await alertError("Lengkapi semua data!");
      const rawData = {
        title: title,
        description: desc,
        featured_image: image,
      };

      const response = await ProgramApi.createProgram(rawData);
      const responseBody = await response.json();
      if (!response.ok) {
        let errorMessage = "Gagal menyimpan perubahan.";
        if (responseBody.error && Array.isArray(responseBody.error)) {
          const errorMessages = responseBody.error.map((err) =>
            err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
          );
          errorMessage = errorMessages.join(", ");
        } else if (typeof responseBody.error === "string") {
          errorMessage = responseBody.error;
        }
        alertError(errorMessage);
        return;
      }
      setPrograms([responseBody.program, ...programs]);
      await alertSuccess("Program berhasil disimpan!");
    }
    resetForm();
  };

  const handleEdit = (id) => {
    const program = programs.find((p) => p.id === id);
    if (!program) return;
    setEditingId(program.id);
    setTitle(program.title);
    setDesc(program.description);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Yakin hapus program ini?"))) {
      return;
    }
    const response = await ProgramApi.deleteProgram(id);
    if (!response.ok) {
      await alertError("Gagal menghapus program");
      return;
    }
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  const fetchPrograms = async () => {
    const response = await ProgramApi.getPrograms(currentPage, 9);
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data program");
      return;
    }
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setPrograms(responseBody.programs);
  };

  useEffect(() => {
    fetchPrograms();
  }, [currentPage]);
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Program Pokok PKK</h1>

        {/* Tombol Tambah */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
          >
            <FaPlus /> Tambah Program
          </button>
        )}

        {/* Form Tambah/Edit */}
        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Program" : "Tambah Program"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nama Program</label>
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
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {(image ||
                  (editingId &&
                    programs.find((b) => b.id === editingId)?.image)) && (
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : programs.find((b) => b.id === editingId)?.image
                    }
                    alt="preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm">Deskripsi</label>
                <textarea
                  rows={3}
                  className="w-full border p-2 rounded"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
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

        {/* List Program */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada program</p>
          ) : (
            programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded shadow overflow-hidden flex flex-col"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/programs/images/${
                    program.featured_image
                  }`}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <h3 className="font-semibold text-lg text-green-700">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => handleEdit(program.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
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

        {/* Pagination */}
        {/* {programs.length > perPage && ( */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
