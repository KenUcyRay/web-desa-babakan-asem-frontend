import { useState } from "react";
import { FaTimes, FaSave, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

export default function ModalAgendaForm({ onClose, onSave }) {
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ judul, tanggal, lokasi });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Tambah Agenda</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Judul Agenda</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal</label>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="w-full p-2 border rounded mt-1"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Lokasi</label>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaSave /> Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
