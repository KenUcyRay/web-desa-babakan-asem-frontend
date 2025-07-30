import { useState, useEffect } from "react";
import pana from "../../assets/pana.png";
import {
  FaMale,
  FaFemale,
  FaChild,
  FaHome,
  FaLeaf,
  FaFish,
  FaChalkboardTeacher,
  FaStore,
  FaUserTie,
  FaSkull,
  FaStarAndCrescent,
  FaChurch,
  FaOm,
  FaYinYang,
  FaCross,
  FaBook,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";
import { useTranslation } from "react-i18next";

// Reusable StatCard component
function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform duration-200 h-full">
      <div className="text-4xl text-[#B6F500]">{icon}</div>
      <p className="mt-2 text-gray-600 text-sm">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function Penduduk() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [kematian, setKematian] = useState(0);

  // Fetch base data
  useEffect(() => {
    const fetchPenduduk = async () => {
      try {
        const response = await InfografisApi.getPenduduk();
        if (!response.ok) return alertError("Gagal mengambil data penduduk");
        
        const result = await response.json();
        const iconOptions = {
          male: <FaMale />,
          female: <FaFemale />,
          home: <FaHome />,
          child: <FaChild />,
        };
        
        const mapped = result.resident.map((item) => {
          const lower = item.title.toLowerCase();
          const iconKey = lower.includes("laki")
            ? "male"
            : lower.includes("perempuan")
            ? "female"
            : lower.includes("keluarga")
            ? "home"
            : "child";
            
          return {
            icon: iconOptions[iconKey],
            label: item.title,
            value: item.amount,
          };
        });
        
        setData(mapped);
        
        // Fetch death data
        const deathResponse = await InfografisApi.getDeath();
        if (!deathResponse.ok) return alertError("Gagal mengambil data kematian");
        
        const deathData = await deathResponse.json();
        setKematian(deathData.total);
      } catch (error) {
        alertError("Gagal mengambil data penduduk");
      }
    };

    fetchPenduduk();
  }, []);

  // Static data for additional charts
  const pekerjaanData = [
    { name: "Petani", value: 200, icon: <FaLeaf /> },
    { name: "Nelayan", value: 50, icon: <FaFish /> },
    { name: "Guru", value: 30, icon: <FaChalkboardTeacher /> },
    { name: "Pedagang", value: 80, icon: <FaStore /> },
    { name: "Pegawai", value: 40, icon: <FaUserTie /> },
  ];

  const pendidikanData = [
    { name: "SD", value: 250 },
    { name: "SMP", value: 300 },
    { name: "SMA", value: 200 },
    { name: "S1", value: 100 },
    { name: "S2", value: 50 },
  ];

  const statusNikahData = [
    { name: "Menikah", value: 450 },
    { name: "Belum Menikah", value: 300 },
    { name: "Cerai", value: 50 },
  ];

  const agamaCardData = [
    { name: "Islam", value: 700, icon: <FaStarAndCrescent /> },
    { name: "Kristen Protestan", value: 100, icon: <FaCross /> },
    { name: "Katolik", value: 80, icon: <FaChurch /> },
    { name: "Hindu", value: 50, icon: <FaOm /> },
    { name: "Buddha", value: 20, icon: <FaYinYang /> },
    { name: "Konghucu", value: 15, icon: <FaBook /> },
  ];

  const agamaChartData = [
    { name: "Islam", value: 700 },
    { name: "Kristen Protestan", value: 100 },
    { name: "Katolik", value: 80 },
    { name: "Hindu", value: 50 },
    { name: "Buddha", value: 20 },
    { name: "Konghucu", value: 15 },
  ];

  const usiaData = [
    { name: "0-5", value: 50 },
    { name: "6-17", value: 150 },
    { name: "18-40", value: 300 },
    { name: "41-60", value: 200 },
    { name: "61+", value: 100 },
  ];

  const dusunData = [
    { name: "Dusun A", value: 300 },
    { name: "Dusun B", value: 250 },
    { name: "Dusun C", value: 220 },
  ];

  const COLORS = ["#B6F500", "#FFD700", "#FF69B4", "#87CEEB", "#32CD32", "#FF6347"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-poppins space-y-16">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">
            {t("resident.title")}
          </h2>
          <p className="mt-4 text-gray-600">
            {t("resident.description.paragraph1")}
          </p>
          <p className="mt-2 text-gray-500 italic text-sm">
            {t("resident.description.paragraph2")}
          </p>
        </div>
        <img
          src={pana}
          alt="Ilustrasi Penduduk"
          className="w-full max-w-md mx-auto drop-shadow-md"
        />
      </div>

      {/* Base Statistics Cards */}
      <section>
        <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Data Penduduk Utama
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Data berikut menunjukkan komposisi dasar penduduk desa berdasarkan jenis kelamin, jumlah kepala keluarga, 
              dan statistik kematian. Data ini menjadi dasar untuk perencanaan program pembangunan dan pelayanan masyarakat.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {data.map((item, idx) => (
                <StatCard
                  key={idx}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
              {/* Tambahkan card kematian */}
              <StatCard
                icon={<FaSkull />}
                label="Jumlah Kematian"
                value={kematian}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Population Chart */}
      <section>
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
          {t("resident.chart.title")}
        </h3>
        <p className="text-center text-gray-600 mb-8">
          {t("resident.chart.description")}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.map((d) => ({ name: d.label, jumlah: d.value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="jumlah"
              fill="#B6F500"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Additional Infographics */}
      <section className="space-y-16">
        {/* Pekerjaan */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Data Pekerjaan Penduduk
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Distribusi mata pencaharian penduduk desa menunjukkan karakteristik ekonomi masyarakat. 
              Sektor pertanian masih mendominasi sebagai sumber penghasilan utama, diikuti dengan sektor perdagangan dan jasa. 
              Data ini penting untuk pengembangan ekonomi lokal dan program pelatihan keterampilan.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {pekerjaanData.map((item, idx) => (
                <StatCard
                  key={idx}
                  icon={item.icon}
                  label={item.name}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pendidikan */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Tingkat Pendidikan Penduduk
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Profil pendidikan masyarakat desa menggambarkan kualitas sumber daya manusia. 
            Mayoritas penduduk berpendidikan menengah (SMP-SMA), sementara lulusan perguruan tinggi masih perlu ditingkatkan. 
            Data ini menjadi acuan untuk program pendidikan dan beasiswa bagi masyarakat.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pendidikanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#FF69B4"
                barSize={35}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pernikahan */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Status Pernikahan
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Komposisi status pernikahan penduduk dewasa menunjukkan struktur keluarga dalam masyarakat. 
            Pie chart digunakan untuk menunjukkan proporsi masing-masing status secara visual.
            Data ini membantu dalam perencanaan program keluarga dan pembinaan sosial kemasyarakatan.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusNikahData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusNikahData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Agama - Card Section */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Komposisi Agama
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Keberagaman agama mencerminkan toleransi dan keharmonisan hidup bermasyarakat. 
            Data ini penting untuk perencanaan kegiatan keagamaan dan pembinaan kehidupan beragama.
          </p>
          
          {/* Card agama mirip pekerjaan */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
            {agamaCardData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.name}
                value={item.value}
              />
            ))}
          </div>
          
          {/* Chart agama */}
          <h4 className="text-2xl font-bold text-gray-700 text-center mb-4">
            Distribusi Agama
          </h4>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Persentase komposisi agama penduduk desa berdasarkan data terbaru
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={agamaChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {agamaChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} orang`, "Jumlah"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Kelompok Usia */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Kelompok Usia
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Struktur usia menunjukkan komposisi penduduk berdasarkan kelompok umur. 
            Area chart dipilih untuk menampilkan distribusi dan tren populasi secara visual.
            Komposisi usia produktif (18-60 tahun) mendominasi, menunjukkan potensi ekonomi yang baik.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={usiaData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorAge)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribusi Dusun */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Distribusi Per Dusun
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Penyebaran penduduk di wilayah desa berdasarkan dusun. 
            Bar chart digunakan untuk membandingkan jumlah penduduk antar dusun secara jelas.
            Penyebaran penduduk relatif merata antar dusun, memudahkan pelayanan administrasi dan pembangunan.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dusunData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}