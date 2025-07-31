import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL || "http://localhost:3000";

export default function ManageApb() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ anggaran: "", realisasi: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ key: "", anggaran: "", realisasi: "" });

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/apb`);
      const result = await response.json();
      const transformedData =
        result.data?.map((item) => ({
          id: item.id,
          key: item.bidang,
          anggaran: parseInt(item.anggaran) / 1000000,
          realisasi: parseInt(item.realisasi) / 1000000,
        })) || [];
      setData(transformedData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateApb = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/apb/${editing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({
          bidang: editing.key,
          anggaran: parseFloat(form.anggaran) * 1000000,
          realisasi: parseFloat(form.realisasi) * 1000000,
        }),
      });
      if (!response.ok) throw new Error();
      await fetchData();
      setEditing(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const addApb = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/apb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
        body: JSON.stringify({
          bidang: addForm.key,
          anggaran: parseFloat(addForm.anggaran) * 1000000,
          realisasi: parseFloat(addForm.realisasi) * 1000000,
        }),
      });
      if (!response.ok) throw new Error();
      await fetchData();
      setAddForm({ key: "", anggaran: "", realisasi: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const deleteApb = async (id) => {
    try {
      await fetch(`${BASE_URL}/admin/apb/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token").slice(1, -1)}`,
        },
      });
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAnggaran = data.reduce((sum, item) => sum + item.anggaran, 0);
  const totalRealisasi = data.reduce((sum, item) => sum + item.realisasi, 0);
  const sisaAnggaran = totalAnggaran - totalRealisasi;
  const persen = totalAnggaran ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4">
        <span className="text-3xl">📊</span> APBDes 2025
      </h2>

      <h3 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Grafik Perbandingan Anggaran vs Realisasi
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="key" padding={{ left: 30, right: 30 }} />
          <YAxis unit=" jt" />
          <Tooltip />
          <Legend />
          <Bar dataKey="anggaran" name="Anggaran" fill="#4ade80" barSize={40} />
          <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke="#3b82f6" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Tombol Tambah */}
      <div className="text-right mt-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center gap-2"
        >
          <FaPlus /> Tambah
        </button>
      </div>

      {/* FORM TAMBAH */}
      {showAddForm && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <h4 className="font-bold mb-4">Tambah Data APBDes</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <label>
              <span className="block mb-1">Bidang</span>
              <input
                type="text"
                value={addForm.key}
                onChange={(e) => setAddForm({ ...addForm, key: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">Anggaran (juta)</span>
              <input
                type="number"
                value={addForm.anggaran}
                onChange={(e) => setAddForm({ ...addForm, anggaran: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">Realisasi (juta)</span>
              <input
                type="number"
                value={addForm.realisasi}
                onChange={(e) => setAddForm({ ...addForm, realisasi: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={addApb}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* LIST DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md shadow-sm">
            <div>
              <p className="font-semibold">{item.key}</p>
              <p className="text-sm text-gray-600">
                Anggaran: {item.anggaran} jt | Realisasi: {item.realisasi} jt
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(item);
                  setForm({ anggaran: item.anggaran, realisasi: item.realisasi });
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteApb(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM EDIT */}
      {editing && (
        <div className="mt-6 bg-white p-4 shadow rounded-lg">
          <h4 className="font-bold mb-4">Edit: {editing.key}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <label>
              <span className="block mb-1">Anggaran (juta)</span>
              <input
                type="number"
                value={form.anggaran}
                onChange={(e) => setForm({ ...form, anggaran: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">Realisasi (juta)</span>
              <input
                type="number"
                value={form.realisasi}
                onChange={(e) => setForm({ ...form, realisasi: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Batal
            </button>
            <button onClick={updateApb} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* RINGKASAN */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Anggaran" value={`${totalAnggaran} juta`} color="green" />
        <StatCard label="Total Realisasi" value={`${totalRealisasi} juta`} color="blue" />
        <StatCard label="Sisa Anggaran" value={`${sisaAnggaran} juta`} color="yellow" />
        <StatCard label="Penyerapan" value={`${persen}%`} color="purple" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <div className={`${colorMap[color]} p-4 rounded-xl`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
