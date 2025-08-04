import { useEffect, useState } from "react";
import { FaUserPlus, FaUserShield, FaExchangeAlt } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";
import Pagination from "../ui/Pagination";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { UserApi } from "../../libs/api/UserApi";
import { Helper } from "../../utils/Helper";

export default function ManageUser() {
  const { t, i18n } = useTranslation();
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

  // State for promote form
  const [promoteToRole, setPromoteToRole] = useState("ADMIN");

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
  }, [currentPage, i18n.language]);

  // Updated function to handle adding account with selected role
  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (
      !(await alertConfirm(
        `Apakah Anda yakin ingin menambah akun dengan role ${form.role}?`
      ))
    )
      return;

    if (form.confirm_password !== form.password) {
      return alertError(t("manageUser.alerts.passwordMismatch"));
    }

    const response = await UserApi.createAdmin(form, i18n.language);
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

  const adminToUser = async (admin) => {
    const confirmMessage = t("manageUser.alerts.confirmDemoteAdmin", {
      name: admin.name,
      interpolation: { escapeValue: false },
    });

    if (!(await alertConfirm(confirmMessage))) return;

    try {
      const response = await UserApi.updateRoleById(
        admin.id,
        "REGULAR",
        i18n.language
      );
      const resBody = await response.json();
      if (!response.ok)
        throw new Error(
          resBody.error || t("manageUser.alerts.changeRoleError")
        );

      setUsers(users.filter((u) => u.id !== admin.id));

      const successMessage = t("manageUser.alerts.demoteSuccess", {
        name: resBody.user.name,
        interpolation: { escapeValue: false },
      });
      alertSuccess(successMessage);
    } catch (err) {
      alertError(err.message);
    }
  };

  // Updated promote user function
  const handlePromoteUser = async (e) => {
    e.preventDefault();

    if (
      !(await alertConfirm(
        `Apakah Anda yakin ingin mengubah role menjadi ${promoteToRole}?`
      ))
    )
      return;

    const formData = new FormData(e.target);
    const userId = formData.get("userId");

    try {
      const response = await UserApi.updateRoleById(
        userId,
        promoteToRole,
        i18n.language
      );
      const resBody = await response.json();
      if (!response.ok)
        throw new Error(resBody.error || "Gagal mengubah role user");

      setUsers((prevUsers) => {
        const filtered = prevUsers.filter((u) => u.id !== resBody.user.id);
        return [...filtered, resBody.user];
      });

      alertSuccess(`User berhasil diubah menjadi ${promoteToRole}`);
      setShowPromoteForm(false);
      e.target.reset();
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
        return <FaUserShield />;
      default:
        return <FaUserShield />;
    }
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* - Header + Tombol */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-green-500" /> {t("manageUser.title")}
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowPromoteForm(false);
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            <FaUserPlus /> Tambah Akun
          </button>

          <button
            onClick={() => {
              setShowPromoteForm(!showPromoteForm);
              setShowAddForm(false);
            }}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            <FaExchangeAlt /> Ubah Role User
          </button>
        </div>
      </div>

      {/* - Form Tambah Akun */}
      {showAddForm && (
        <form
          onSubmit={handleAddAccount}
          className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-700">
            Tambah Akun Baru
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Role:
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              {t("manageUser.buttons.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
            >
              {t("manageUser.buttons.save")}
            </button>
          </div>
        </form>
      )}

      {/* - Form Ubah Role User */}
      {showPromoteForm && (
        <form
          onSubmit={handlePromoteUser}
          className="bg-white p-4 mb-4 rounded-lg shadow space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-700">
            Ubah Role User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              className="border p-2 rounded"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubah ke Role:
              </label>
              <select
                value={promoteToRole}
                onChange={(e) => setPromoteToRole(e.target.value)}
                className="border p-2 rounded w-full"
                required
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
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowPromoteForm(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              {t("manageUser.buttons.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Ubah Role
            </button>
          </div>
        </form>
      )}

      {/* - Table Desktop */}
      <div className="bg-white rounded-xl shadow overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">{t("manageUser.table.headers.number")}</th>
              <th className="p-4">{t("manageUser.table.headers.name")}</th>
              <th className="p-4">{t("manageUser.table.headers.email")}</th>
              <th className="p-4">{t("manageUser.table.headers.role")}</th>
              <th className="p-4 text-center w-36">
                {t("manageUser.table.headers.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  {user.role && user.role !== "REGULAR" && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {user.role && user.role !== "REGULAR" && (
                    <button
                      onClick={() => adminToUser(user)}
                      className="px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      title="Jadikan User Biasa"
                    >
                      <FaExchangeAlt />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {t("manageUser.table.empty")}
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
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <p className="font-bold text-gray-800">
              {index + 1}. {user.name}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.role && user.role !== "REGULAR" && (
              <>
                <p className="text-green-600 flex items-center gap-1 font-semibold">
                  {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                </p>
                <button
                  onClick={() => adminToUser(user)}
                  className="mt-2 w-full px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                >
                  <FaExchangeAlt className="inline mr-1" /> Jadikan User Biasa
                </button>
              </>
            )}
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center text-gray-500">
            {t("manageUser.table.empty")}
          </p>
        )}
      </div>

      {/* - Pagination */}
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
