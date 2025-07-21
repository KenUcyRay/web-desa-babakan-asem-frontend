import { useState } from "react";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Pagination from "../ui/Pagination";

export default function ManageUser() {
  const defaultUsers = [
    { id: 1, nama: "Admin Utama", email: "admin@desa.id", role: "admin" },
    { id: 2, nama: "Petugas Agenda", email: "petugas@desa.id", role: "admin" },
    { id: 3, nama: "Sekretaris", email: "sekretaris@desa.id", role: "admin" },
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // ✅ Pagination versi komponen
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleAddUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      id: Date.now(),
      nama: form.nama.value,
      email: form.email.value,
      role: form.role.value,
    };
    setUsers([...users, newUser]);
    setShowAddForm(false);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedUser = {
      ...editData,
      nama: form.nama.value,
      email: form.email.value,
      role: form.role.value,
    };

    setUsers(users.map((u) => (u.id === editData.id ? updatedUser : u)));
    setEditData(null);
    setShowEditForm(false);
  };

  const handleEditClick = (user) => {
    setEditData(user);
    setShowEditForm(true);
  };

  const handleDelete = (id) => {
    const isDefault = defaultUsers.some((u) => u.id === id);
    if (isDefault) {
      alert("Akun bawaan tidak dapat dihapus!");
      return;
    }
    if (window.confirm("Yakin mau hapus akun ini?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      {/* Konten Utama */}
      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserShield className="text-green-500" /> Kelola Akun Admin & User
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            <FaUserPlus /> Tambah Akun
          </button>
        </div>

        {/* ✅ Form Tambah User */}
        {showAddForm && (
          <form
            onSubmit={handleAddUser}
            className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              Tambah Akun Baru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="nama"
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
              <select name="role" className="border p-2 rounded" required>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
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

        {/* ✅ Form Edit User */}
        {showEditForm && editData && (
          <form
            onSubmit={handleEditUser}
            className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              Edit Akun - {editData.nama}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="nama"
                defaultValue={editData.nama}
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={editData.email}
                className="border p-2 rounded"
                required
              />
              <select
                name="role"
                defaultValue={editData.role}
                className="border p-2 rounded"
                required
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update
              </button>
            </div>
          </form>
        )}

        {/* ✅ Tabel User */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers
                .filter((user) => user.role === "admin")
                .map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {user.nama}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      {user.role === "admin" ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <FaUserShield /> Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <FaUser /> User
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {users.filter((u) => u.role === "admin").length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    Belum ada admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination pakai komponen yang biasa kamu pakai */}
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
