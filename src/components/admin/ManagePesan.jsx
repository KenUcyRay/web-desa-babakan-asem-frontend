import { useState } from "react";
import { FaTrash, FaEnvelopeOpen } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function ManagePesan() {
  const [pesan, setPesan] = useState([
    {
      id: 1,
      nama: "Budi",
      email: "budi@mail.com",
      isi: "Bagaimana cara mengurus surat pengantar?",
    },
    {
      id: 2,
      nama: "Siti",
      email: "siti@mail.com",
      isi: "Apakah ada program bantuan bulan ini?",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus pesan ini?")) {
      setPesan(pesan.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Kelola Pesan Masuk</h1>

        <div className="space-y-4">
          {pesan.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{p.nama}</h2>
                <p className="text-sm text-gray-500">{p.email}</p>
                <p className="mt-2 text-gray-700">{p.isi}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className="flex items-center gap-1 text-green-500 hover:text-green-700">
                  <FaEnvelopeOpen /> Tandai Dibaca
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
