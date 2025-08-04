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
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

export default function IDM() {
  const { t, i18n } = useTranslation();
  const [idm, setIdm] = useState([]);
  const [extraIdm, setExtraIdm] = useState({
    status_desa: "-",
    sosial: 0,
    ekonomi: 0,
    lingkungan: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    const resIdm = await InfografisApi.getIdm(i18n.language);
    const bodyIdm = await resIdm.json();
    if (resIdm.ok && Array.isArray(bodyIdm.idm)) {
      setIdm(bodyIdm.idm.map((d) => ({ ...d, skor: d.skor / 100 })));
      // Set tanggal update terakhir (ambil dari data terbaru atau response)
      if (bodyIdm.lastUpdated) {
        setLastUpdated(bodyIdm.lastUpdated);
      } else if (bodyIdm.idm.length > 0) {
        // Jika API tidak mengembalikan lastUpdated, gunakan updated_at dari data terakhir
        const latestData = bodyIdm.idm[bodyIdm.idm.length - 1];
        if (latestData.updated_at) {
          setLastUpdated(latestData.updated_at);
        }
      }
    } else {
      alertError("Gagal mengambil data IDM.");
    }

    const resExtra = await InfografisApi.getExtraIdm(i18n.language);
    const bodyExtra = await resExtra.json();
    if (
      resExtra.ok &&
      Array.isArray(bodyExtra.extraIdm) &&
      bodyExtra.extraIdm.length > 0
    ) {
      setExtraIdm(bodyExtra.extraIdm[0]);
      // Set tanggal update dari extra IDM jika tidak ada dari data IDM utama
      if (!lastUpdated && bodyExtra.extraIdm[0].updated_at) {
        setLastUpdated(bodyExtra.extraIdm[0].updated_at);
      }
    } else {
      alertError("Gagal mengambil data status desa & dimensi.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">{t("idm.title")}</h2>
        <p className="mt-2 text-gray-600">{t("idm.description")}</p>
        {lastUpdated && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              {t("idm.lastUpdated")}: {Helper.formatTanggal(lastUpdated)}
            </p>
          </div>
        )}
      </div>

      {/* Statistik Kotak */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">{t("idm.box.status")}</p>
          <p className="text-xl font-bold text-gray-800">
            {extraIdm.status_desa}
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">{t("idm.box.sosial")}</p>
          <p className="text-xl font-bold text-gray-800">{extraIdm.sosial}</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">{t("idm.box.ekonomi")}</p>
          <p className="text-xl font-bold text-gray-800">{extraIdm.ekonomi}</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-600">{t("idm.box.lingkungan")}</p>
          <p className="text-xl font-bold text-gray-800">
            {extraIdm.lingkungan}
          </p>
        </div>
      </div>

      {/* Diagram Line */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {t("idm.chart.title")}
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
