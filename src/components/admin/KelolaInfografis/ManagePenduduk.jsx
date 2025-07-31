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

  const baseUrl =
    import.meta.env.VITE_NEW_BASE_URL || "http://localhost:4000/api";

  // Colors untuk pie chart
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

  // Tooltip formatter function
  const tooltipFormatter = (value) => [`${value} orang`, "Jumlah"];

  // Gabungkan semua data untuk tampilan
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
    setJumlahBaru(item.value);
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
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage
              .getItem("token")
              ?.slice(1, -1)}`,
          },
          body: JSON.stringify({ value: jumlah }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      // Ambil data response dari API
      const responseData = await response.json();
      console.log("Full Response:", responseData);

      // Check apakah responseData.data ada
      const updatedData = responseData.data || responseData;
      console.log("Updated Data:", updatedData);
      console.log("Editing Data:", editingData);
      console.log("New Value from input:", jumlah);

      // Function untuk update data berdasarkan tipe
      const updateStateFunction = (setter) => {
        console.log(`Updating state for type: ${editingData.type}`);
        setter((prev) => {
          const newState = prev.map((item) => {
            if (item.id === editingData.id) {
              const updatedItem = {
                ...item,
                value: jumlah, // Gunakan langsung nilai dari input, bukan dari response
                updated_at: updatedData.updated_at || new Date().toISOString(),
                key: updatedData.key || item.key,
                icon: getIconForCategory(
                  editingData.type,
                  updatedData.key || item.key
                ),
              };
              console.log("Updated item:", updatedItem);
              return updatedItem;
            }
            return item;
          });
          console.log("New state:", newState);
          return newState;
        });
      };

      // Update data lokal berdasarkan tipe
      switch (editingData.type) {
        case "GENDER":
          updateStateFunction(setGenderData);
          break;
        case "KEPALA_KELUARGA":
          updateStateFunction(setKepalaKeluargaData);
          break;
        case "ANAK_ANAK":
          updateStateFunction(setAnakAnakData);
          break;
        case "PERNIKAHAN":
          updateStateFunction(setPernikahanData);
          break;
        case "AGAMA":
          updateStateFunction(setAgamaData);
          break;
        case "USIA":
          updateStateFunction(setUsiaData);
          break;
        case "PERKERJAAN":
          updateStateFunction(setPekerjaanData);
          break;
        case "PENDIDIKAN":
          updateStateFunction(setPendidikanData);
          break;
        case "WAJIB_PILIH":
          updateStateFunction(setWajibPilihData);
          break;
        case "DUSUN":
          updateStateFunction(setDusunData);
          break;
        default:
          console.warn("Unknown data type:", editingData.type);
      }

      alertSuccess("Data berhasil diperbarui!");
      setShowForm(false);
      setEditingData(null);
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
                (item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    <div className="text-3xl text-[#B6F500] mb-2">
                      {item.icon}
                    </div>
                    <p className="text-gray-600 text-xs text-center mb-1">
                      {item.key}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {item.value}
                    </p>
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
                )
              )}
            </div>

            {/* Grafik Data Utama */}
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
        )}

      {/* Pekerjaan */}
      {!loading && !error && pekerjaanData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Data Pekerjaan
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {pekerjaanData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#FF69B4] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
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
            ))}
          </div>

          {/* Grafik Pekerjaan */}
          <ResponsiveContainer width="100%" height={350}>
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
      )}

      {/* Pendidikan */}
      {!loading && !error && pendidikanData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Data Pendidikan
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {pendidikanData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#FFD700] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
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
            ))}
          </div>

          {/* Grafik Pendidikan */}
          <ResponsiveContainer width="100%" height={350}>
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
      )}

      {/* Status Pernikahan */}
      {!loading && !error && pernikahanData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Status Pernikahan
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {pernikahanData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#87CEEB] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
                {item.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
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
            ))}
          </div>

          {/* Grafik Status Pernikahan */}
          <ResponsiveContainer width="100%" height={400}>
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
                outerRadius={80}
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
      )}

      {/* Agama */}
      {!loading && !error && agamaData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Data Agama</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {agamaData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#32CD32] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
                {item.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
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
            ))}
          </div>

          {/* Grafik Data Agama */}
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={agamaData.map((d) => ({ name: d.key, value: d.value }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
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
      )}

      {/* Kelompok Usia */}
      {!loading && !error && usiaData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Kelompok Usia
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {usiaData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#FF6347] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
                {item.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
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
            ))}
          </div>

          {/* Grafik Kelompok Usia */}
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={usiaData.map((d) => ({ name: d.key, value: d.value }))}
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
          </ResponsiveContainer>
        </div>
      )}

      {/* Wajib Pilih */}
      {!loading && !error && wajibPilihData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Pemilih</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {wajibPilihData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#9370DB] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
                {item.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
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
            ))}
          </div>

          {/* Grafik Pemilih */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={wajibPilihData.map((d) => ({
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
                fill="#9370DB"
                barSize={35}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Distribusi Dusun */}
      {!loading && !error && dusunData.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Distribusi Dusun
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {dusunData.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="relative flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="text-3xl text-[#20B2AA] mb-2">{item.icon}</div>
                <p className="text-gray-600 text-xs text-center mb-1">
                  {item.key}
                </p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
                {item.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
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
            ))}
          </div>

          {/* Grafik Distribusi Dusun */}
          <ResponsiveContainer width="100%" height={350}>
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
                fill="#20B2AA"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
