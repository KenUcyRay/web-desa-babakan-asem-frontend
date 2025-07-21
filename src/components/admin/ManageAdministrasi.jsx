import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";
// import { AdminApi } from "../../libs/api/AdminApi";

export default function ManageAdministrasi() {
  const [layanan, setLayanan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Ambil semua data layanan
  const fetchLayanan = async () => {
    try {
      const res = await AdminApi.getAllLayanan();
      if (!res.ok) return;
      const data = await res.json();
      setLayanan(data);
    } catch (err) {
      console.error("Gagal ambil data layanan:", err);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = layanan.slice(indexOfFirst, indexOfLast);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📋 Permohonan Layanan & Surat
        </h1>

        {/* ✅ Tabel Data */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Kontak</th>
                <th className="p-4">Jenis Form</th>
                <th className="p-4">Layanan / Surat</th>
                <th className="p-4">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {item.nama}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.email || item.nomor || item.nik || "-"}
                  </td>
                  <td className="p-4 text-gray-700">{item.jenis_form}</td>
                  <td className="p-4 text-gray-700">
                    {item.layanan || item.jenisSurat || "-"}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {layanan.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Belum ada pengajuan layanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination */}
        {layanan.length > perPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={layanan.length}
              itemsPerPage={perPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
