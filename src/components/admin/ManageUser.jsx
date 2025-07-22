import { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaUserShield,
  FaExchangeAlt,
} from "react-icons/fa";
import Pagination from "../ui/Pagination";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showPromoteForm, setShowPromoteForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // ✅ Ambil semua admin
  const fetchUsers = async () => {
    const response = await UserApi.getAllUsers(currentPage, 10);
    const resBody = await response.json();
    if (!response.ok) {
      alertError("Gagal mengambil data pengguna.");
      return;
    }
    setUsers(resBody.users);
    setCurrentPage(resBody.page);
    setTotalPages(resBody.total_page);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // ✅ Tambah Admin Baru
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!(await alertConfirm("Yakin tambah admin baru?"))) return;

    if (form.confirm_password !== form.password) {
      return alertError("Konfirmasi password tidak cocok!");
    }

    const response = await UserApi.createAdmin(form);
    const resBody = await response.json();

    if (!response.ok) {
      let errorMessage = "Gagal menambah admin.";
      if (resBody.error) {
        errorMessage = Array.isArray(resBody.error)
          ? resBody.error.map((err) => (err.path ? `${err.path[0]}: ${err.message}` : err.message)).join(", ")
          : resBody.error;
      }
      return alertError(errorMessage);
    }

    setUsers([...users, resBody.user]);
    setShowAddForm(false);
    setForm({ name: "", email: "", password: "", confirm_password: "" });
    await alertSuccess("✅ Admin berhasil ditambahkan!");
  };

  // ✅ Turunkan Admin → User
  const adminToUser = async (admin) => {
    if (!(await alertConfirm(`Ubah ${admin.name} menjadi user biasa?`))) return;

    const response = await UserApi.updateRoleById(admin.id, "REGULAR");
    const resBody = await response.json();

    if (!response.ok) {
      let errorMessage = "Gagal mengubah role.";
      if (resBody.error) {
        errorMessage = Array.isArray(resBody.error)
          ? resBody.error.map((err) => (err.path ? `${err.path[0]}: ${err.message}` : err.message)).join(", ")
          : resBody.error;
      }
      return alertError(errorMessage);
    }

    setUsers(users.filter((u) => u.id !== admin.id));
    alertSuccess(`${resBody.user.name} berhasil diubah menjadi user regular.`);
  };

  // ✅ Naikkan User → Admin
  const handlePromoteUser = async (e) => {
    e.preventDefault();
    if (!(await alertConfirm("Yakin ubah user ini menjadi admin?"))) return;

    const formData = new FormData(e.target);
    const userId = formData.get("userId");

    const response = await UserApi.updateRoleById(userId, "ADMIN");
    const resBody = await response.json();

    if (!response.ok) {
      let errorMessage = "Gagal mempromosikan user.";
      if (resBody.error) {
        errorMessage = Array.isArray(resBody.error)
          ? resBody.error.map((err) => (err.path ? `${err.path[0]}: ${err.message}` : err.message)).join(", ")
          : resBody.error;
      }
      return alertError(errorMessage);
    }

    setUsers([...users, resBody.user]);
    alertSuccess(`${resBody.user.name} berhasil menjadi admin.`);
    setShowPromoteForm(false);
    e.target.reset();
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* ✅ Header + Tombol */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-green-500" /> Kelola Akun Admin
        </h1>

        <div className="flex gap-2">
          {/* Tombol Tambah Admin */}
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowPromoteForm(false);
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            <FaUserPlus /> Tambah Admin
          </button>

          {/* Tombol Ubah User → Admin */}
          <button
            onClick={() => {
              setShowPromoteForm(!showPromoteForm);
              setShowAddForm(false);
            }}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
          >
            <FaExchangeAlt /> User → Admin
          </button>
        </div>
      </div>

      {/* ✅ Form Tambah Admin */}
      {showAddForm && (
        <form
          onSubmit={handleAddAdmin}
          className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-700">Tambah Admin Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nama"
              className="border p-2 rounded"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="border p-2 rounded"
              required
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* ✅ Form Promote User */}
      {showPromoteForm && (
        <form
          onSubmit={handlePromoteUser}
          className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-700">
            Ubah User Menjadi Admin
          </h2>
          <input
            type="text"
            name="userId"
            placeholder="Masukkan ID User"
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowPromoteForm(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Promote
            </button>
          </div>
        </form>
      )}

      {/* ✅ Tabel Admin */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center w-36">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <FaUserShield /> Admin
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => adminToUser(user)}
                    className="px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                    title="Turunkan ke User"
                  >
                    <FaExchangeAlt />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  Belum ada admin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
