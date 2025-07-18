import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import ModalAgendaForm from "./ModalAgendaForm";

export default function ManageAgenda() {
  const [agenda, setAgenda] = useState([
    {
      id: 1,
      judul: "Musyawarah Desa",
      tanggal: "2025-07-20",
      lokasi: "Balai Desa",
    },
    {
      id: 2,
      judul: "Gotong Royong Bersama",
      tanggal: "2025-07-25",
      lokasi: "Lapangan Desa",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus agenda ini?")) {
      setAgenda(agenda.filter((a) => a.id !== id));
    }
  };

  const handleAdd = (newData) => {
    setAgenda([...agenda, { id: Date.now(), ...newData }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Agenda</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaPlus /> Tambah Agenda
          </button>
        </div>

        {/* List Agenda */}
        <div className="space-y-4">
          {agenda.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{a.judul}</h2>
                <p className="text-gray-600 text-sm">
                  📅 {a.tanggal} | 📍 {a.lokasi}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <ModalAgendaForm
            onClose={() => setIsModalOpen(false)}
            onSave={handleAdd}
          />
        )}
      </div>
    </div>
  );
}
