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
import { alertConfirm, alertSuccess } from "../../libs/alert";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL || "http://localhost:3000";

export default function ManageApb() {
  const { t, i18n } = useTranslation();

  // Format currency for very large numbers (billions) - same as Home component
  const formatRupiahBillion = (angka, language = "id") => {
    if (angka >= 1000000000000) {
      // Triliun
      const trillion = angka / 1000000000000;
      const trillionText = language === "en" ? "trillion" : "triliun";
      return `${
        trillion % 1 === 0 ? trillion.toFixed(0) : trillion.toFixed(1)
      } ${trillionText}`;
    } else if (angka >= 1000000000) {
      // Miliar
      const billion = angka / 1000000000;
      const billionText = language === "en" ? "billion" : "miliar";
      return `${
        billion % 1 === 0 ? billion.toFixed(0) : billion.toFixed(1)
      } ${billionText}`;
    } else if (angka >= 1000000) {
      // Juta
      const million = angka / 1000000;
      const millionText = language === "en" ? "million" : "juta";
      return `${
        million % 1 === 0 ? million.toFixed(0) : million.toFixed(1)
      } ${millionText}`;
    }
    return Helper.formatRupiah(angka);
  };
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ key: "", anggaran: "", realisasi: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    key: "",
    anggaran: "",
    realisasi: "",
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/apb`);
      const result = await response.json();
      const transformedData =
        result.data?.map((item) => ({
          id: item.id,
          key: item.bidang,
          anggaran: parseInt(item.anggaran),
          realisasi: parseInt(item.realisasi),
          anggaranMillion: parseInt(item.anggaran) / 1000000,
          realisasiMillion: parseInt(item.realisasi) / 1000000,
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bidang: form.key,
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bidang: addForm.key,
          anggaran: parseFloat(addForm.anggaran) * 1000000,
          realisasi: parseFloat(addForm.realisasi) * 1000000,
        }),
      });
      if (!response.ok) {
        Helper.errorResponseHandler(await response.json());
        return;
      }
      await fetchData();
      await alertSuccess(t("manageApb.success.add"));
      setAddForm({ key: "", anggaran: "", realisasi: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const deleteApb = async (id) => {
    if (!(await alertConfirm(t("manageApb.confirmation.delete")))) return;

    const response = await fetch(`${BASE_URL}/admin/apb/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      Helper.errorResponseHandler(await response.json());
      return;
    }

    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAnggaran = data.reduce((sum, item) => sum + item.anggaran, 0);
  const totalRealisasi = data.reduce((sum, item) => sum + item.realisasi, 0);
  const sisaAnggaran = totalAnggaran - totalRealisasi;
  const persen = totalAnggaran
    ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-4">
        <span className="text-3xl">📊</span> {t("manageApb.title")}
      </h2>

      <h3 className="text-center text-lg font-semibold mb-2 text-gray-700">
        {t("manageApb.chartTitle")}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data.map((item) => ({
            ...item,
            anggaran: item.anggaranMillion,
            realisasi: item.realisasiMillion,
          }))}
          margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="key" padding={{ left: 30, right: 30 }} />
          <YAxis unit={t("manageApb.chart.unit")} />
          <Tooltip
            formatter={(value, name) => [
              `${formatRupiahBillion(value * 1000000, i18n.language)}`,
              name === "anggaran"
                ? t("manageApb.chart.legend.anggaran")
                : t("manageApb.chart.legend.realisasi"),
            ]}
            labelFormatter={(value) =>
              t("manageApb.form.fields.bidang") + ": " + value
            }
          />
          <Legend />
          <Bar
            dataKey="anggaran"
            name={t("manageApb.chart.legend.anggaran")}
            fill="#4ade80"
            barSize={40}
          />
          <Line
            type="monotone"
            dataKey="realisasi"
            name={t("manageApb.chart.legend.realisasi")}
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Tombol Tambah */}
      <div className="text-right mt-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center gap-2"
        >
          <FaPlus /> {t("manageApb.buttons.add")}
        </button>
      </div>

      {/* FORM TAMBAH */}
      {showAddForm && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <h4 className="font-bold mb-4">{t("manageApb.form.addTitle")}</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.bidang")}
              </span>
              <input
                type="text"
                value={addForm.key}
                onChange={(e) =>
                  setAddForm({ ...addForm, key: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.anggaran")}
              </span>
              <input
                type="number"
                value={addForm.anggaran}
                onChange={(e) =>
                  setAddForm({ ...addForm, anggaran: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.realisasi")}
              </span>
              <input
                type="number"
                value={addForm.realisasi}
                onChange={(e) =>
                  setAddForm({ ...addForm, realisasi: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {t("manageApb.buttons.cancel")}
            </button>
            <button
              onClick={addApb}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t("manageApb.buttons.save")}
            </button>
          </div>
        </div>
      )}

      {/* LIST DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md shadow-sm"
          >
            <div>
              <p className="font-semibold">{item.key}</p>
              <p className="text-sm text-gray-600">
                {t("manageApb.list.anggaranLabel")}:{" "}
                {Helper.formatRupiahMillion(item.anggaran, i18n.language)} |{" "}
                {t("manageApb.list.realisasiLabel")}:{" "}
                {Helper.formatRupiahMillion(item.realisasi, i18n.language)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(item);
                  setForm({
                    key: item.key,
                    anggaran: item.anggaranMillion,
                    realisasi: item.realisasiMillion,
                  });
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
          <h4 className="font-bold mb-4">
            {t("manageApb.form.editTitle")}: {editing.key}
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.bidang")}
              </span>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.anggaran")}
              </span>
              <input
                type="number"
                value={form.anggaran}
                onChange={(e) => setForm({ ...form, anggaran: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>
            <label>
              <span className="block mb-1">
                {t("manageApb.form.fields.realisasi")}
              </span>
              <input
                type="number"
                value={form.realisasi}
                onChange={(e) =>
                  setForm({ ...form, realisasi: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {t("manageApb.buttons.cancel")}
            </button>
            <button
              onClick={updateApb}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t("manageApb.buttons.save")}
            </button>
          </div>
        </div>
      )}

      {/* RINGKASAN */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <StatCard
          label={t("manageApb.summary.totalAnggaran")}
          value={formatRupiahBillion(totalAnggaran, i18n.language)}
          color="green"
        />
        <StatCard
          label={t("manageApb.summary.totalRealisasi")}
          value={formatRupiahBillion(totalRealisasi, i18n.language)}
          color="blue"
        />
        <StatCard
          label={t("manageApb.summary.sisaAnggaran")}
          value={formatRupiahBillion(sisaAnggaran, i18n.language)}
          color="yellow"
        />
        <StatCard
          label={t("manageApb.summary.penyerapan")}
          value={`${persen}%`}
          color="purple"
        />
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
