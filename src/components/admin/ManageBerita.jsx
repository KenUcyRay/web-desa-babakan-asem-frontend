import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import ModalBeritaForm from "./ModalBeritaForm";

export default function ManageBerita() {
  const [berita, setBerita] = useState([
    {
      id: 1,
      judul: "Pembangunan Jalan Desa",
      gambar: "https://source.unsplash.com/300x200/?village",
    },
    {
      id: 2,
      judul: "Gotong Royong Bersama",
      gambar: "https://source.unsplash.com/300x200/?community",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus berita ini?")) {
      setBerita(berita.filter((b) => b.id !== id));
    }
  };

  const handleAdd = (newData) => {
    setBerita([...berita, { id: Date.now(), ...newData }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Berita</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FaPlus /> Tambah Berita
          </button>
        </div>

        {/* Grid Berita */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {berita.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow hover:shadow-lg">
              <img src={b.gambar} alt={b.judul} className="rounded-t-xl w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{b.judul}</h2>
                <div className="flex justify-between mt-4">
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <ModalBeritaForm
            onClose={() => setIsModalOpen(false)}
            onSave={handleAdd}
          />
        )}
      </div>
    </div>
  );
}
