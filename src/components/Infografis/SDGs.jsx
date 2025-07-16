import cuate from "../../assets/cuate.png"; // ✅ Fix path
import { FaLeaf, FaWater, FaLightbulb } from "react-icons/fa";

export default function SDGs() {
  const data = [
    { icon: <FaLeaf />, label: "Lingkungan Bersih", value: "80%" },
    { icon: <FaWater />, label: "Air Bersih", value: "90%" },
    { icon: <FaLightbulb />, label: "Energi Terbarukan", value: "60%" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul + Gambar */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">SDGs Desa</h2>
          <p className="mt-2 text-gray-600">
            Indikator pembangunan berkelanjutan di Desa Babakan Asem.
          </p>
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* Grid Indikator */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow"
          >
            <div className="text-3xl text-[#B6F500]">{item.icon}</div>
            <p className="text-gray-600 mt-2">{item.label}</p>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
