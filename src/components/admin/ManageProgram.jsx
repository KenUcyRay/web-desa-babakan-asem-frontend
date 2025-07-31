import React, { useState, useRef, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaCheck,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const getStatusStyle = (status) => {
  switch (status) {
    case "SELESAI":
      return { color: "text-green-700", bg: "bg-green-100", icon: <FaCheck /> };
    case "DALAM_PENGERJAAN":
      return { color: "text-yellow-700", bg: "bg-yellow-100", icon: <FaClock /> };
    case "DIBATALKAN":
      return { color: "text-red-700", bg: "bg-red-100", icon: <FaTimesCircle /> };
    case "DIRENCANAKAN":
      return { color: "text-blue-700", bg: "bg-blue-100", icon: <FaCalendarAlt /> };
    default:
      return { color: "text-gray-700", bg: "bg-gray-100", icon: null };
  }
};

const ManageProgram = () => {
  const [programKerja, setProgramKerja] = useState([
    {
      id: 1,
      nama: "Ini Dummy",
      tanggal: "2025-08-17",
      budget: 1000,
      status: "DIRENCANAKAN",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    nama: "",
    tanggal: "",
    budget: "",
    status: "DIRENCANAKAN",
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const handleTambah = () => {
    if (
      newProgram.nama &&
      newProgram.tanggal &&
      newProgram.budget &&
      newProgram.status
    ) {
      const newEntry = {
        id: Date.now(),
        ...newProgram,
        budget: parseInt(newProgram.budget),
      };
      setProgramKerja([...programKerja, newEntry]);
      setNewProgram({ nama: "", tanggal: "", budget: "", status: "DIRENCANAKAN" });
      setShowForm(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        Program Kerja Desa
      </h1>

      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Tambah Program
        </button>
      </div>

      {showForm && (
        <div
          ref={formRef}
          className="bg-white border border-gray-300 p-4 mb-6 rounded-md shadow"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Form Program Kerja</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Program"
              className="p-2 border rounded"
              value={newProgram.nama}
              onChange={(e) =>
                setNewProgram({ ...newProgram, nama: e.target.value })
              }
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={newProgram.tanggal}
              onChange={(e) =>
                setNewProgram({ ...newProgram, tanggal: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Budget"
              className="p-2 border rounded"
              value={newProgram.budget}
              onChange={(e) =>
                setNewProgram({ ...newProgram, budget: e.target.value })
              }
            />
            <select
              className="p-2 border rounded"
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

          <button
            onClick={handleTambah}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Simpan
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Program</th>
              <th className="px-4 py-2 text-left">Tanggal Pelaksanaan</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {programKerja.map((item, index) => {
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
                </tr>
              );
            })}
            {programKerja.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                  Tidak ada program yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProgram;