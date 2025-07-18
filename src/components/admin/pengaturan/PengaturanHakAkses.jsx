import { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { FaUserShield, FaTrash, FaUserTag } from "react-icons/fa";

export default function PengaturanHakAkses() {
  const [users, setUsers] = useState([
    { id: 1, nama: "Admin Utama", role: "Admin" },
    { id: 2, nama: "User Biasa", role: "User" },
  ]);

  const hapusUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const ubahRole = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u
      )
    );
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Hak Akses</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nama</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.nama}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => ubahRole(u.id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded flex items-center gap-1"
                    >
                      <FaUserTag /> Ubah Role
                    </button>
                    <button
                      onClick={() => hapusUser(u.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded flex items-center gap-1"
                    >
                      <FaTrash /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
