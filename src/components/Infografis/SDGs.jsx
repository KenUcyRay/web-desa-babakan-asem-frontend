import { useEffect, useState } from "react";
import cuate from "../../assets/cuate.png";
import {
  FaLeaf,
  FaWater,
  FaLightbulb,
  FaHeartbeat,
  FaBook,
  FaDollarSign,
  FaIndustry,
  FaCity,
  FaBalanceScale,
  FaGlobeAmericas,
  FaHandshake,
  FaUniversity,
  FaRecycle,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";

export default function SDGs() {
  const data = [
    { icon: <FaHeartbeat />, label: "1. Tanpa Kemiskinan", value: "75%" },
    { icon: <FaLeaf />, label: "2. Tanpa Kelaparan", value: "80%" },
    {
      icon: <FaHeartbeat />,
      label: "3. Kesehatan & Kesejahteraan",
      value: "85%",
    },
    { icon: <FaBook />, label: "4. Pendidikan Berkualitas", value: "90%" },
    { icon: <FaUsers />, label: "5. Kesetaraan Gender", value: "70%" },
    { icon: <FaWater />, label: "6. Air Bersih & Sanitasi", value: "92%" },
    {
      icon: <FaLightbulb />,
      label: "7. Energi Bersih & Terjangkau",
      value: "65%",
    },
    {
      icon: <FaDollarSign />,
      label: "8. Pekerjaan Layak & Ekonomi",
      value: "78%",
    },
    { icon: <FaIndustry />, label: "9. Infrastruktur & Inovasi", value: "68%" },
    {
      icon: <FaBalanceScale />,
      label: "10. Mengurangi Ketimpangan",
      value: "60%",
    },
    {
      icon: <FaCity />,
      label: "11. Kota & Komunitas Berkelanjutan",
      value: "74%",
    },
    {
      icon: <FaRecycle />,
      label: "12. Konsumsi Bertanggung Jawab",
      value: "81%",
    },
    { icon: <FaGlobeAmericas />, label: "13. Aksi Iklim", value: "77%" },
    { icon: <FaWater />, label: "14. Ekosistem Lautan", value: "69%" },
    { icon: <FaSeedling />, label: "15. Ekosistem Daratan", value: "83%" },
    { icon: <FaHandshake />, label: "16. Perdamaian & Keadilan", value: "88%" },
    {
      icon: <FaUniversity />,
      label: "17. Kemitraan untuk Tujuan",
      value: "72%",
    },
  ];

  const [sdg, setSdg] = useState([]);

  const fetchSdg = async () => {
    const response = await InfografisApi.getSdg();
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data SDGs.");
      return;
    }
    setSdg(responseBody.sdg);
  };

  useEffect(() => {
    fetchSdg();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul + Gambar */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">SDGs Desa</h2>
          <p className="mt-2 text-gray-600">
            17 Tujuan Pembangunan Berkelanjutan di Desa Babakan Asem.
          </p>
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* Grid 17 Tujuan */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            <div className="text-3xl text-[#B6F500]">{item.icon}</div>
            <p className="text-gray-600 mt-2 text-center">{item.label}</p>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
