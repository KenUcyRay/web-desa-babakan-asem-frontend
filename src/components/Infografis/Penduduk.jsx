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
  FaStar,
  FaCross,
  FaOm,
  FaYinYang,
  FaHeart,
  FaRing,
  FaUserGraduate,
  FaVoteYea,
  FaMapMarkerAlt,
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
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

// Reusable StatCard component with updated_at
function StatCard({ icon, label, value, updatedAt }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform duration-200 h-full">
      <div className="text-4xl text-[#B6F500]">{icon}</div>
      <p className="mt-2 text-gray-600 text-sm text-center">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
      {updatedAt && (
        <p className="mt-1 text-xs text-gray-400">
          {t("penduduk.updatedAt")}: {Helper.formatTanggal(updatedAt)}
        </p>
      )}
    </div>
  );
}

// Custom Tooltip with values
const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        <p className="text-blue-600">{`${t("penduduk.jumlah")}: ${
          payload[0].value
        } ${t("penduduk.orang")}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Label for Pie Chart - Responsive for mobile
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const isMobile = window.innerWidth < 768;
  const radius = isMobile ? outerRadius + 10 : outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={isMobile ? 10 : 12}
      fontWeight="600"
    >
      {isMobile
        ? `${name}: ${value}`
        : `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

export default function Penduduk() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tooltip formatter function that uses translation
  const tooltipFormatter = (value) => [
    `${value} ${t("penduduk.orang")}`,
    t("penduduk.jumlah"),
  ];

  // State untuk setiap tipe data
  const [genderData, setGenderData] = useState([]);
  const [pernikahanData, setPernikahanData] = useState([]);
  const [agamaData, setAgamaData] = useState([]);
  const [usiaData, setUsiaData] = useState([]);
  const [kepalaKeluargaData, setKepalaKeluargaData] = useState([]);
  const [pekerjaanData, setPekerjaanData] = useState([]);
  const [pendidikanData, setPendidikanData] = useState([]);
  const [wajibPilihData, setWajibPilihData] = useState([]);
  const [dusunData, setDusunData] = useState([]);
  const [anakAnakData, setAnakAnakData] = useState([]);

  const baseUrl =
    import.meta.env.VITE_NEW_BASE_URL || "http://localhost:4000/api";

  // Function untuk fetch data berdasarkan type
  const fetchDataByType = async (type) => {
    try {
      const response = await fetch(`${baseUrl}/residents?type=${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return [];
    }
  };

  // Icon mapping untuk berbagai kategori
  const getIconForCategory = (type, key) => {
    const iconMappings = {
      GENDER: {
        "laki-laki": <FaMale />,
        perempuan: <FaFemale />,
        male: <FaMale />,
        female: <FaFemale />,
      },
      PERNIKAHAN: {
        menikah: <FaRing />,
        "belum menikah": <FaHeart />,
        cerai: <FaChild />,
      },
      AGAMA: {
        islam: <FaStar className="text-yellow-400" />,
        kristen: <FaCross className="text-blue-500" />,
        hindu: <FaOm className="text-orange-500" />,
        buddha: <FaYinYang className="text-purple-500" />,
      },
      PERKERJAAN: {
        petani: <FaLeaf />,
        nelayan: <FaFish />,
        guru: <FaChalkboardTeacher />,
        pedagang: <FaStore />,
        pegawai: <FaUserTie />,
      },
      PENDIDIKAN: {
        sd: <FaChild />,
        smp: <FaUserGraduate />,
        sma: <FaUserGraduate />,
        s1: <FaUserGraduate />,
        s2: <FaUserGraduate />,
      },
      KEPALA_KELUARGA: {
        default: <FaHome />,
      },
      WAJIB_PILIH: {
        default: <FaVoteYea />,
      },
      DUSUN: {
        default: <FaMapMarkerAlt />,
      },
      ANAK_ANAK: {
        default: <FaChild />,
      },
      USIA: {
        default: <FaChild />,
      },
    };

    const categoryIcons = iconMappings[type];
    if (!categoryIcons) return <FaChild />;

    const lowerKey = key.toLowerCase();
    return categoryIcons[lowerKey] || categoryIcons.default || <FaChild />;
  };

  // Fetch semua data saat komponen dimuat
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          gender,
          pernikahan,
          agama,
          usia,
          kepalaKeluarga,
          pekerjaan,
          pendidikan,
          wajibPilih,
          dusun,
          anakAnak,
        ] = await Promise.all([
          fetchDataByType("GENDER"),
          fetchDataByType("PERNIKAHAN"),
          fetchDataByType("AGAMA"),
          fetchDataByType("USIA"),
          fetchDataByType("KEPALA_KELUARGA"),
          fetchDataByType("PERKERJAAN"),
          fetchDataByType("PENDIDIKAN"),
          fetchDataByType("WAJIB_PILIH"),
          fetchDataByType("DUSUN"),
          fetchDataByType("ANAK_ANAK"),
        ]);

        // Function untuk mengurutkan data
        const sortData = (data, type) => {
          const mapped = data.map((item) => ({
            ...item,
            icon: getIconForCategory(type, item.key),
          }));

          // Urutan khusus untuk pendidikan
          if (type === "PENDIDIKAN") {
            const educationOrder = [
              "sd",
              "smp",
              "sma",
              "diploma",
              "d3",
              "s1",
              "s2",
              "s3",
            ];
            return mapped.sort((a, b) => {
              const aIndex = educationOrder.indexOf(a.key.toLowerCase());
              const bIndex = educationOrder.indexOf(b.key.toLowerCase());

              // Jika kedua item ada dalam urutan, urutkan berdasarkan index
              if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
              }
              // Jika hanya satu yang ada dalam urutan, yang ada di urutan didahulukan
              if (aIndex !== -1) return -1;
              if (bIndex !== -1) return 1;
              // Jika keduanya tidak ada dalam urutan, urutkan alfabetis
              return a.key.localeCompare(b.key);
            });
          }

          // Urutan khusus untuk gender (laki-laki dulu)
          if (type === "GENDER") {
            return mapped.sort((a, b) => {
              const aKey = a.key.toLowerCase();
              const bKey = b.key.toLowerCase();
              if (aKey.includes("laki") || aKey === "male") return -1;
              if (bKey.includes("laki") || bKey === "male") return 1;
              return 0;
            });
          }

          // Urutan khusus untuk usia (dari muda ke tua)
          if (type === "USIA") {
            return mapped.sort((a, b) => {
              const aKey = a.key.toLowerCase();
              const bKey = b.key.toLowerCase();

              // Extract angka dari key untuk sorting numerik
              const aMatch = aKey.match(/(\d+)/);
              const bMatch = bKey.match(/(\d+)/);

              if (aMatch && bMatch) {
                const aNum = parseInt(aMatch[1]);
                const bNum = parseInt(bMatch[1]);
                return aNum - bNum;
              }

              // Fallback ke sorting alfabetis
              return aKey.localeCompare(bKey);
            });
          }

          // Urutan khusus untuk dusun (dimulai dari A)
          if (type === "DUSUN") {
            return mapped.sort((a, b) => {
              const aKey = a.key.toLowerCase();
              const bKey = b.key.toLowerCase();

              // Extract huruf dari key untuk sorting alfabetis
              const aMatch = aKey.match(/([a-z])/);
              const bMatch = bKey.match(/([a-z])/);

              if (aMatch && bMatch) {
                const aLetter = aMatch[1];
                const bLetter = bMatch[1];
                return aLetter.localeCompare(bLetter);
              }

              // Fallback ke sorting alfabetis normal
              return aKey.localeCompare(bKey);
            });
          }

          return mapped;
        };

        // Set data dengan mapping icon dan urutan
        setGenderData(sortData(gender, "GENDER"));
        setPernikahanData(
          pernikahan.map((item) => ({
            ...item,
            icon: getIconForCategory("PERNIKAHAN", item.key),
          }))
        );
        setAgamaData(
          agama.map((item) => ({
            ...item,
            icon: getIconForCategory("AGAMA", item.key),
          }))
        );
        setUsiaData(sortData(usia, "USIA"));
        setKepalaKeluargaData(
          kepalaKeluarga.map((item) => ({
            ...item,
            icon: getIconForCategory("KEPALA_KELUARGA", item.key),
          }))
        );
        setPekerjaanData(
          pekerjaan.map((item) => ({
            ...item,
            icon: getIconForCategory("PERKERJAAN", item.key),
          }))
        );
        setPendidikanData(sortData(pendidikan, "PENDIDIKAN"));
        setWajibPilihData(
          wajibPilih.map((item) => ({
            ...item,
            icon: getIconForCategory("WAJIB_PILIH", item.key),
          }))
        );
        setDusunData(sortData(dusun, "DUSUN"));
        setAnakAnakData(
          anakAnak.map((item) => ({
            ...item,
            icon: getIconForCategory("ANAK_ANAK", item.key),
          }))
        );
      } catch (error) {
        setError("Gagal mengambil data penduduk");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [baseUrl]);

  const COLORS = [
    "#B6F500",
    "#FFD700",
    "#FF69B4",
    "#87CEEB",
    "#32CD32",
    "#FF6347",
    "#9370DB",
    "#20B2AA",
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Memuat data penduduk...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-poppins space-y-16">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">
            {t("penduduk.title")}
          </h2>
          <p className="mt-4 text-gray-600">{t("penduduk.description")}</p>
          <p className="mt-2 text-gray-500 italic text-sm">
            {t("penduduk.updateNote")}
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              💡 <strong>Tahukah Anda?</strong> Data demografis desa ini
              mencerminkan keragaman sosial dan ekonomi masyarakat yang dinamis.
              Setiap angka memiliki cerita tentang kehidupan dan perkembangan
              komunitas lokal.
            </p>
          </div>
        </div>
        <img
          src={pana}
          alt="Ilustrasi Penduduk"
          className="w-full max-w-md mx-auto drop-shadow-md"
        />
      </div>

      {/* Data Penduduk Utama - Gender, Kepala Keluarga, dan Anak-Anak */}
      <section>
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("penduduk.mainData.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("penduduk.mainData.description")}
              </p>
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700">
                  📊 <strong>Menarik:</strong> Komposisi gender dan struktur
                  keluarga menentukan dinamika sosial dan kebutuhan pembangunan
                  desa.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              {(genderData.length > 0 || kepalaKeluargaData.length > 0 || anakAnakData.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {genderData.map((item, idx) => (
                    <StatCard
                      key={`gender-${idx}`}
                      icon={item.icon}
                      label={item.key}
                      value={item.value}
                      updatedAt={item.updated_at}
                    />
                  ))}
                  {kepalaKeluargaData.map((item, idx) => (
                    <StatCard
                      key={`kk-${idx}`}
                      icon={item.icon}
                      label={item.key}
                      value={item.value}
                      updatedAt={item.updated_at}
                    />
                  ))}
                  {anakAnakData.map((item, idx) => (
                    <StatCard
                      key={`anak-${idx}`}
                      icon={item.icon}
                      label={item.key}
                      value={item.value}
                      updatedAt={item.updated_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data tersedia</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart untuk Data Penduduk Utama */}
          <div>
            <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Komposisi Penduduk Utama
            </h4>
            <p className="text-center text-gray-600 mb-8">
              Distribusi berdasarkan jenis kelamin, kepala keluarga, dan
              anak-anak yang mencerminkan struktur demografis desa
            </p>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={350} minWidth={300}>
                <BarChart
                  data={[
                    ...genderData.map((d) => ({
                      name: d.key,
                      jumlah: d.value,
                    })),
                    ...kepalaKeluargaData.map((d) => ({
                      name: d.key,
                      jumlah: d.value,
                    })),
                    ...anakAnakData.map((d) => ({
                      name: d.key,
                      jumlah: d.value,
                    })),
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="jumlah"
                    name="Jumlah Penduduk"
                    fill="#B6F500"
                    barSize={40}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

      {/* Pekerjaan */}
      <section>
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("penduduk.pekerjaan.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("penduduk.pekerjaan.description")}
              </p>
              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">
                  🏢 <strong>Insight:</strong> Keragaman profesi menunjukkan
                  ekonomi desa yang tidak tergantung pada satu sektor saja,
                  menciptakan ketahanan ekonomi yang lebih baik.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              {pekerjaanData.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pekerjaanData.map((item, idx) => (
                    <StatCard
                      key={idx}
                      icon={item.icon}
                      label={item.key}
                      value={item.value}
                      updatedAt={item.updated_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data tersedia</p>
                </div>
              )}
            </div>
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Distribusi Pekerjaan Penduduk
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Ragam profesi yang menunjukkan dinamika perekonomian dan potensi
            pengembangan sektor unggulan desa
          </p>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <BarChart
                data={pekerjaanData.map((d) => ({
                  name: d.key,
                  jumlah: d.value,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="jumlah"
                  name="Jumlah Penduduk"
                  fill="#FF69B4"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

      {/* Pendidikan */}
      <section>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {t("penduduk.pendidikan.title")}
          </h3>
          <p className="text-center text-gray-600 mb-4 max-w-4xl mx-auto">
            {t("penduduk.pendidikan.description")}
          </p>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800">
                � <strong>Fakta Menarik:</strong> Tingkat pendidikan
                mencerminkan kualitas sumber daya manusia dan berkorelasi dengan
                tingkat kesejahteraan masyarakat desa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {pendidikanData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.key}
                value={item.value}
                updatedAt={item.updated_at}
              />
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Tingkat Pendidikan Penduduk
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Jenjang pendidikan yang menggambarkan kualitas SDM dan potensi
            pengembangan kapasitas masyarakat
          </p>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <BarChart
                data={pendidikanData.map((d) => ({
                  name: d.key,
                  jumlah: d.value,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="jumlah"
                  name="Jumlah Penduduk"
                  fill="#FFD700"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

      {/* Status Pernikahan */}
      <section>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {t("penduduk.pernikahan.title")}
          </h3>
          <p className="text-center text-gray-600 mb-4 max-w-4xl mx-auto">
            {t("penduduk.pernikahan.description")}
          </p>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
              <p className="text-sm text-pink-800">
                💕 <strong>Did You Know:</strong> Status pernikahan mempengaruhi
                struktur sosial dan pola kehidupan bermasyarakat, serta menjadi
                indikator stabilitas keluarga di desa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            {pernikahanData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.key}
                value={item.value}
                updatedAt={item.updated_at}
              />
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Status Pernikahan Penduduk
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Komposisi status pernikahan yang memberikan gambaran struktur sosial
            dan dinamika keluarga di masyarakat
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-full md:max-w-[500px] h-[300px] md:h-[450px] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pernikahanData.map((d) => ({
                      name: d.key,
                      value: d.value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={window.innerWidth < 768 ? 70 : 100}
                    fill="#8884d8"
                  >
                    {pernikahanData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

      {/* Agama */}
      <section>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {t("penduduk.agama.title")}
          </h3>
          <p className="text-center text-gray-600 mb-4 max-w-4xl mx-auto">
            {t("penduduk.agama.description")}
          </p>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
              <p className="text-sm text-indigo-800">
                🕌 <strong>Keberagaman:</strong> Pluralitas agama mencerminkan
                toleransi dan harmoni antar umat beragama, menjadi kekuatan
                sosial dalam membangun persatuan masyarakat desa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {agamaData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.key}
                value={item.value}
                updatedAt={item.updated_at}
              />
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Komposisi Keagamaan
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Keragaman kepercayaan yang menunjukkan toleransi beragama dan
            harmoni sosial dalam masyarakat multikultural
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-full md:max-w-[500px] h-[300px] md:h-[450px] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agamaData.map((d) => ({
                      name: d.key,
                      value: d.value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={window.innerWidth < 768 ? 70 : 100}
                    fill="#8884d8"
                  >
                    {agamaData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

      {/* Kelompok Usia */}
      <section>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {t("penduduk.usia.title")}
          </h3>
          <p className="text-center text-gray-600 mb-4 max-w-4xl mx-auto">
            {t("penduduk.usia.description")}
          </p>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-green-800">
                👥 <strong>Bonus Demografi:</strong> Struktur usia penduduk
                menentukan potensi bonus demografi dan kebutuhan layanan publik
                yang harus disediakan pemerintah desa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {usiaData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.key}
                value={item.value}
                updatedAt={item.updated_at}
              />
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Distribusi Kelompok Usia
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Piramida usia yang menunjukkan potensi demografis dan perencanaan
            pembangunan berkelanjutan
          </p>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <AreaChart
                data={usiaData.map((d) => ({ name: d.key, value: d.value }))}
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
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Jumlah Penduduk"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorAge)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      {/* Wajib Pilih */}
      <section>
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {t("penduduk.wajibPilih.title")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("penduduk.wajibPilih.description")}
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700">
                  🗳️ <strong>Partisipasi Politik:</strong> Jumlah pemilih
                  menunjukkan tingkat partisipasi demokratis dan pengaruh desa
                  dalam proses politik nasional.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wajibPilihData.map((item, idx) => (
                  <StatCard
                    key={idx}
                    icon={item.icon}
                    label={item.key}
                    value={item.value}
                    updatedAt={item.updated_at}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* Distribusi Dusun */}
      <section>
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {t("penduduk.dusun.title")}
          </h3>
          <p className="text-center text-gray-600 mb-4 max-w-4xl mx-auto">
            {t("penduduk.dusun.description")}
          </p>
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
              <p className="text-sm text-teal-800">
                🗺️ <strong>Pemerataan Wilayah:</strong> Distribusi penduduk per
                dusun mempengaruhi alokasi anggaran pembangunan infrastruktur
                dan pelayanan publik di setiap wilayah.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {dusunData.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                label={item.key}
                value={item.value}
                updatedAt={item.updated_at}
              />
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Sebaran Penduduk Per Dusun
          </h4>
          <p className="text-center text-gray-600 mb-8">
            Distribusi geografis yang menentukan pola pembangunan dan prioritas
            pengembangan infrastruktur wilayah
          </p>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <BarChart
                data={dusunData.map((d) => ({ name: d.key, jumlah: d.value }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="jumlah"
                  name="Jumlah Penduduk"
                  fill="#8884d8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
    </div>
  );
}
