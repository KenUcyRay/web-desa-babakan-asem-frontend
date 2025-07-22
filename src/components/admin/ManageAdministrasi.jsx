import React, { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { alertError, alertSuccess } from "../../libs/alert";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { Helper } from "../../utils/Helper";

export default function ManageAdministrasi() {
  const [layanan, setLayanan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKategori, setFilterKategori] = useState("Form Online");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedRow, setExpandedRow] = useState(null);
  const perPage = 5;

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

  const handleTerima = async (idx) => {
    const updated = [...layanan];
    const item = currentData[idx];
    const itemIndex = layanan.findIndex((i) => i.id === item.id);
    let response;

    if (item.jenis_form === "Form Online") {
      response = await AdministrasiApi.updateOnline(item.id);
    } else if (item.jenis_form === "Formulir Layanan") {
      response = await AdministrasiApi.updateLayanan(item.id);
    } else if (item.jenis_form === "Surat Pengantar") {
      response = await AdministrasiApi.updatePengantar(item.id);
    }

    if (response && response.ok) {
      if (itemIndex !== -1) {
        updated[itemIndex].status = "diterima";
        await alertSuccess("Status berhasil diperbarui.");
        setLayanan(updated);
      }
    } else {
      alertError("Gagal memperbarui status.");
    }
  };

  const fecthOnline = async () => {
    const response = await AdministrasiApi.getOnline();
    if (!response.ok) {
      alertError("Gagal mengambil data online.");
      return [];
    }

    const responseBody = await response.json();
    return responseBody.data.map((item) => ({
      id: item.id,
      nama: item.name,
      email: item.email,
      nomor: item.phone,
      jenis_form: "Form Online",
      layanan: Helper.formatText(item.type),
      created_at: item.createdAt,
      status: item.is_pending ? "pending" : "diterima",
    }));
  };

  const fetchLayanan = async () => {
    const response = await AdministrasiApi.getLayanan();
    if (!response.ok) {
      alertError("Gagal mengambil data layanan.");
      return [];
    }

    const responseBody = await response.json();
    return responseBody.data.map((item) => ({
      id: item.id,
      nama: item.name,
      email: item.email,
      jenis_form: "Formulir Layanan",
      layanan: Helper.formatText(item.type),
      created_at: item.createdAt,
      status: item.is_pending ? "pending" : "diterima",
      pesan: item.message || "",
    }));
  };

  const fetchPengantar = async () => {
    const response = await AdministrasiApi.getPengantar();
    if (!response.ok) {
      alertError("Gagal mengambil data pengantar.");
      return [];
    }

    const responseBody = await response.json();
    return responseBody.data.map((item) => ({
      id: item.id,
      nama: item.name,
      nik: item.nik,
      jenis_form: "Surat Pengantar",
      layanan: Helper.formatText(item.type),
      keterangan: item.description,
      created_at: item.createdAt,
      status: item.is_pending ? "pending" : "diterima",
    }));
  };

  const fetchData = async () => {
    const [online, layanan, pengantar] = await Promise.all([
      fecthOnline(),
      fetchLayanan(),
      fetchPengantar(),
    ]);

    const allData = [...online, ...layanan, ...pengantar];
    setLayanan(allData);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      {/* ✅ Desktop: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-x-auto">
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
                <React.Fragment key={item.id}>
                  <tr
                    key={item.id}
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
                              <span className="font-medium">
                                📝 Keterangan:
                              </span>{" "}
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
                </React.Fragment>
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

      {/* ✅ Mobile: Card List */}
      <div className="md:hidden grid gap-4">
        {currentData.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow space-y-2 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{item.nama}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.status === "pending" ? "⏳ Pending" : "✅ Diterima"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              📧 {item.email || item.nomor || item.nik || "-"}
            </p>
            <p className="text-sm text-gray-700">
              📄 {item.layanan || item.jenisSurat || "-"}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleString("id-ID")}
            </p>

            {/* Detail tambahan */}
            {item.keterangan && (
              <p className="text-sm text-gray-700">
                📝 <span className="font-medium">Keterangan:</span>{" "}
                {item.keterangan}
              </p>
            )}
            {item.pesan && (
              <p className="text-sm text-gray-700">
                💬 <span className="font-medium">Pesan:</span> {item.pesan}
              </p>
            )}

            {/* Tombol terima */}
            {item.status === "pending" && (
              <button
                onClick={() => handleTerima(idx)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                ✅ Terima
              </button>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <p className="text-center text-gray-500">Tidak ada pengajuan.</p>
        )}
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
