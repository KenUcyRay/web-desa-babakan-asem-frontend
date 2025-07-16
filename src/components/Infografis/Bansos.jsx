export default function Bansos() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-poppins text-gray-800">🤝 Bantuan Sosial Desa</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Daftar Penerima Bantuan</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Jenis Bantuan</th>
              <th className="p-3 border">Periode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border">Siti Aminah</td>
              <td className="p-3 border">BLT Dana Desa</td>
              <td className="p-3 border">Januari - Maret 2025</td>
            </tr>
            <tr>
              <td className="p-3 border">Budi Santoso</td>
              <td className="p-3 border">PKH</td>
              <td className="p-3 border">Tahap 1 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}