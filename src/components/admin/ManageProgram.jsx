import React, { useState, useRef, useEffect } from "react";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
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
    case "DALAM_PENGERJAAN":
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
    IN_PROGRESS: "DALAM_PENGERJAAN",
  };

  return statusMap[apiStatus] || apiStatus;
};

// Helper untuk mengirim status ke backend
const mapStatusToApi = (uiStatus) => {
  const statusMap = {
    SELESAI: "COMPLETED",
    DIBATALKAN: "CANCELLED",
    DIRENCANAKAN: "PLANNED",
    DALAM_PENGERJAAN: "IN_PROGRESS",
  };

  return statusMap[uiStatus] || uiStatus;
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
        `${import.meta.env.VITE_NEW_BASE_URL}/village-work-programs`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
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
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      alertError("Gagal memuat data program kerja");
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

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_NEW_BASE_URL
        }/admin/village-work-programs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || '"token"'
            )}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setProgramKerja(programKerja.filter((p) => p.id !== id));
      await alertSuccess("Program kerja berhasil dihapus");
    } catch (err) {
      console.error("Error deleting program:", err);
      alertError("Gagal menghapus program kerja");
    }
  };

  const handleSubmit = async () => {
    // Validasi form
    if (!newProgram.nama || !newProgram.tanggal || !newProgram.budget) {
      alertError("Semua field harus diisi");
      return;
    }

    try {
      // Prepare data untuk API
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || '"token"'
              )}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create new program
        response = await fetch(
          `${import.meta.env.VITE_NEW_BASE_URL}/admin/village-work-programs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || '"token"'
              )}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh data after successful operation
      await fetchProgramKerja();
      resetForm();
      setShowForm(false);
      await alertSuccess(
        editingId
          ? "Program berhasil diperbarui"
          : "Program berhasil ditambahkan"
      );
    } catch (err) {
      console.error("Error saving program:", err);
      alertError(
        editingId ? "Gagal memperbarui program" : "Gagal menambahkan program"
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        Program Kerja Desa
      </h1>

      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <FaPlus /> Tambah Program
        </button>
      </div>

      {showForm && (
        <div
          ref={formRef}
          className="bg-white border border-gray-300 p-5 mb-6 rounded-md shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Program Kerja" : "Form Program Kerja"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Program
              </label>
              <input
                type="text"
                placeholder="Nama Program"
                className="p-2 border rounded w-full"
                value={newProgram.nama}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, nama: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={newProgram.tanggal}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, tanggal: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="number"
                placeholder="Budget"
                className="p-2 border rounded w-full"
                value={newProgram.budget}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, budget: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="p-2 border rounded w-full"
                value={newProgram.status}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, status: e.target.value })
                }
              >
                <option value="DIRENCANAKAN">Direncanakan</option>
                <option value="DALAM_PENGERJAAN">Dalam Pengerjaan</option>
                <option value="SELESAI">Selesai</option>
                <option value="DIBATALKAN">Dibatalkan</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Justifikasi
              </label>
              <textarea
                placeholder="Justifikasi / Keterangan Program"
                className="p-2 border rounded w-full"
                value={newProgram.justifikasi}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, justifikasi: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <FaSave /> {editingId ? "Update Program" : "Simpan Program"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Program</th>
                <th className="px-4 py-2 text-left">Tanggal Pelaksanaan</th>
                <th className="px-4 py-2 text-left">Budget</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {programKerja.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada program yang tersedia.
                  </td>
                </tr>
              ) : (
                programKerja.map((item, index) => {
                  const style = getStatusStyle(item.status);
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{item.nama}</td>
                      <td className="px-4 py-2 flex items-center gap-1 text-green-600">
                        <FaCalendarAlt />
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2">{formatRupiah(item.budget)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.color}`}
                        >
                          {style.icon} {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProgram;
