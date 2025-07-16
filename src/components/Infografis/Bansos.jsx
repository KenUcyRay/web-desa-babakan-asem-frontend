export default function Bansos() {
  const data = [
    { nama: "BLT Dana Desa", penerima: 50 },
    { nama: "Bantuan Pangan", penerima: 70 },
    { nama: "PKH", penerima: 40 },
    { nama: "Rastra", penerima: 30 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      <h2 className="text-3xl font-bold text-gray-800">Data Bantuan Sosial</h2>
      <p className="mt-2 text-gray-600">Daftar bantuan sosial yang diterima warga desa.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6 mt-8">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow flex justify-between">
            <div>
              <p className="font-semibold text-gray-800">{item.nama}</p>
              <p className="text-gray-500 text-sm">Jumlah Penerima</p>
            </div>
            <span className="text-xl font-bold text-[#B6F500]">{item.penerima}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
