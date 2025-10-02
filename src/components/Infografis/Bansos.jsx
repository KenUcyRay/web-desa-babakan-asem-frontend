import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Bansos() {
  const { t, i18n } = useTranslation();

  // Function to translate dynamic Bansos data
  const translateBansosData = (name) => {
    const translations = {
      'pkh': t('bansos.programs.pkh'),
      'blt': t('bansos.programs.blt'),
      'bpnt': t('bansos.programs.bpnt'),
      'pip': t('bansos.programs.pip'),
      'kip': t('bansos.programs.kip'),
      'kis': t('bansos.programs.kis'),
      'bsu': t('bansos.programs.bsu'),
      'bansos tunai': t('bansos.programs.cash_assistance'),
      'bantuan pangan': t('bansos.programs.food_assistance'),
      'bantuan pendidikan': t('bansos.programs.education_assistance'),
      'bantuan kesehatan': t('bansos.programs.health_assistance')
    };
    return translations[name?.toLowerCase()] || name;
  };
  const [bansos, setBansos] = useState([]);
  const [chartData, setChartData] = useState([]);
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
      return;
    }
    setBansos(responseBody.bansos);

    // Set tanggal update terakhir
    if (responseBody.lastUpdated) {
      setLastUpdated(responseBody.lastUpdated);
    } else if (responseBody.bansos && responseBody.bansos.length > 0) {
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

  useEffect(() => {
    fetchBansos();
  }, [i18n.language]);

  // Generate chart data from bansos data
  useEffect(() => {
    if (bansos.length > 0) {
      const chartArray = bansos.map(item => ({
        name: item.name,
        amount: item.amount
      }));
      setChartData(chartArray);
    } else {
      setChartData([]);
    }
  }, [bansos]);

  const barChartData = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        label: t("bansos.jumlah"),
        data: chartData.map((item) => item.amount),
        backgroundColor: "#B6F500",
        borderColor: "#9BD500",
        borderWidth: 1,
        borderRadius: 4,
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
        text: t("bansos.title"),
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
            return `${context.parsed.y.toLocaleString()} ${t("bansos.recipients")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
          maxRotation: 45,
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

        {/* Daftar Program Bansos - Dipindah ke atas */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {t("bansos.active_programs")}
          </h3>
          {bansos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bansos.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{translateBansosData(item.name)}</p>
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
                        {t("bansos.createdAt")}: {Helper.formatTanggal(item.created_at)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">
                {t("bansos.noData")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Penjelasan Bansos */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
            <ul className="text-gray-700 space-y-1 list-disc list-inside">
              <li>{t("bansos.goal_1")}</li>
              <li>{t("bansos.goal_2")}</li>
              <li>{t("bansos.goal_3")}</li>
              <li>{t("bansos.goal_4")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grafik Bansos - Dipindah ke bawah */}
      {bansos.length > 0 && chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">
              {t("bansos.analysis_title")}
            </h4>
            <p className="text-gray-700">
              {t("bansos.analysis_text")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}