export default function Profile() {
  // ✅ Dummy user biar bisa lihat tampilan dulu
  const user = {
    name: "Aufa Fa",
    email: "aufa@example.com",
    joined: "1 Januari 2024",
  };

  const handleLogout = () => {
    alert("🚀 Logout dummy! (belum terhubung auth)");
  };

  const handleDelete = () => {
    alert("❌ Hapus akun dummy! (belum terhubung API)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        {/* ✅ Header Profil */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
            {user.name.charAt(0)}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* ✅ Info Detail */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Nama Lengkap</span>
            <span className="font-medium text-gray-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-medium text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Bergabung</span>
            <span className="font-medium text-gray-800">{user.joined}</span>
          </div>
        </div>

        {/* ✅ Tombol Aksi */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-lg border border-red-400 text-red-500 font-semibold hover:bg-red-50 transition"
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
}
