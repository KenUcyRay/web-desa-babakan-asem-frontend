import { useState, useEffect } from "react";
import pana from "../../../assets/pana.png";
import {
  FaMale,
  FaFemale,
  FaChild,
  FaHome,
  FaEdit,
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
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { alertError, alertSuccess } from "../../../libs/alert";
import { Helper } from "../../../utils/Helper";

// Custom Tooltip with values
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        <p className="text-blue-600">{`Jumlah: ${payload[0].value} orang`}</p>
      </div>
    );
  }
  return null;
};

// Custom Label for Pie Chart
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
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
    >
      {`${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

export default function ManagePenduduk() {
  // State untuk setiap tipe data
  const [genderData, setGenderData] = useState([]);
  const [kepalaKeluargaData, setKepalaKeluargaData] = useState([]);
  const [anakAnakData, setAnakAnakData] = useState([]);
  const [pernikahanData, setPernikahanData] = useState([]);
  const [agamaData, setAgamaData] = useState([]);
  const [usiaData, setUsiaData] = useState([]);
  const [pekerjaanData, setPekerjaanData] = useState([]);
  const [pendidikanData, setPendidikanData] = useState([]);
  const [wajibPilihData, setWajibPilihData] = useState([]);
  const [dusunData, setDusunData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [jumlahBaru, setJumlahBaru] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0); // Trigger untuk force re-render

  // Function untuk mengurutkan data
  const sortData = (data, type) => {
    const mapped = data.map((item) => ({
      ...item,
      icon: getIconForCategory(type, item.key),
    }));

    const sortOrders = {
      PENDIDIKAN: ["sd", "smp", "sma", "diploma", "d3", "s1", "s2", "s3"],
      GENDER: (a, b) => {
        const [aKey, bKey] = [a.key.toLowerCase(), b.key.toLowerCase()];
        if (aKey.includes("laki") || aKey === "male") return -1;
        if (bKey.includes("laki") || bKey === "male") return 1;
        return 0;
      },
      USIA: (a, b) => {
        const [aMatch, bMatch] = [a.key.match(/(\d+)/), b.key.match(/(\d+)/)];
        return aMatch && bMatch
          ? parseInt(aMatch[1]) - parseInt(bMatch[1])
          : a.key.localeCompare(b.key);
      },
      DUSUN: (a, b) => {
        const [aMatch, bMatch] = [
          a.key.match(/([a-z])/),
          b.key.match(/([a-z])/),
        ];
        return aMatch && bMatch
          ? aMatch[1].localeCompare(bMatch[1])
          : a.key.localeCompare(b.key);
      },
    };

    if (Array.isArray(sortOrders[type])) {
      const order = sortOrders[type];
      return mapped.sort((a, b) => {
        const [aIndex, bIndex] = [
          order.indexOf(a.key.toLowerCase()),
          order.indexOf(b.key.toLowerCase()),
        ];
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.key.localeCompare(b.key);
      });
    }

    return sortOrders[type] ? mapped.sort(sortOrders[type]) : mapped;
  };

  const baseUrl =
    import.meta.env.VITE_NEW_BASE_URL || "http://localhost:4000/api";
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
  const tooltipFormatter = (value) => [`${value} orang`, "Jumlah"];
  const allData = [
    ...genderData,
    ...kepalaKeluargaData,
    ...anakAnakData,
    ...pernikahanData,
    ...agamaData,
    ...usiaData,
    ...pekerjaanData,
    ...pendidikanData,
    ...wajibPilihData,
    ...dusunData,
  ];

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
      KEPALA_KELUARGA: { default: <FaHome /> },
      WAJIB_PILIH: { default: <FaVoteYea /> },
      DUSUN: { default: <FaMapMarkerAlt /> },
      ANAK_ANAK: { default: <FaChild /> },
      USIA: { default: <FaChild /> },
    };

    const categoryIcons = iconMappings[type];
    if (!categoryIcons) return <FaChild />;
    return (
      categoryIcons[key.toLowerCase()] || categoryIcons.default || <FaChild />
    );
  };

  // Function untuk fetch data berdasarkan type
  const fetchDataByType = async (type) => {
    try {
      const response = await fetch(`${baseUrl}/residents?type=${type}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  const chartData = allData.map((item) => ({
    name: item.key,
    jumlah: item.value,
  }));

  const handleEdit = (item) => {
    setEditingData(item);
    setJumlahBaru(item.value.toString());
    setShowForm(true);
  };

  const handleSave = async () => {
    const jumlah = parseInt(jumlahBaru);
    if (isNaN(jumlah) || jumlah < 0) {
      alertError("Jumlah harus angka positif!");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/admin/residents/${editingData.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ value: jumlah }),
        }
      );

      if (!response.ok) throw new Error("Failed to update data");

      // ✅ Ambil response dari backend
      const result = await response.json();
      const updatedItem = result.data;

      // ✅ Update state langsung dengan data terbaru dari backend
      const updateStateFunction = (setter) => {
        setter((prevData) =>
          prevData.map((item) =>
            item.id === updatedItem.id
              ? {
                  ...item,
                  value: updatedItem.value,
                  updated_at: updatedItem.updated_at,
                  icon: getIconForCategory(editingData.type, updatedItem.key),
                }
              : item
          )
        );
      };

      const stateUpdaters = {
        GENDER: setGenderData,
        KEPALA_KELUARGA: setKepalaKeluargaData,
        ANAK_ANAK: setAnakAnakData,
        PERNIKAHAN: setPernikahanData,
        AGAMA: setAgamaData,
        USIA: setUsiaData,
        PERKERJAAN: setPekerjaanData,
        PENDIDIKAN: setPendidikanData,
        WAJIB_PILIH: setWajibPilihData,
        DUSUN: setDusunData,
      };

      if (stateUpdaters[editingData.type]) {
        updateStateFunction(stateUpdaters[editingData.type]);
      }

      // ✅ Juga refetch semua data biar konsisten
      await fetchPenduduk();

      setShowForm(false);
      setEditingData(null);
      setJumlahBaru("");
      setUpdateTrigger((prev) => prev + 1);
      alertSuccess("Data berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating data:", error);
      alertError("Gagal mengupdate data penduduk!");
    }
  };

  const fetchPenduduk = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        gender,
        kepalaKeluarga,
        anakAnak,
        pernikahan,
        agama,
        usia,
        pekerjaan,
        pendidikan,
        wajibPilih,
        dusun,
      ] = await Promise.all([
        fetchDataByType("GENDER"),
        fetchDataByType("KEPALA_KELUARGA"),
        fetchDataByType("ANAK_ANAK"),
        fetchDataByType("PERNIKAHAN"),
        fetchDataByType("AGAMA"),
        fetchDataByType("USIA"),
        fetchDataByType("PERKERJAAN"),
        fetchDataByType("PENDIDIKAN"),
        fetchDataByType("WAJIB_PILIH"),
        fetchDataByType("DUSUN"),
      ]);

      setGenderData(sortData(gender, "GENDER"));
      setKepalaKeluargaData(sortData(kepalaKeluarga, "KEPALA_KELUARGA"));
      setAnakAnakData(sortData(anakAnak, "ANAK_ANAK"));
      setPernikahanData(sortData(pernikahan, "PERNIKAHAN"));
      setAgamaData(sortData(agama, "AGAMA"));
      setUsiaData(sortData(usia, "USIA"));
      setPekerjaanData(sortData(pekerjaan, "PERKERJAAN"));
      setPendidikanData(sortData(pendidikan, "PENDIDIKAN"));
      setWajibPilihData(sortData(wajibPilih, "WAJIB_PILIH"));
      setDusunData(sortData(dusun, "DUSUN"));
    } catch (error) {
      console.error("Error fetching penduduk data:", error);
      setError("Gagal mengambil data penduduk");
      alertError("Gagal mengambil data penduduk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenduduk();
  }, []);

  // Komponen Card yang dapat digunakan kembali
  const DataCard = ({ item, index, color = "#B6F500" }) => (
    <div
      key={`${item.type}-${item.id}-${updateTrigger}-${index}`}
      className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
    >
      <div className={`text-3xl mb-2`} style={{ color }}>
        {item.icon}
      </div>
      <p className="text-gray-600 text-xs text-center mb-1">{item.key}</p>
      <p className="text-lg font-bold text-gray-800">{item.value}</p>
      {item.updated_at && (
        <p className="mt-1 text-xs text-gray-400">
          Diperbarui: {Helper.formatTanggal(item.updated_at)}
        </p>
      )}
      <button
        onClick={() => handleEdit(item)}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
      >
        <FaEdit className="text-sm" />
      </button>
    </div>
  );

  // Komponen Section yang dapat digunakan kembali
  const DataSection = ({
    title,
    data,
    color,
    chartType = "bar",
    gridCols = "md:grid-cols-3",
  }) => {
    if (!data.length) return null;

    const chartData = data.map((d) => ({
      name: d.key,
      jumlah: d.value,
      value: d.value,
    }));

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className={`grid sm:grid-cols-2 ${gridCols} gap-4 mb-8`}>
          {data.map((item, index) => (
            <DataCard key={item.id} item={item} index={index} color={color} />
          ))}
        </div>
        <ResponsiveContainer
          width="100%"
          height={chartType === "pie" ? 400 : 350}
        >
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          ) : chartType === "area" ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAgeManage" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#colorAgeManage)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="jumlah"
                name="Jumlah Penduduk"
                fill={color}
                barSize={35}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Kelola Infografis Penduduk
          </h2>
          <p className="text-gray-600 mt-2 text-justify">
            Data demografi Desa Babakan, Anda bisa memperbarui jumlah kategori
            penduduk sesuai kondisi terkini.
          </p>
        </div>
        <img
          src={pana}
          alt="Ilustrasi Penduduk"
          className="w-full max-w-md mx-auto drop-shadow-md"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Memuat data penduduk...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p>{error}</p>
          <button
            onClick={fetchPenduduk}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Data Utama - Gender, Kepala Keluarga, Anak-anak */}
      {!loading &&
        !error &&
        (genderData.length > 0 ||
          kepalaKeluargaData.length > 0 ||
          anakAnakData.length > 0) && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Data Utama Penduduk
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...genderData, ...kepalaKeluargaData, ...anakAnakData].map(
                (item, index) => (
                  <DataCard
                    key={item.id}
                    item={item}
                    index={index}
                    color="#B6F500"
                  />
                )
              )}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Grafik Data Utama Penduduk
              </h4>
              <p className="text-center text-gray-600 mb-8">
                Distribusi data utama penduduk berdasarkan gender, kepala
                keluarga, dan anak-anak
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[
                    ...genderData,
                    ...kepalaKeluargaData,
                    ...anakAnakData,
                  ].map((d) => ({ name: d.key, jumlah: d.value }))}
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
        )}

      {/* Sections menggunakan komponen DataSection */}
      <DataSection
        title="Data Pekerjaan"
        data={pekerjaanData}
        color="#FF69B4"
      />
      <DataSection
        title="Data Pendidikan"
        data={pendidikanData}
        color="#FFD700"
        gridCols="md:grid-cols-4"
      />
      <DataSection
        title="Status Pernikahan"
        data={pernikahanData}
        color="#87CEEB"
        chartType="pie"
      />
      <DataSection
        title="Data Agama"
        data={agamaData}
        color="#32CD32"
        gridCols="md:grid-cols-4"
        chartType="pie"
      />
      <DataSection
        title="Kelompok Usia"
        data={usiaData}
        color="#FF6347"
        chartType="area"
      />
      <DataSection title="Pemilih" data={wajibPilihData} color="#9370DB" />
      <DataSection title="Distribusi Dusun" data={dusunData} color="#20B2AA" />

      {/* Modal Edit */}
      {showForm && editingData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">
              Edit Jumlah - {editingData.key}
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Penduduk
            </label>
            <input
              type="number"
              value={jumlahBaru}
              onChange={(e) => setJumlahBaru(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              min="0"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingData(null);
                  setJumlahBaru("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
