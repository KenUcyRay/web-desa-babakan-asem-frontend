import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { alertSuccess } from "../../libs/alert";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { Helper } from "../../utils/Helper";

export default function ManageSuratPengantar() {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 5;

  // Function to get full letter type name
  const getFullLetterTypeName = (type) => {
    const typeNames = {
      KTP: "Kartu Tanda Penduduk",
      KK: "Kartu Keluarga", 
      SKCK: "Surat Keterangan Catatan Kepolisian",
      PERPINDAHAN_PENDUDUK: "Perpindahan Penduduk",
      LAINNYA: "Lainnya"
    };
    return typeNames[type] || type;
  };

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
    setIsLoading(true);
    const response = await AdministrasiApi.updatePengantar(
      item.id,
      i18n.language
    );
    const responseBody = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      setIsLoading(false);
      return;
    }
    const updatedData = data.map((d) =>
      d.id === item.id ? { ...d, status: "diterima" } : d
    );
    setData(updatedData);
    alertSuccess("Surat pengantar berhasil diterima.");

    setIsLoading(false);
  };

  // Fetch data surat pengantar
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AdministrasiApi.getPengantar(
        "?size=1000",
        i18n.language
      );
      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      setData(
        responseData.data.map((item) => ({
          id: item.id,
          nama: item.name || "-",
          nik: item.nik || "-",
          phone: item.phone || item.phoneNumber || "-",
          jenis: item.type || "-",
          keterangan: item.keterangan || "-",
          created_at: item.createdAt,
          status: item.is_pending ? "pending" : "diterima",
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  // SVG Icons
  const DocumentIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const FilterIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
      />
    </svg>
  );

  const CheckIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const ClockIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ChevronDownIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const LoadingSpinner = ({ className }) => (
    <svg
      className={`${className} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      ></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      ></path>
    </svg>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-20"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DocumentIcon className="w-6 h-6 text-white" />
                </div>
                Kelola Administrasi
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola permohonan surat pengantar administrasi desa dengan mudah
                dan cepat.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                      Total surat pengantar
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {data.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <DocumentIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide">
                      Pending
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {data.filter((item) => item.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                      Diterima
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {data.filter((item) => item.status === "diterima").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <FilterIcon className="w-5 h-5 text-white" />
                </div>
                <label className="text-gray-700 font-semibold text-lg">
                  Filter Status:
                </label>
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none px-6 py-3 pr-10 rounded-xl border border-gray-200 focus:ring-4 focus:ring-green-100 focus:border-green-400 bg-gradient-to-r from-white to-green-50/30 font-medium transition-all duration-300 cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="diterima">Diterima</option>
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <LoadingSpinner className="w-8 h-8 text-green-600" />
                <span className="text-gray-600 font-medium">
                  Memuat data...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && (
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="p-4 text-left font-semibold min-w-[180px]">
                        Nama Pemohon
                      </th>
                      <th className="p-4 text-left font-semibold min-w-[120px]">NIK</th>
                      <th className="p-4 text-left font-semibold min-w-[110px]">Telepon</th>
                      <th className="p-4 text-left font-semibold min-w-[140px]">
                        Jenis Surat
                      </th>
                      <th className="p-4 text-left font-semibold min-w-[130px]">
                        Tanggal
                      </th>
                      <th className="p-4 text-center font-semibold min-w-[100px]">Status</th>
                      <th className="p-4 text-center font-semibold min-w-[100px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        <tr
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-300 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                          onClick={() => toggleExpand(idx)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {item.nama.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-800 truncate">
                                {item.nama}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 font-mono text-sm">
                            {item.nik || "-"}
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {item.phone || "-"}
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap" title={getFullLetterTypeName(item.jenis)}>
                              {item.jenis === "PERPINDAHAN_PENDUDUK" ? "Perpindahan" : item.jenis}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                item.status === "pending"
                                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                                  : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                              }`}
                            >
                              {item.status === "pending" ? (
                                <>
                                  <ClockIcon className="w-3 h-3" />
                                  Pending
                                </>
                              ) : (
                                <>
                                  <CheckIcon className="w-3 h-3" />
                                  Diterima
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {item.status === "pending" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTerima(idx);
                                }}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-1 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                              >
                                <span className="flex items-center gap-1">
                                  <CheckIcon className="w-3 h-3" />
                                  Terima
                                </span>
                              </button>
                            )}
                          </td>
                        </tr>

                        {expandedRow === idx && (
                          <tr>
                            <td colSpan={7}>
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-l-4 border-green-400">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                      Detail NIK:
                                    </p>
                                    <p className="text-gray-800 font-mono">
                                      {item.nik || "-"}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                      Nomor Telepon:
                                    </p>
                                    <p className="text-gray-800">
                                      {item.phone || "-"}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                      Detail Jenis Surat:
                                    </p>
                                    <p className="text-gray-800">
                                      {getFullLetterTypeName(item.jenis)}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                      Keterangan:
                                    </p>
                                    <p className="text-gray-800">
                                      {item.keterangan || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center p-12">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <DocumentIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">
                              Tidak ada data surat pengantar yang ditemukan.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && (
          <div className="md:hidden space-y-4">
            {currentData.map((item, idx) => (
              <div key={item.id} className="group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {item.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.nama}
                          </h3>
                          <p className="text-sm text-gray-500">
                            NIK: {item.nik || "-"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Telepon: {item.phone || "-"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-semibold ${
                          item.status === "pending"
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                        }`}
                      >
                        {item.status === "pending" ? (
                          <>
                            <ClockIcon className="w-3 h-3" />
                            Pending
                          </>
                        ) : (
                          <>
                            <CheckIcon className="w-3 h-3" />
                            Diterima
                          </>
                        )}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-800 mb-1">
                          Jenis Surat
                        </p>
                        <p className="text-blue-700">{item.jenis}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Tanggal Pengajuan:
                        </p>
                        <p className="text-gray-600 text-sm">
                          {new Date(item.created_at).toLocaleString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {item.keterangan && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-green-800 mb-1">
                            Keterangan:
                          </p>
                          <p className="text-green-700 text-sm">
                            {item.keterangan}
                          </p>
                        </div>
                      )}
                    </div>

                    {item.status === "pending" && (
                      <button
                        onClick={() => handleTerima(idx)}
                        disabled={isLoading}
                        className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <CheckIcon className="w-5 h-5" />
                          Terima Surat
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Tidak ada data surat pengantar yang ditemukan.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > perPage && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={perPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="fixed bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-lime-400/20 to-green-400/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="fixed top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
}
