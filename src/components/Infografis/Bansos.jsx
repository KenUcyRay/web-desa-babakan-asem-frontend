import { useEffect, useState } from "react";
import { InfografisApi } from "../../libs/api/InfografisApi";

export default function Bansos() {
  const [bansos, setBansos] = useState([]);

  const fetchBansos = async () => {
    const response = await InfografisApi.getBansos();
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data Bantuan Sosial.");
      return;
    }
    setBansos(responseBody.bansos);
  };
  useEffect(() => {
    fetchBansos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      <h2 className="text-3xl font-bold text-gray-800">Data Bantuan Sosial</h2>
      <p className="mt-2 text-gray-600">
        Daftar bantuan sosial yang diterima warga desa.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6 mt-8">
        {bansos.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow flex justify-between hover:shadow-md hover:-translate-y-1 transition"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-500 text-sm">Jumlah Penerima</p>
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
