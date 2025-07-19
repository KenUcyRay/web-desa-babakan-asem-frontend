import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination"; 

export default function ManageAnggota() {
  const [anggota, setAnggota] = useState([
    {
      id: 1,
      foto: "https://via.placeholder.com/150",
      nama: "Siti Aminah",
      jabatan: "Ketua PKK",
      masaJabatan: "2023 - 2028",
      type: "PKK",
    },
    {
      id: 2,
      foto: "https://via.placeholder.com/150",
      nama: "Budi Santoso",
      jabatan: "Ketua Karang Taruna",
      masaJabatan: "2022 - 2027",
      type: "Karang Taruna",
    },
    {
      id: 3,
      foto: "https://via.placeholder.com/150",
      nama: "Dewi Lestari",
      jabatan: "Sekretaris BPD",
      masaJabatan: "2024 - 2029",
      type: "BPD",
    },
    {
      id: 4,
      foto: "https://via.placeholder.com/150",
      nama: "Ahmad Zaki",
      jabatan: "Kepala Desa",
      masaJabatan: "2023 - 2029",
      type: "Pemerintahan",
    },
    {
      id: 5,
      foto: "https://via.placeholder.com/150",
      nama: "Rina Marlina",
      jabatan: "Bendahara PKK",
      masaJabatan: "2023 - 2028",
      type: "PKK",
    },
    {
      id: 6,
      foto: "https://via.placeholder.com/150",
      nama: "Fajar Nugraha",
      jabatan: "Wakil Karang Taruna",
      masaJabatan: "2022 - 2027",
      type: "Karang Taruna",
    },
    {
      id: 7,
      foto: "https://via.placeholder.com/150",
      nama: "Yuni Safitri",
      jabatan: "Anggota BPD",
      masaJabatan: "2024 - 2029",
      type: "BPD",
    },
  ]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus anggota ini?");
    if (!confirmDelete) return;
    setAnggota(anggota.filter((a) => a.id !== id));
    window.alert("✅ Anggota berhasil dihapus (dummy)");
  };

  const handleEdit = (id) => {
    window.alert(`✏️ Dummy edit anggota dengan ID: ${id}`);
  };

  const handleAdd = () => {
    window.alert("➕ Dummy tambah anggota (nanti pakai modal form)");
  };

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ Kategori filter (mirip filter pesan)
  const [kategori, setKategori] = useState("Semua");

  const kategoriList = ["Semua", "PKK", "Karang Taruna", "BPD", "Pemerintahan"];

  // ✅ Filter data sesuai kategori
  const filteredAnggota =
    kategori === "Semua"
      ? anggota
      : anggota.filter((a) => a.type === kategori);

  // ✅ Pagination setelah difilter
  const totalPages = Math.ceil(filteredAnggota.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAnggota.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="md:ml-64 flex-1 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Struktur Organisasi</h1>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Tambah Anggota
          </button>
        </div>

        {/* ✅ Filter kategori style tombol horizontal mirip ManagePesan */}
        <div className="flex flex-wrap gap-2 mb-4">
          {kategoriList.map((k) => (
            <button
              key={k}
              className={`px-4 py-2 rounded transition ${
                kategori === k
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => {
                setKategori(k);
                setCurrentPage(1); // reset halaman ke 1
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* ✅ Grid anggota */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={a.foto}
                alt={a.nama}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-1">
                <h2 className="text-lg font-bold">{a.nama}</h2>
                <p className="text-sm text-gray-600">{a.jabatan}</p>
                <p className="text-xs text-gray-500">
                  Masa Jabatan: <b>{a.masaJabatan}</b>
                </p>
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {a.type}
                </span>
              </div>

              <div className="flex justify-between p-4 border-t text-sm">
                <button
                  onClick={() => handleEdit(a.id)}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Jika kosong */}
        {filteredAnggota.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            Tidak ada anggota untuk kategori ini.
          </p>
        )}

        {/* ✅ Pagination */}
        {filteredAnggota.length > 0 && (
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
