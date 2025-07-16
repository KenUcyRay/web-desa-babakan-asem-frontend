// ✅ Penduduk.jsx
export default function Penduduk() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-poppins text-gray-800">📊 Data Penduduk Desa</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Jumlah Penduduk Berdasarkan Jenis Kelamin</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Kategori</th>
              <th className="p-3 border">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border">Laki-laki</td>
              <td className="p-3 border">1.234</td>
            </tr>
            <tr>
              <td className="p-3 border">Perempuan</td>
              <td className="p-3 border">1.189</td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="p-3 border">Total</td>
              <td className="p-3 border">2.423</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}