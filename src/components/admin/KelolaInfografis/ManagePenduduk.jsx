import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { getAuthHeaders } from "../../../libs/api/authHelpers";

// Custom Tooltip with values
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        <p className="text-blue-600">{`Jumlah: ${payload[0].value} Orang`}</p>
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
  const { t } = useTranslation();

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [jumlahBaru, setJumlahBaru] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [createFormData, setCreateFormData] = useState({
    type: "",
    key: "",
    value: "",
  });
  const [availableKeys, setAvailableKeys] = useState([]);

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
  const tooltipFormatter = (value) => [`${value} Orang`, "Jumlah"];
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
      const response = await fetch(`${baseUrl}/residents?type=${type}`, {
        method: "GET",

        headers: getAuthHeaders("id"),
      });
      if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
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

  const handleCreate = (type) => {
    setCreateFormData({ type, key: "", value: "" });
    setAvailableKeys(getAvailableKeysForType(type));
    setShowCreateForm(true);
  };

  const getAvailableKeysForType = (type) => {
    const allKeys = {
      GENDER: ["laki-laki", "perempuan"],
      PERNIKAHAN: ["menikah", "belum menikah", "cerai"],
      AGAMA: ["islam", "kristen", "hindu", "buddha", "katolik"],
      PENDIDIKAN: ["sd", "smp", "sma", "diploma", "d3", "s1", "s2", "s3"],
      PERKERJAAN: [
        "petani",
        "nelayan",
        "guru",
        "pedagang",
        "pegawai",
        "wiraswasta",
        "pns",
        "tni/polri",
      ],
      USIA: [
        "0-5 tahun",
        "6-12 tahun",
        "13-17 tahun",
        "18-25 tahun",
        "26-35 tahun",
        "36-45 tahun",
        "46-55 tahun",
        "56-65 tahun",
        "65+ tahun",
      ],
      DUSUN: ["Dusun A", "Dusun B", "Dusun C", "Dusun D"],
      KEPALA_KELUARGA: ["kepala keluarga"],
      WAJIB_PILIH: ["wajib pilih"],
      ANAK_ANAK: ["anak-anak"],
    };

    const existingKeys = allData
      .filter((item) => item.type === type)
      .map((item) => item.key);
    return allKeys[type]?.filter((key) => !existingKeys.includes(key)) || [];
  };

  const handleCreateSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/residents`, {
        method: "POST",

        headers: getAuthHeaders("id"),
        body: JSON.stringify({
          type: createFormData.type,
          key: createFormData.key,
          value: parseInt(createFormData.value),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        await fetchPenduduk();
        alertSuccess("Data berhasil ditambahkan");
        setShowCreateForm(false);
        setCreateFormData({ type: "", key: "", value: "" });
      } else {
        if (result.error === "DUPLICATE_ENTRY") {
          alertError("Data ini sudah ada. Silakan edit yang sudah ada.");
        } else {
          await Helper.errorResponseHandler(result);
        }
      }
    } catch (error) {
      await Helper.errorResponseHandler(error);
    }
  };

  const handleSave = async () => {
    const jumlah = parseInt(jumlahBaru);

    try {
      const response = await fetch(
        `${baseUrl}/admin/residents/${editingData.id}`,
        {
          method: "PATCH",

          headers: getAuthHeaders("id"),
          body: JSON.stringify({ value: jumlah }),
        }
      );

      if (!response.ok) throw new Error(await response.json());

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
      alertSuccess("Data berhasil diperbarui");
    } catch (error) {
      await Helper.errorResponseHandler(error);
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
      await Helper.errorResponseHandler(error);
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
      className="relative flex flex-col items-center bg-white p-3 sm:p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
    >
      <div className={`text-3xl mb-2`} style={{ color }}>
        {item.icon}
      </div>
      <p className="text-gray-600 text-xs text-center mb-1 truncate max-w-full">{item.key}</p>
      <p className="text-base sm:text-lg font-bold text-gray-800">{item.value}</p>
      {item.updated_at && (
        <p className="mt-1 text-xs text-gray-400">
          Diperbarui: {Helper.formatTanggal(item.updated_at)}
        </p>
      )}
      <button
        onClick={() => handleEdit(item)}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 cursor-pointer"
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
    const hasData = data.length > 0;

    const chartData = data.map((d) => ({
      name: d.key,
      jumlah: d.value,
      value: d.value,
    }));

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        {hasData ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3 sm:gap-4 mb-6 sm:mb-8`}>
            {data.map((item, index) => (
              <DataCard key={item.id} item={item} index={index} color={color} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data {title.toLowerCase()} tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Data akan muncul setelah diinput
            </p>
          </div>
        )}
        {hasData && (
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
                  <linearGradient
                    id="colorAgeManage"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 font-poppins bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Kelola Infografis Penduduk
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 text-justify">
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
      {!loading && !error && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Data Utama Penduduk
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleCreate('GENDER')}
                  className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                >
                  + Gender
                </button>
                <button
                  onClick={() => handleCreate('KEPALA_KELUARGA')}
                  className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600 cursor-pointer whitespace-nowrap"
                >
                  + KK
                </button>
                <button
                  onClick={() => handleCreate('ANAK_ANAK')}
                  className="px-2 sm:px-3 py-1 bg-purple-500 text-white rounded text-xs sm:text-sm hover:bg-purple-600 cursor-pointer whitespace-nowrap"
                >
                  + Anak
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
              <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
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

      {/* Sections menggunakan komponen DataSection - Selalu tampil */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Data Pekerjaan</h3>
          <button
            onClick={() => handleCreate('PERKERJAAN')}
            className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Pekerjaan
          </button>
        </div>
        {pekerjaanData.length > 0 ? (
          <DataSection title="" data={pekerjaanData} color="#FF69B4" />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data pekerjaan tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Pekerjaan" untuk menambah data
            </p>
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Data Pendidikan</h3>
          <button
            onClick={() => handleCreate('PENDIDIKAN')}
            className="px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Pendidikan
          </button>
        </div>
        {pendidikanData.length > 0 ? (
          <DataSection
            title=""
            data={pendidikanData}
            color="#FFD700"
            gridCols="md:grid-cols-4"
          />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data pendidikan tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Pendidikan" untuk menambah data
            </p>
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Status Pernikahan
          </h3>
          <button
            onClick={() => handleCreate('PERNIKAHAN')}
            className="px-3 sm:px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Pernikahan
          </button>
        </div>
        {pernikahanData.length > 0 ? (
          <DataSection
            title=""
            data={pernikahanData}
            color="#87CEEB"
            chartType="pie"
          />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data pernikahan tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Pernikahan" untuk menambah data
            </p>
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Data Agama</h3>
          <button
            onClick={() => handleCreate('AGAMA')}
            className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Agama
          </button>
        </div>
        {agamaData.length > 0 ? (
          <DataSection
            title=""
            data={agamaData}
            color="#32CD32"
            gridCols="md:grid-cols-4"
            chartType="pie"
          />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data agama tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Agama" untuk menambah data
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Kelompok Usia</h3>
          <button
            onClick={() => handleCreate('USIA')}
            className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Usia
          </button>
        </div>
        {usiaData.length > 0 ? (
          <DataSection
            title=""
            data={usiaData}
            color="#FF6347"
            chartType="area"
          />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data usia tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Usia" untuk menambah data
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Distribusi Dusun</h3>
          <button
            onClick={() => handleCreate('DUSUN')}
            className="px-3 sm:px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            + Tambah Dusun
          </button>
        </div>
        {dusunData.length > 0 ? (
          <DataSection title="" data={dusunData} color="#20B2AA" />
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-lg">
              Tidak ada data dusun tersedia
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "+ Tambah Dusun" untuk menambah data
            </p>
          </div>
        )}
      </div>

      {/* Modal Edit */}
      {showForm && editingData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Edit Jumlah - {editingData.key}
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah penduduk:
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Tambah Data {createFormData.type}
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Kategori:
            </label>
            <select
              value={createFormData.key}
              onChange={(e) =>
                setCreateFormData((prev) => ({ ...prev, key: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Pilih...</option>
              {availableKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah:
            </label>
            <input
              type="number"
              value={createFormData.value}
              onChange={(e) =>
                setCreateFormData((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              className="w-full p-2 border rounded mb-4"
              min="0"
              placeholder="Masukkan jumlah"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateFormData({ type: "", key: "", value: "" });
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSave}
                disabled={!createFormData.key || !createFormData.value}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
