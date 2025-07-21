import { useState } from "react";
import {
  FaUserPlus,
  FaUserShield,
  FaUser,
  FaExchangeAlt,
} from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";

export default function ManageUser() {
  const defaultUsers = [
    { id: 1, nama: "Admin Utama", email: "admin@desa.id", role: "admin" },
    { id: 2, nama: "Petugas Agenda", email: "petugas@desa.id", role: "admin" },
    { id: 3, nama: "Sekretaris", email: "sekretaris@desa.id", role: "admin" },
    { id: 4, nama: "Budi User", email: "budi@desa.id", role: "user" },
    { id: 5, nama: "Sinta User", email: "sinta@desa.id", role: "user" },
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPromoteForm, setShowPromoteForm] = useState(false);

  // ✅ Hanya tampilkan admin
  const adminsOnly = users.filter((u) => u.role === "admin");

  // ✅ Pagination khusus admin
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = adminsOnly.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(adminsOnly.length / itemsPerPage);

  // ✅ Tambah Admin Baru
  const handleAddAdmin = (e) => {
    e.preventDefault();
    const form = e.target;
    const password = form.password.value;
    const confirm = form.confirm_password.value;

    if (password !== confirm) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    const newUser = {
      id: Date.now(),
      nama: form.name.value,
      email: form.email.value,
      password: password,
      role: "admin",
    };

    setUsers([...users, newUser]);
    setShowAddForm(false);
    form.reset();
  };

  // ✅ Turunkan Admin → User (langsung hilang dari tabel)
  const adminToUser = (admin) => {
    if (window.confirm(`Ubah ${admin.nama} dari Admin menjadi User?`)) {
      setUsers(
        users.map((u) =>
          u.id === admin.id ? { ...u, role: "user" } : u
        )
      );
    }
  };

  // ✅ Naikkan User → Admin (pakai form ID)
  const handlePromoteUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const targetId = parseInt(form.userId.value, 10);

    const target = users.find((u) => u.id === targetId);

    if (!target) {
      alert("User dengan ID tersebut tidak ditemukan!");
      return;
    }

    if (target.role === "admin") {
      alert(`${target.nama} sudah admin.`);
      return;
    }

    // Ubah jadi admin
    setUsers(
      users.map((u) =>
        u.id === target.id ? { ...u, role: "admin" } : u
      )
    );
    alert(`${target.nama} berhasil diubah menjadi Admin.`);

    setShowPromoteForm(false);
    form.reset();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        {/* Header + Tombol */}
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
              <FaExchangeAlt /> Ubah User → Admin
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
                name="name"
                placeholder="Nama"
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-2 rounded"
                required
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Konfirmasi Password"
                className="border p-2 rounded"
                required
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

        {/* ✅ Form Ubah User → Admin */}
        {showPromoteForm && (
          <form
            onSubmit={handlePromoteUser}
            className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              Ubah User Menjadi Admin
            </h2>
            <div>
              <input
                type="number"
                name="userId"
                placeholder="Masukkan ID User"
                className="border p-2 rounded w-full"
                required
              />
            </div>
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
                Ubah ke Admin
              </button>
            </div>
          </form>
        )}

        {/* ✅ Tabel hanya Admin */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{admin.id}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {admin.nama}
                  </td>
                  <td className="p-4 text-gray-600">{admin.email}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <FaUserShield /> Admin
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => adminToUser(admin)}
                      className="px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      title="Ubah ke User"
                    >
                      <FaExchangeAlt />
                    </button>
                  </td>
                </tr>
              ))}
              {adminsOnly.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Belum ada admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination khusus admin */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
