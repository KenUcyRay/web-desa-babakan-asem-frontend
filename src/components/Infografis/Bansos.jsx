import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

// Daftarkan ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Bansos() {
  const { t, i18n } = useTranslation();
  const [bansos, setBansos] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fungsi untuk memparse text dengan tag <bold>
  const parseTextWithBold = (text) => {
    if (!text) return text;

    const parts = text.split(/(<bold>.*?<\/bold>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<bold>") && part.endsWith("</bold>")) {
        const boldText = part.replace(/<\/?bold>/g, "");
        return (
          <strong key={index} className="font-bold text-blue-900">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  const fetchBansos = async () => {
    const response = await InfografisApi.getBansos(i18n.language);
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data Bantuan Sosial.");
      return;
    }
    setBansos(responseBody.bansos);

    // Set tanggal update terakhir
    if (responseBody.lastUpdated) {
      setLastUpdated(responseBody.lastUpdated);
    } else if (responseBody.bansos && responseBody.bansos.length > 0) {
      // Jika API tidak mengembalikan lastUpdated, ambil dari data terakhir yang diupdate
      const latestData = responseBody.bansos.reduce((latest, current) => {
        if (!latest.updated_at) return current;
        if (!current.updated_at) return latest;
        return new Date(current.updated_at) > new Date(latest.updated_at)
          ? current
          : latest;
      });
      if (latestData.updated_at) {
        setLastUpdated(latestData.updated_at);
      }
    }
  };

  const getDummyTrendData = () => {
    return [
      { year: 2020, total: 18500 },
      { year: 2021, total: 16300 },
      { year: 2022, total: 14200 },
      { year: 2023, total: 12800 },
      { year: 2024, total: 11200 },
    ];
  };

  useEffect(() => {
    fetchBansos();
    setTrendData(getDummyTrendData());
  }, [i18n.language]);

  const chartData = {
    labels: trendData.map((item) => item.year),
    datasets: [
      {
        label: "", // kosongkan agar legend tidak muncul
        data: trendData.map((item) => item.total),
        borderColor: "#B6F500",
        backgroundColor: "rgba(182, 245, 0, 0.2)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#B6F500",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointRadius: 5,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("bansos.trend_title"),
        align: "center",
        font: {
          family: "Poppins, sans-serif",
          size: 18,
          weight: "bold",
        },
        color: "#111",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1a1c23",
        titleFont: {
          family: "Poppins, sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "Poppins, sans-serif",
          size: 14,
          weight: "bold",
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toLocaleString()} ${t(
              "bansos.recipients"
            )}`;
          },
          title: function (context) {
            return `${t("bansos.year")} ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "Poppins, sans-serif",
            size: 12,
          },
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Poppins, sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 font-poppins">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {t("bansos.title")}
        </h2>
        <p className="mt-2 text-gray-600 max-w-3xl">
          {t("bansos.description")}
        </p>
        {lastUpdated && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              {t("bansos.lastUpdated")}: {Helper.formatTanggal(lastUpdated)}
            </p>
          </div>
        )}

        {/* Grafik Tren */}
        <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-6 bg-yellow-50 px-3 py-1 rounded-full w-fit mx-auto">
            <span className="text-sm text-yellow-700">
              Tren menurun 39% dalam 5 tahun
            </span>
          </div>

          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Legenda dan Analisis */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {trendData.map((item, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center"
              >
                <div className="text-sm font-medium text-gray-500">
                  {item.year}
                </div>
                <div className="mt-1 text-lg font-bold text-[#B6F500]">
                  {item.total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t("bansos.recipients")}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">
              {t("bansos.analysis_title")}
            </h4>
            <p className="text-gray-700">
              {parseTextWithBold(t("bansos.analysis_text"))}
            </p>
            <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
              <li>{t("bansos.analysis_point_1")}</li>
              <li>{t("bansos.analysis_point_2")}</li>
              <li>{t("bansos.analysis_point_3")}</li>
              <li>{t("bansos.analysis_point_4")}</li>
            </ul>
          </div>
        </div>

        {/* Daftar Program Bansos */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {t("bansos.active_programs")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bansos.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {t("bansos.jumlah")}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-[#B6F500] ml-4">
                    {item.amount.toLocaleString()}
                  </span>
                </div>
                {item.created_at && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {t("bansos.createdAt")}:{" "}
                      {Helper.formatTanggal(item.created_at)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {t("bansos.about_title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              {t("bansos.what_is")}
            </h4>
            <p className="text-gray-700">{t("bansos.what_is_text")}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              {t("bansos.goals")}
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>{t("bansos.goal_1")}</li>
              <li>{t("bansos.goal_2")}</li>
              <li>{t("bansos.goal_3")}</li>
              <li>{t("bansos.goal_4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
