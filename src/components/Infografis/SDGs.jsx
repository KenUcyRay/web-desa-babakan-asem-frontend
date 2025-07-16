export default function SDGs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-poppins text-gray-800">🌍 SDGs Desa</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-600 mb-4">
          Target pembangunan berkelanjutan di Desa Babakan Asem:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-800">1. Desa Tanpa Kemiskinan</h3>
            <p className="text-gray-600 text-sm">Mengurangi angka kemiskinan melalui pemberdayaan ekonomi masyarakat.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-800">2. Desa Sehat & Sejahtera</h3>
            <p className="text-gray-600 text-sm">Peningkatan fasilitas kesehatan & sanitasi yang layak.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-800">3. Desa Peduli Lingkungan</h3>
            <p className="text-gray-600 text-sm">Konservasi alam dan pengelolaan sampah berbasis warga.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-800">4. Desa Berinovasi</h3>
            <p className="text-gray-600 text-sm">Pemanfaatan teknologi untuk pelayanan publik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
