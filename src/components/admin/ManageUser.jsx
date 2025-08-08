import { useEffect, useState } from "react";
import { FaUserPlus, FaUserShield, FaExchangeAlt, FaCog } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";
import { Helper } from "../../utils/Helper";

export default function ManageUser() {
  const { i18n } = useTranslation();
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
    role: "ADMIN",
  });

  // Role options
  const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "PKK", label: "PKK" },
    { value: "KARANG_TARUNA", label: "Karang Taruna" },
    { value: "BPD", label: "BPD" },
    { value: "CONTRIBUTOR", label: "Contributor" },
  ];

  // State for dropdowns
  const [promoteUserId, setPromoteUserId] = useState("");
  const [promoteToRole, setPromoteToRole] = useState("ADMIN");
  const [openDropdowns, setOpenDropdowns] = useState({});

  const fetchUsers = async () => {
    const response = await UserApi.getAllUsers(currentPage, 10, i18n.language);
    const resBody = await response.json();
    if (!response.ok) return;
    setUsers(resBody.data);
    setCurrentPage(resBody.current_page);
    setTotalPages(resBody.total_page);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Toggle dropdown
  const toggleDropdown = (userId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  // Handle add account
  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (
      !(await alertConfirm(
        `Apakah Anda yakin ingin menambah akun dengan role ${
          form.role === "KARANG_TARUNA" ? "KARANG TARUNA" : form.role
        }?`
      ))
    )
      return;

    const response = await UserApi.createAdmin(form);
    const resBody = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(resBody);
      return;
    }
    await fetchUsers();
    setShowAddForm(false);
    setForm({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "REGULAR",
    });
    await alertSuccess(`Akun ${form.role} berhasil ditambahkan`);
  };

  // Handle role change
  const changeUserRole = async (userId, newRole) => {
    if (
      !(await alertConfirm(
        `Apakah Anda yakin ingin mengubah role user menjadi ${
          newRole === "KARANG_TARUNA" ? "KARANG TARUNA" : newRole
        }?`
      ))
    )
      return;

    try {
      const response = await UserApi.updateRoleById(userId, newRole);
      const resBody = await response.json();
      if (!response.ok) {
        throw new Error(resBody.error || "Gagal mengubah role user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alertSuccess(
        `Role user berhasil diubah menjadi ${
          newRole === "KARANG_TARUNA" ? "KARANG TARUNA" : newRole
        }`
      );
      closeAllDropdowns();
    } catch (err) {
      alertError(err.message);
    }
  };

  // Handle promote user form submission
  const handlePromoteUser = async (e) => {
    e.preventDefault();

    if (!promoteUserId) {
      return alertError("Silakan masukkan ID User terlebih dahulu");
    }

    if (
      !(await alertConfirm(
        `Apakah Anda yakin ingin mengubah role user menjadi ${
          promoteToRole === "KARANG_TARUNA" ? "KARANG TARUNA" : promoteToRole
        }?`
      ))
    )
      return;

    try {
      const response = await UserApi.updateRoleById(
        promoteUserId,
        promoteToRole
      );
      const resBody = await response.json();
      if (!response.ok) {
        await Helper.errorResponseHandler(resBody);
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === promoteUserId ? { ...user, role: promoteToRole } : user
        )
      );

      alertSuccess(
        `Role user berhasil diubah menjadi ${
          promoteToRole === "KARANG_TARUNA" ? "KARANG TARUNA" : promoteToRole
        }`
      );
      setShowPromoteForm(false);
      setPromoteUserId("");
    } catch (err) {
      alertError(err.message);
    }
  };

  // Function to get role display name
  const getRoleDisplayName = (role) => {
    const roleOption = roleOptions.find((option) => option.value === role);
    return roleOption ? roleOption.label : role;
  };

  // Function to get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <FaUserShield className="text-blue-500" />;
      case "PKK":
        return <FaUserShield className="text-purple-500" />;
      case "KARANG_TARUNA":
        return <FaUserShield className="text-orange-500" />;
      case "BPD":
        return <FaUserShield className="text-green-500" />;
      case "CONTRIBUTOR":
        return <FaUserShield className="text-teal-500" />;
      default:
        return <FaUserShield className="text-gray-500" />;
    }
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* - Header + Tombol */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-green-500" /> Kelola Pengguna
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowPromoteForm(false);
              closeAllDropdowns();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaUserPlus /> Tambah Akun
          </button>

          <button
            onClick={() => {
              setShowPromoteForm(!showPromoteForm);
              setShowAddForm(false);
              closeAllDropdowns();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaExchangeAlt /> Ubah Role User
          </button>
        </div>
      </div>

      {/* - Form Tambah Akun */}
      {showAddForm && (
        <form
          onSubmit={handleAddAccount}
          className="bg-white p-6 mb-6 rounded-2xl shadow-xl border border-green-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserPlus className="text-green-500" /> Tambah Akun Baru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                placeholder="Nama"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm({ ...form, confirm_password: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Role:
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-md transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* - Form Ubah Role User */}
      {showPromoteForm && (
        <form
          onSubmit={handlePromoteUser}
          className="bg-white p-6 mb-6 rounded-2xl shadow-xl border border-yellow-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaExchangeAlt className="text-yellow-500" /> Ubah Role User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Masukkan ID User:
              </label>
              <input
                type="text"
                value={promoteUserId}
                onChange={(e) => setPromoteUserId(e.target.value)}
                placeholder="Masukkan ID User"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                ID User bisa dilihat di kolom pertama tabel
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubah ke Role:
              </label>
              <select
                value={promoteToRole}
                onChange={(e) => setPromoteToRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500"
              >
                {roleOptions
                  .filter((option) => option.value !== "REGULAR")
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() => {
                setShowPromoteForm(false);
                setPromoteUserId("");
              }}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium shadow-md transition-all"
            >
              Ubah Role
            </button>
          </div>
        </form>
      )}

      {/* - Table Desktop */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <tr>
              <th className="p-4 font-semibold rounded-tl-2xl">No</th>
              <th className="p-4 font-semibold">Nama</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-center rounded-tr-2xl w-40">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-green-50 transition-colors"
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  {user.role && user.role !== "REGULAR" && (
                    <span className="flex items-center gap-2 font-medium">
                      {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {user.role && user.role !== "REGULAR" && (
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
                      >
                        <FaCog />
                      </button>

                      {openDropdowns[user.id] && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                          <div className="py-1">
                            <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                              Ubah Role
                            </div>
                            {roleOptions
                              .filter(
                                (option) =>
                                  option.value !== "REGULAR" &&
                                  option.value !== user.role
                              )
                              .map((option) => (
                                <button
                                  key={option.value}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() =>
                                    changeUserRole(user.id, option.value)
                                  }
                                >
                                  Ubah ke {option.label}
                                </button>
                              ))}
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                              onClick={() => changeUserRole(user.id, "REGULAR")}
                            >
                              Jadikan User Biasa
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  Belum ada pengguna yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* - Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-gray-500">{index + 1}.</span>{" "}
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              </div>

              {user.role && user.role !== "REGULAR" && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(user.id)}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  >
                    <FaCog />
                  </button>

                  {openDropdowns[user.id] && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                          Ubah Role
                        </div>
                        {roleOptions
                          .filter(
                            (option) =>
                              option.value !== "REGULAR" &&
                              option.value !== user.role
                          )
                          .map((option) => (
                            <button
                              key={option.value}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                changeUserRole(user.id, option.value)
                              }
                            >
                              Ubah ke {option.label}
                            </button>
                          ))}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                          onClick={() => changeUserRole(user.id, "REGULAR")}
                        >
                          Jadikan User Biasa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user.role && user.role !== "REGULAR" && (
              <p className="mt-3 flex items-center gap-2 font-medium">
                {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
              </p>
            )}
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Belum ada pengguna yang ditambahkan.
          </p>
        )}
      </div>

      {/* - Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
