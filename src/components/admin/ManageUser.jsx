import { useEffect, useState } from "react";
import { FaUserPlus, FaUserShield, FaExchangeAlt } from "react-icons/fa";
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

  const fetchUsers = async () => {
    try {
      const response = await UserApi.getAllUsers(currentPage, 10);
      const resBody = await response.json();
      if (!response.ok) throw new Error("Gagal mengambil data pengguna");
      setUsers(resBody.users);
      setCurrentPage(resBody.page);
      setTotalPages(resBody.total_page);
    } catch (err) {
      alertError("Gagal mengambil data pengguna!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!(await alertConfirm("Yakin tambah admin baru?"))) return;

    if (form.confirm_password !== form.password) {
      return alertError("Konfirmasi password tidak cocok!");
    }

    try {
      const response = await UserApi.createAdmin(form);
      const resBody = await response.json();
      if (!response.ok) throw new Error(resBody.error || "Gagal menambah admin");

      setUsers([...users, resBody.user]);
      setShowAddForm(false);
      setForm({ name: "", email: "", password: "", confirm_password: "" });
      alertSuccess("Admin berhasil ditambahkan!");
    } catch (err) {
      alertError(err.message);
    }
  };

  const adminToUser = async (admin) => {
    if (!(await alertConfirm(`Ubah ${admin.name} menjadi user biasa?`))) return;

    try {
      const response = await UserApi.updateRoleById(admin.id, "REGULAR");
      const resBody = await response.json();
      if (!response.ok) throw new Error(resBody.error || "Gagal mengubah role");

      setUsers(users.filter((u) => u.id !== admin.id));
      alertSuccess(`${resBody.user.name} sekarang jadi user biasa.`);
    } catch (err) {
      alertError(err.message);
    }
  };

  const handlePromoteUser = async (e) => {
    e.preventDefault();
    if (!(await alertConfirm("Yakin ubah user ini menjadi admin?"))) return;

    const formData = new FormData(e.target);
    const userId = formData.get("userId");

    try {
      const response = await UserApi.updateRoleById(userId, "ADMIN");
      const resBody = await response.json();
      if (!response.ok)
        throw new Error(resBody.error || "Gagal mempromosikan user");

      setUsers([...users, resBody.user]);
      alertSuccess(`${resBody.user.name} sekarang jadi admin.`);
      setShowPromoteForm(false);
      e.target.reset();
    } catch (err) {
      alertError(err.message);
    }
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* ✅ Header + Tombol */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-green-500" /> Kelola Akun Admin
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowPromoteForm(false);
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            <FaUserPlus /> Tambah Admin
          </button>

          <button
            onClick={() => {
              setShowPromoteForm(!showPromoteForm);
              setShowAddForm(false);
            }}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow text-sm"
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
          <h2 className="text-lg font-semibold text-gray-700">
            Tambah Admin Baru
          </h2>
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
              onChange={(e) =>
                setForm({ ...form, confirm_password: e.target.value })
              }
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

      {/* ✅ Table Desktop */}
      <div className="bg-white rounded-xl shadow overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse min-w-[700px]">
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

      {/* ✅ Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {users.map((user, index) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow space-y-2">
            <p className="font-bold text-gray-800">
              {index + 1}. {user.name}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-green-600 flex items-center gap-1 font-semibold">
              <FaUserShield /> Admin
            </p>
            <button
              onClick={() => adminToUser(user)}
              className="mt-2 w-full px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
            >
              <FaExchangeAlt className="inline mr-1" /> Turunkan ke User
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center text-gray-500">Belum ada admin.</p>
        )}
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
