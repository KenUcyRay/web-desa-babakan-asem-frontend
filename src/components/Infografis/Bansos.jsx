import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Import library chart
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";
import { useTranslation } from "react-i18next";

// Daftarkan komponen Chart.js
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
  const { t } = useTranslation();
  const [bansos, setBansos] = useState([]);
  const [trendData, setTrendData] = useState([]); // Data untuk grafik

  const fetchBansos = async () => {
    const response = await InfografisApi.getBansos();
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data Bantuan Sosial.");
      return;
    }
    setBansos(responseBody.bansos);
  };

  // Fungsi baru untuk mengambil data tren
  const fetchTrendData = async () => {
    const response = await InfografisApi.getBansosTrend(); // Anda perlu membuat API ini
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data tren Bansos.");
      return;
    }
    setTrendData(responseBody.trend);
  };

  useEffect(() => {
    fetchBansos();
    fetchTrendData();
  }, []);

  // Siapkan data untuk grafik
  const chartData = {
    labels: trendData.map(item => item.year),
    datasets: [
      {
        label: t("bansos.total_recipients"),
        data: trendData.map(item => item.total),
        borderColor: "#B6F500",
        backgroundColor: "rgba(182, 245, 0, 0.2)",
        tension: 0.3,
      }
    ]
  };

  // Konfigurasi opsi grafik
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Poppins, sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: t("bansos.trend_title"),
        font: {
          size: 16,
          family: "Poppins, sans-serif"
        }
      },
      tooltip: {
        bodyFont: {
          family: "Poppins, sans-serif"
        },
        titleFont: {
          family: "Poppins, sans-serif"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "Poppins, sans-serif"
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: "Poppins, sans-serif"
          }
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      <h2 className="text-3xl font-bold text-gray-800">{t("bansos.title")}</h2>
      <p className="mt-2 text-gray-600">{t("bansos.description")}</p>

      {/* Grafik Tren */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6 mt-8">
        {bansos.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow flex justify-between hover:shadow-md hover:-translate-y-1 transition"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-500 text-sm">{t("bansos.jumlah")}</p>
            </div>
            <span className="text-xl font-bold text-[#B6F500]">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 