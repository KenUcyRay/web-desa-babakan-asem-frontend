import { useState } from "react";
import { FaUserPlus, FaEdit, FaTrash, FaUserShield, FaUser } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import ModalUserForm from "./ModalUserForm";

export default function ManageUser() {
  const [users, setUsers] = useState([
    { id: 1, nama: "Admin Utama", email: "admin@desa.id", role: "admin" },
    { id: 2, nama: "Petugas Agenda", email: "petugas@desa.id", role: "admin" },
    { id: 3, nama: "Warga Babakan", email: "warga@desa.id", role: "user" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSaveUser = (data) => {
    if (editData) {
      // ✅ Edit user lama
      setUsers(users.map((u) => (u.id === editData.id ? { ...data, id: u.id } : u)));
    } else {
      // ✅ Tambah user baru
      const newUser = { ...data, id: Date.now() };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setEditData(null);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            <FaUserPlus /> Tambah Akun
          </button>
        </div>

        {/* Tabel User tanpa foto */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{user.nama}</td>
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
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(user)}
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
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    Belum ada akun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit User */}
      {showModal && (
        <ModalUserForm
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSaveUser}
          editData={editData}
        />
      )}
    </div>
  );
}
