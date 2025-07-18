import { useState } from "react";
import { FaTimes, FaSave, FaImage } from "react-icons/fa";

export default function ModalBeritaForm({ onClose, onSave }) {
  const [judul, setJudul] = useState("");
  const [gambar, setGambar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ judul, gambar });
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

        <h2 className="text-xl font-bold mb-4">Tambah Berita</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Judul</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">URL Gambar</label>
            <div className="flex items-center gap-2">
              <FaImage className="text-gray-500" />
              <input
                type="text"
                placeholder="https://source.unsplash.com/300x200/?village"
                className="w-full p-2 border rounded mt-1"
                value={gambar}
                onChange={(e) => setGambar(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FaSave /> Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
