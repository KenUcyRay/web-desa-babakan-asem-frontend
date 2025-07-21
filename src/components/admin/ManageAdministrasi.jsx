import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";

export default function ManageAdministrasi() {
  const [layanan, setLayanan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKategori, setFilterKategori] = useState("all");
  const [expandedRow, setExpandedRow] = useState(null); // ✅ track baris yang dibuka
  const perPage = 5;

  // ✅ Dummy data
  const dummyData = [
    {
      nama: "Budi Santoso",
      email: "budi@mail.com",
      nomor: "08123456789",
      jenis_form: "Form Online",
      layanan: "Tracking Surat",
      created_at: "2025-07-21T09:00:00",
    },
    {
      nama: "Siti Aminah",
      email: "siti@mail.com",
      jenis_form: "Formulir Layanan",
      layanan: "Pengaduan",
      created_at: "2025-07-20T10:30:00",
    },
    {
      nama: "Andi Pratama",
      nik: "3276012345678901",
      jenis_form: "Surat Pengantar",
      jenisSurat: "Surat Pengantar SKCK",
      keterangan: "Perlu untuk melamar kerja",
      created_at: "2025-07-19T14:15:00",
    },
    {
      nama: "Dewi Lestari",
      email: "dewi@mail.com",
      nomor: "08567890123",
      jenis_form: "Form Online",
      layanan: "Buat Permohonan",
      created_at: "2025-07-18T16:45:00",
    },
    {
      nama: "Ahmad Fauzi",
      email: "ahmad@mail.com",
      jenis_form: "Formulir Layanan",
      layanan: "Permohonan",
      pesan: "Mohon segera diproses sebelum minggu depan.",
      created_at: "2025-07-17T11:20:00",
    },
  ];

  useEffect(() => {
    setLayanan(dummyData);
  }, []);

  // ✅ Filter kategori
  const filteredData =
    filterKategori === "all"
      ? layanan
      : layanan.filter((item) => item.jenis_form === filterKategori);

  // ✅ Pagination logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  // ✅ Toggle expand row
  const toggleExpand = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📋 Permohonan Layanan & Surat
        </h1>

        {/* ✅ Tombol Filter */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {[
            { key: "all", label: "Semua" },
            { key: "Form Online", label: "Form Online" },
            { key: "Formulir Layanan", label: "Formulir Layanan" },
            { key: "Surat Pengantar", label: "Surat Pengantar" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setFilterKategori(btn.key);
                setCurrentPage(1);
                setExpandedRow(null); // tutup detail kalau ganti filter
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                filterKategori === btn.key
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ✅ Tabel */}
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
              {currentData.map((item, idx) => {
                const isExpanded = expandedRow === idx;

                return (
                  <>
                    {/* ✅ Baris utama */}
                    <tr
                      key={idx}
                      className="border-b hover:bg-green-50 cursor-pointer"
                      onClick={() => toggleExpand(idx)}
                    >
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
                        {new Date(item.created_at).toLocaleString("id-ID")}
                      </td>
                    </tr>

                    {/* ✅ Detail dropdown */}
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-4">
                          <div className="text-sm text-gray-700 space-y-1">
                            {item.email && (
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {item.email}
                              </p>
                            )}
                            {item.nomor && (
                              <p>
                                <span className="font-medium">No. HP:</span>{" "}
                                {item.nomor}
                              </p>
                            )}
                            {item.nik && (
                              <p>
                                <span className="font-medium">NIK:</span>{" "}
                                {item.nik}
                              </p>
                            )}
                            {item.keterangan && (
                              <p>
                                <span className="font-medium">Keterangan:</span>{" "}
                                {item.keterangan}
                              </p>
                            )}
                            {item.pesan && (
                              <p>
                                <span className="font-medium">Pesan:</span>{" "}
                                {item.pesan}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}

              {filteredData.length === 0 && (
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
        {filteredData.length > perPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredData.length}
              itemsPerPage={perPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                setExpandedRow(null); // tutup detail kalau ganti halaman
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
