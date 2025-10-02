import React, { useState, useRef, useEffect } from "react";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { getAuthHeaders } from "../../libs/api/authHelpers";
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaCheck,
  FaClock,
  FaTimesCircle,
  FaSave,
} from "react-icons/fa";

// Helper untuk format rupiah
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

// Helper untuk style status
const getStatusStyle = (status) => {
  switch (status) {
    case "SELESAI":
    case "COMPLETED":
      return { color: "text-green-700", bg: "bg-green-100", icon: <FaCheck /> };
    case "DALAM PENGERJAAN":
      return {
        color: "text-yellow-700",
        bg: "bg-yellow-100",
        icon: <FaClock />,
      };
    case "DIBATALKAN":
    case "CANCELLED":
      return {
        color: "text-red-700",
        bg: "bg-red-100",
        icon: <FaTimesCircle />,
      };
    case "DIRENCANAKAN":
      return {
        color: "text-blue-700",
        bg: "bg-blue-100",
        icon: <FaCalendarAlt />,
      };
    default:
      return { color: "text-gray-700", bg: "bg-gray-100", icon: null };
  }
};

// Helper untuk mendapatkan nilai status dari backend ke frontend
const mapStatusFromApi = (apiStatus) => {
  const statusMap = {
    COMPLETED: "SELESAI",
    CANCELLED: "DIBATALKAN",
    PLANNED: "DIRENCANAKAN",
    IN_PROGRESS: "DALAM PENGERJAAN",
  };

  return statusMap[apiStatus] || apiStatus;
};

// Helper untuk mengirim status ke backend
const mapStatusToApi = (uiStatus) => {
  const statusMap = {
    SELESAI: "COMPLETED",
    DIBATALKAN: "CANCELLED",
    DIRENCANAKAN: "PLANNED",
    "DALAM PENGERJAAN": "IN_PROGRESS",
  };

  return statusMap[uiStatus] || uiStatus;
};

// Helper untuk mendapatkan status yang diterjemahkan
const getTranslatedStatus = (status) => {
  switch (status) {
    case "DIRENCANAKAN":
      return "Direncanakan";
    case "DALAM PENGERJAAN":
      return "Dalam Pengerjaan";
    case "SELESAI":
      return "Selesai";
    case "DIBATALKAN":
      return "Dibatalkan";
    default:
      return status;
  }
};

const ManageProgram = () => {
  const [programKerja, setProgramKerja] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProgram, setNewProgram] = useState({
    nama: "",
    tanggal: "",
    budget: "",
    status: "DIRENCANAKAN",
    justifikasi: "",
  });

  const formRef = useRef(null);

  // Fetch program kerja dari API
  const fetchProgramKerja = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs`,
        {
          headers: getAuthHeaders("id")
        }
      );

      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        setLoading(false);
        return;
      }

      const data = await response.json();
      // Transform API data ke format UI

      const transformedData = (data || []).map((program) => ({
        id: program.id,
        nama: program.description,
        tanggal: program.date ? program.date.split("T")[0] : "",
        budget: program.budget_amount || 0,
        status: mapStatusFromApi(program.status),
        justifikasi: program.justification || "",
      }));

      setProgramKerja(transformedData);
    } catch (error) {
      await Helper.errorResponseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramKerja();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const resetForm = () => {
    setNewProgram({
      nama: "",
      tanggal: "",
      budget: "",
      status: "DIRENCANAKAN",
      justifikasi: "",
    });
    setEditingId(null);
  };

  const handleEdit = (id) => {
    const program = programKerja.find((p) => p.id === id);
    if (!program) return;

    setNewProgram({
      nama: program.nama,
      tanggal: program.tanggal,
      budget: String(program.budget),
      status: program.status,
      justifikasi: program.justifikasi || "",
    });

    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await alertConfirm(
      "Apakah anda yakin ingin menghapus program ini?"
    );
    if (!confirmed) return;

    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-work-programs/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders("id")
      }
    );

    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    setProgramKerja(programKerja.filter((p) => p.id !== id));
    await alertSuccess("Program kerja berhasil dihapus");
  };

  const handleSubmit = async () => {
    const payload = {
      description: newProgram.nama,
      date: newProgram.tanggal,
      budget_amount: parseInt(newProgram.budget),
      status: mapStatusToApi(newProgram.status),
      justification: newProgram.justifikasi || newProgram.nama,
    };

    let response;

    if (editingId) {
      // Update existing program
      response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/admin/village-work-programs/${editingId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders("id"),
          body: JSON.stringify(payload),
        }
      );
    } else {
      // Create new program
      response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-work-programs`,
        {
          method: "POST",
          headers: getAuthHeaders("id"),
          body: JSON.stringify(payload),
        }
      );
    }

    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    // Refresh data after successful operation
    await fetchProgramKerja();
    resetForm();
    setShowForm(false);
    await alertSuccess(
      editingId ? "Program berhasil diperbarui" : "Program berhasil ditambahkan"
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 flex items-center gap-2 md:gap-3">
              <FaCalendarAlt className="text-emerald-600" />
              Program Kerja Desa
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Kelola program dan kegiatan desa
            </p>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FaPlus /> Tambah Program
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div
            id={editingId ? `edit-program-form-${editingId}` : "create-program-form"}
            ref={formRef}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8"
          >
            <div className="flex justify-between items-center mb-3 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {editingId ? "Edit Program Kerja" : "Tambah Program Kerja"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nama Program
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Program Kerja"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={newProgram.nama}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, nama: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition cursor-pointer"
                    value={newProgram.tanggal}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, tanggal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-2 sm:top-3 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Budget"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      value={newProgram.budget}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, budget: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={newProgram.status}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, status: e.target.value })
                    }
                  >
                    <option value="DIRENCANAKAN">Direncanakan</option>
                    <option value="DALAM PENGERJAAN">Dalam Pengerjaan</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DIBATALKAN">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Keterangan Program
                </label>
                <textarea
                  placeholder="Keterangan program kerja"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={newProgram.justifikasi}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      justifikasi: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md transition order-1 sm:order-none cursor-pointer"
              >
                <FaSave />
                {editingId ? "Update Program Kerja" : "Simpan Program Kerja"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl transition cursor-pointer"
              >
                <FaTimes /> Batal
              </button>
            </div>
          </div>
        )}

        {/* Program List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-full mb-3 md:mb-4"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <div className="text-red-500">
              <FaTimesCircle className="text-3xl md:text-4xl mx-auto mb-2 md:mb-3" />
              <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">
                Error Memuat Data
              </h3>
              <p className="text-sm md:text-base">{error}</p>
            </div>
          </div>
        ) : programKerja.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <FaCalendarAlt className="text-3xl md:text-4xl text-gray-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2">
              Belum Ada Program
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-3 sm:mb-4">
              {showForm
                ? "Silakan lengkapi form di atas untuk menambahkan program"
                : "Tidak ada program kerja yang tersedia saat ini."}
            </p>
            {!showForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition w-full sm:w-auto cursor-pointer"
              >
                <FaPlus /> Tambah Program
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Desktop table - hidden on mobile */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programKerja.map((item, index) => {
                    const style = getStatusStyle(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.nama}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaCalendarAlt className="text-emerald-500" />
                            {new Date(item.tanggal).toLocaleDateString("id-ID")}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatRupiah(item.budget)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.color}`}
                          >
                            {style.icon}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <a
                              href={`#edit-program-form-${item.id}`}
                              onClick={() => handleEdit(item.id)}
                              className="text-blue-600 hover:text-blue-900 transition cursor-pointer"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </a>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 transition cursor-pointer"
                              title="Hapus"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            {/* <div className="sm:hidden space-y-3 p-3">
              {programKerja.map((item, index) => {
                const style = getStatusStyle(item.status);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {item.nama}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.color}`}
                      >
                        {style.icon} {getTranslatedStatus(item.status, t)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                      <div>
                        <div className="text-gray-500 uppercase mb-1">
                          Tanggal
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-emerald-500" />
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 uppercase mb-1">
                          Budget
                        </div>
                        <div className="font-medium">
                          {formatRupiah(item.budget)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2 mt-2 flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Hapus"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProgram;
