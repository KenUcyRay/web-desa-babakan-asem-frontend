import berita1 from "../assets/berita1.jpeg";

export default function SidebarProduk() {
  return (
    <div className="space-y-6">
      {/* Produk Lainnya */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Produk Lainnya</h2>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center mb-4">
            <img
              src={berita1}
              alt="produk"
              className="w-12 h-12 object-cover rounded mr-3"
            />
            <div>
              <p className="text-sm font-semibold">Produk {i}</p>
              <p className="text-xs text-gray-500">Rp {i}0.000</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
