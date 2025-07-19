import { useEffect, useState } from "react";
import { UserApi } from "../../libs/api/UserApi";
import { alertError, alertSuccess, alertConfirm } from "../../libs/alert";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Helper } from "../../utils/Helper";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { logout, setAdminStatus } = useAuth();

  const fetchProfile = async () => {
    const response = await UserApi.getUserProfile();
    if (!response.ok) {
      alertError("Gagal mengambil profil pengguna.");
      return;
    }
    const responseBody = await response.json();
    setUser(responseBody.user);
  };

  const handleLogout = async () => {
    const confirm = await alertConfirm("Apakah Anda yakin ingin keluar?");
    if (!confirm) return;

    setAdminStatus(false);
    logout();
    await alertSuccess("Anda telah keluar.");
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirm = await alertConfirm(
      "❌ Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan!"
    );
    if (!confirm) return;

    const response = await UserApi.deleteUser(user.id);
    if (!response.ok) {
      const responseBody = await response.json();
      let errorMessage = "Gagal Menghapus.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
    }

    console.log(response);
    setAdminStatus(false);
    logout();
    await alertSuccess("Akun berhasil dihapus.");
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Memuat profil...
      </div>
    );
  }

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
            <span>ID Pengguna</span>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-gray-800">{user.id}</span>
              <button
                className="text-xs text-green-600 underline"
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  alertSuccess("ID berhasil disalin ke clipboard");
                }}
              >
                Salin
              </button>
            </div>
          </div>
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
            <span className="font-medium text-gray-800">
              {Helper.formatTanggal(user.created_at)}
            </span>
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
