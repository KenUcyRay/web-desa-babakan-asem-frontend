import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";

export default function IDM() {
  const [idm, setIdm] = useState([]);
  const [extraIdm, setExtraIdm] = useState({
    status_desa: "-",
    sosial: 0,
    ekonomi: 0,
    lingkungan: 0,
  });

  const fetchData = async () => {
    // Fetch data IDM (chart)
    const resIdm = await InfografisApi.getIdm();
    const bodyIdm = await resIdm.json();
    if (resIdm.ok && Array.isArray(bodyIdm.idm)) {
      setIdm(bodyIdm.idm.map((d) => ({ ...d, skor: d.skor / 100 }))); // normalisasi skor
    } else {
      alertError("Gagal mengambil data IDM.");
    }

    // Fetch extraIdm (statistik kotak)
    const resExtra = await InfografisApi.getExtraIdm();
    const bodyExtra = await resExtra.json();
    if (
      resExtra.ok &&
      Array.isArray(bodyExtra.extraIdm) &&
      bodyExtra.extraIdm.length > 0
    ) {
      setExtraIdm(bodyExtra.extraIdm[0]);
    } else {
      alertError("Gagal mengambil data status desa & dimensi.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Skor IDM Desa Babakan Asem
        </h2>
        <p className="mt-2 text-gray-600">
          Indeks Desa Membangun (IDM) dari tahun ke tahun.
        </p>
      </div>

      {/* Statistik Kotak */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">Status Desa</p>
          <p className="text-xl font-bold text-gray-800">
            {extraIdm.status_desa}
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">Dimensi Sosial</p>
          <p className="text-xl font-bold text-gray-800">{extraIdm.sosial}</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">Dimensi Ekonomi</p>
          <p className="text-xl font-bold text-gray-800">{extraIdm.ekonomi}</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">Dimensi Lingkungan</p>
          <p className="text-xl font-bold text-gray-800">
            {extraIdm.lingkungan}
          </p>
        </div>
      </div>

      {/* Diagram Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Perkembangan Skor IDM
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={idm}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0.6, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="skor"
              stroke="#B6F500"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
