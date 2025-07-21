import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";

export default function ManageAdministrasi() {
  const [layanan, setLayanan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKategori, setFilterKategori] = useState("Form Online");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedRow, setExpandedRow] = useState(null);
  const perPage = 5;

  const dummyData = [
    {
      nama: "Budi Santoso",
      email: "budi@mail.com",
      nomor: "08123456789",
      jenis_form: "Form Online",
      layanan: "Tracking Surat",
      created_at: "2025-07-21T09:00:00",
      status: "pending",
    },
    {
      nama: "Siti Aminah",
      email: "siti@mail.com",
      jenis_form: "Formulir Layanan",
      layanan: "Pengaduan",
      created_at: "2025-07-20T10:30:00",
      status: "pending",
    },
    {
      nama: "Andi Pratama",
      nik: "3276012345678901",
      jenis_form: "Surat Pengantar",
      jenisSurat: "Surat Pengantar SKCK",
      keterangan: "Perlu untuk melamar kerja",
      created_at: "2025-07-19T14:15:00",
      status: "diterima",
    },
    {
      nama: "Dewi Lestari",
      email: "dewi@mail.com",
      nomor: "08567890123",
      jenis_form: "Form Online",
      layanan: "Buat Permohonan",
      created_at: "2025-07-18T16:45:00",
      status: "pending",
    },
    {
      nama: "Ahmad Fauzi",
      email: "ahmad@mail.com",
      jenis_form: "Formulir Layanan",
      layanan: "Permohonan",
      pesan: "Mohon segera diproses sebelum minggu depan.",
      created_at: "2025-07-17T11:20:00",
      status: "diterima",
    },
  ];

  useEffect(() => {
    setLayanan(dummyData);
  }, []);

  const filteredData = layanan.filter((item) => {
    const matchKategori = item.jenis_form === filterKategori;
    const matchStatus =
      filterStatus === "Semua" ? true : item.status === filterStatus;
    return matchKategori && matchStatus;
  });

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const toggleExpand = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  const handleTerima = (idx) => {
    const updated = [...layanan];
    const itemIndex = layanan.findIndex(
      (item) =>
        item.nama === currentData[idx].nama &&
        item.created_at === currentData[idx].created_at
    );
    if (itemIndex !== -1) {
      updated[itemIndex].status = "diterima";
      setLayanan(updated);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        📋 Permohonan Layanan & Surat
      </h1>

      {/* ✅ Filter kategori */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "Form Online", label: "Form Online" },
          { key: "Formulir Layanan", label: "Formulir Layanan" },
          { key: "Surat Pengantar", label: "Surat Pengantar" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => {
              setFilterKategori(btn.key);
              setCurrentPage(1);
              setExpandedRow(null);
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
              filterKategori === btn.key
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ✅ Filter status */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-gray-700 font-medium">Filter Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
            setExpandedRow(null);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-green-400 transition w-full sm:w-auto"
        >
          <option value="Semua">Semua</option>
          <option value="pending">Pending</option>
          <option value="diterima">Sudah Diterima</option>
        </select>
      </div>

      {/* ✅ Table scrollable di HP */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-3 sm:p-4">Nama</th>
              <th className="p-3 sm:p-4">Kontak</th>
              <th className="p-3 sm:p-4">Layanan / Surat</th>
              <th className="p-3 sm:p-4">Waktu</th>
              <th className="p-3 sm:p-4 text-center">Status</th>
              <th className="p-3 sm:p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => {
              const isExpanded = expandedRow === idx;
              return (
                <>
                  <tr
                    key={idx}
                    className={`border-b transition hover:bg-green-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } cursor-pointer`}
                    onClick={() => toggleExpand(idx)}
                  >
                    <td className="p-3 sm:p-4 font-medium text-gray-800">
                      {item.nama}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-600">
                      {item.email || item.nomor || item.nik || "-"}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-700">
                      {item.layanan || item.jenisSurat || "-"}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      {item.status === "pending" ? (
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                          ⏳ Pending
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                          ✅ Sudah Diterima
                        </span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      {item.status === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTerima(idx);
                          }}
                          className="px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow transition"
                        >
                          Terima
                        </button>
                      )}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="p-4 bg-green-50">
                        <div className="text-xs sm:text-sm text-gray-700 grid gap-1">
                          {item.email && (
                            <p>
                              <span className="font-medium">📧 Email:</span>{" "}
                              {item.email}
                            </p>
                          )}
                          {item.nomor && (
                            <p>
                              <span className="font-medium">📱 No. HP:</span>{" "}
                              {item.nomor}
                            </p>
                          )}
                          {item.nik && (
                            <p>
                              <span className="font-medium">🆔 NIK:</span>{" "}
                              {item.nik}
                            </p>
                          )}
                          {item.keterangan && (
                            <p>
                              <span className="font-medium">📝 Keterangan:</span>{" "}
                              {item.keterangan}
                            </p>
                          )}
                          {item.pesan && (
                            <p>
                              <span className="font-medium">💬 Pesan:</span>{" "}
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
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Tidak ada pengajuan sesuai filter.
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
              setExpandedRow(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
