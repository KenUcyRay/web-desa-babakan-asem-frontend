import React, { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { alertError, alertSuccess } from "../../libs/alert";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { Helper } from "../../utils/Helper";

export default function ManageSuratPengantar() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedRow, setExpandedRow] = useState(null);
  const perPage = 5;

  // Filter data berdasarkan status
  const filteredData = data.filter((item) => 
    filterStatus === "Semua" ? true : item.status === filterStatus
  );

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  // Toggle expand row
  const toggleExpand = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  // Handle terima surat
  const handleTerima = async (idx) => {
    const item = currentData[idx];
    const response = await AdministrasiApi.updatePengantar(item.id);

    if (response?.ok) {
      const updatedData = data.map(d => 
        d.id === item.id ? { ...d, status: "diterima" } : d
      );
      setData(updatedData);
      alertSuccess("Surat pengantar berhasil diterima");
    } else {
      alertError("Gagal menerima surat");
    }
  };

  // Fetch data surat pengantar
  const fetchData = async () => {
    const response = await AdministrasiApi.getPengantar();
    if (!response.ok) return alertError("Gagal mengambil data");

    const responseData = await response.json();
    setData(responseData.data.map(item => ({
      id: item.id,
      nama: item.name,
      nik: item.nik,
      jenis: Helper.formatText(item.type),
      keterangan: item.keterangan,
      created_at: item.createdAt,
      status: item.is_pending ? "pending" : "diterima"
    })));
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        📋 Manajemen Surat Pengantar
      </h1>

      {/* Filter Status */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <label className="text-gray-700 font-medium">Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"
        >
          <option value="Semua">Semua</option>
          <option value="pending">Pending</option>
          <option value="diterima">Diterima</option>
        </select>
      </div>

      {/* Tabel Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4">Nama</th>
              <th className="p-4">NIK</th>
              <th className="p-4">Jenis Surat</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => (
              <React.Fragment key={item.id}>
                <tr 
                  className={`border-b hover:bg-green-50 cursor-pointer ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                  onClick={() => toggleExpand(idx)}
                >
                  <td className="p-4 font-medium">{item.nama}</td>
                  <td className="p-4">{item.nik || "-"}</td>
                  <td className="p-4">{item.jenis}</td>
                  <td className="p-4 text-sm">
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "pending" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {item.status === "pending" ? "⏳ Pending" : "✓ Diterima"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {item.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTerima(idx);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Terima
                      </button>
                    )}
                  </td>
                </tr>

                {expandedRow === idx && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-green-50">
                      <div className="grid gap-2 text-sm">
                        <p><b>NIK:</b> {item.nik || "-"}</p>
                        <p><b>Keterangan:</b> {item.keterangan || "-"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  Tidak ada data surat pengantar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Mobile */}
      <div className="md:hidden space-y-4">
        {currentData.map((item, idx) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between">
              <h3 className="font-bold">{item.nama}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === "pending" 
                  ? "bg-yellow-100 text-yellow-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {item.status === "pending" ? "⏳ Pending" : "✓ Diterima"}
              </span>
            </div>
            <p className="text-sm mt-2"><b>NIK:</b> {item.nik || "-"}</p>
            <p className="text-sm"><b>Jenis:</b> {item.jenis}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.created_at).toLocaleString("id-ID")}
            </p>

            {item.keterangan && (
              <p className="text-sm mt-2"><b>Keterangan:</b> {item.keterangan}</p>
            )}

            {item.status === "pending" && (
              <button
                onClick={() => handleTerima(idx)}
                className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg"
              >
                Terima Surat
              </button>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 py-4">Tidak ada data</p>
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > perPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            itemsPerPage={perPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}