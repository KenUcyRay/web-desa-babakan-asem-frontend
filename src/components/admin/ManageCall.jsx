import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaPhone, FaWhatsapp } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { RiCustomerService2Fill, RiAdminFill } from "react-icons/ri";
import { MdLocalHospital, MdSupportAgent } from "react-icons/md";
import { BsShieldCheck, BsTelephone } from "react-icons/bs";
import Pagination from "../ui/Pagination";
import { CallCenterApi } from "../../libs/api/CallcenterApi";
import Swal from "sweetalert2";

export default function ManageCall() {
  const [calls, setCalls] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    type: "CALL_CENTER",
    icon: "customer_service",
    color: "text-blue-500",
    is_active: true,
  });

  const kategoriList = [
    { key: "Semua", label: "Semua" },
    { key: "CALL_CENTER", label: "Call Center" },
    { key: "WHATSAPP", label: "WhatsApp" },
  ];

  const statusList = [
    { key: "Semua", label: "Semua Status" },
    { key: "Aktif", label: "Aktif" },
    { key: "Nonaktif", label: "Nonaktif" },
  ];

  const iconOptions = [
    { key: "customer_service", label: "Customer Service", icon: <RiCustomerService2Fill />, color: "text-blue-500" },
    { key: "admin", label: "Admin", icon: <RiAdminFill />, color: "text-purple-500" },
    { key: "hospital", label: "Rumah Sakit/Puskesmas", icon: <MdLocalHospital />, color: "text-red-500" },
    { key: "police", label: "Polisi", icon: <BsShieldCheck />, color: "text-blue-600" },
    { key: "support", label: "Support/Bantuan", icon: <MdSupportAgent />, color: "text-green-500" },
    { key: "phone", label: "Telepon Umum", icon: <BsTelephone />, color: "text-gray-600" },
    { key: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp />, color: "text-green-500" },
  ];

  const getIconComponent = (iconKey) => {
    const option = iconOptions.find((o) => o.key === iconKey);
    return option ? option.icon : <FiPhoneCall />;
  };

  const getIconColor = (iconKey) => {
    const option = iconOptions.find((o) => o.key === iconKey);
    return option ? option.color : "text-gray-600";
  };

  const formatNumberForBackend = (number) => {
    let num = number.replace(/\s+/g, "");
    if (num.startsWith("+62")) return "0" + num.slice(3);
    if (num.startsWith("62")) return "0" + num.slice(2);
    if (num.startsWith("8")) return "0" + num;
    return num;
  };

  const fetchData = async () => {
    try {
      const res = await CallCenterApi.get(currentPage, 6);
      setCalls(res.data);
      setTotalPages(res.total_page);
      
      // Dispatch event untuk memberitahu FloatingMenu bahwa data telah diupdate
      window.dispatchEvent(new CustomEvent('callCenterUpdated'));
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengambil data call center',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Filter data berdasarkan kategori dan status
  const filteredCalls = calls.filter((call) => {
    const matchesCategory = kategori === "Semua" || call.type === kategori;
    const matchesStatus = statusFilter === "Semua" || 
                         (statusFilter === "Aktif" && call.is_active) ||
                         (statusFilter === "Nonaktif" && !call.is_active);
    return matchesCategory && matchesStatus;
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      number: "",
      type: "CALL_CENTER",
      icon: "customer_service",
      color: "text-blue-500",
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const call = calls.find((c) => c.id === id);
    if (!call) return;
    setEditingId(id);
    setFormData({
      name: call.name,
      number: call.number,
      type: call.type || "CALL_CENTER",
      icon: call.icon || "customer_service",
      color: call.color || "text-blue-500",
      is_active: call.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Yakin ingin menghapus kontak ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await CallCenterApi.delete(id);
        fetchData();
        
        // Dispatch event untuk memberitahu FloatingMenu bahwa data telah diupdate
        window.dispatchEvent(new CustomEvent('callCenterUpdated'));
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kontak berhasil dihapus',
          confirmButtonColor: '#10B981'
        });
      } catch (err) {
        console.error("Error deleting contact:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menghapus kontak',
          confirmButtonColor: '#3B82F6'
        });
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await CallCenterApi.update(id, { is_active: !currentStatus });
      // Update state lokal untuk memberikan feedback langsung
      setCalls(prevCalls => 
        prevCalls.map(call => 
          call.id === id ? { ...call, is_active: !currentStatus } : call
        )
      );
      
      // Dispatch event untuk memberitahu FloatingMenu bahwa data telah diupdate
      window.dispatchEvent(new CustomEvent('callCenterUpdated'));
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Status berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error updating status:", err);
      fetchData();
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui status',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  useEffect(() => {
    if (formData.type === "WHATSAPP") {
      setFormData((prev) => ({
        ...prev,
        icon: "whatsapp",
        color: "text-green-500",
      }));
    } else if (formData.type === "CALL_CENTER" && formData.icon === "whatsapp") {
      // Jika berubah dari WhatsApp ke Call Center, reset ke icon default
      setFormData((prev) => ({
        ...prev,
        icon: "customer_service",
        color: "text-blue-500",
      }));
    }
  }, [formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedIcon = iconOptions.find((o) => o.key === formData.icon);
    const finalFormData = {
      ...formData,
      number: formatNumberForBackend(formData.number),
      color: selectedIcon ? selectedIcon.color : "text-gray-600",
    };
    
    console.log('Submitting data:', finalFormData); // Debug log
    
    try {
      if (editingId) {
        await CallCenterApi.update(editingId, finalFormData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kontak berhasil diperbarui',
          confirmButtonColor: '#10B981'
        });
      } else {
        await CallCenterApi.create(finalFormData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kontak berhasil ditambahkan',
          confirmButtonColor: '#10B981'
        });
      }
      setShowModal(false);
      fetchData();
      
      // Dispatch event untuk memberitahu FloatingMenu bahwa data telah diupdate
      window.dispatchEvent(new CustomEvent('callCenterUpdated'));
    } catch (err) {
      console.error("Error saving contact:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Gagal menyimpan kontak',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleIconChange = (iconKey) => {
    const selectedIcon = iconOptions.find((o) => o.key === iconKey);
    setFormData((prev) => ({
      ...prev,
      icon: iconKey,
      color: selectedIcon ? selectedIcon.color : "text-gray-600",
    }));
  };

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-gray-800">
          <FiPhoneCall className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold">Kelola Call Center & WhatsApp</h1>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
        >
          <FaPlus /> Tambah Kontak
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-2">
          {kategoriList.map((k) => (
            <button
              key={k.key}
              onClick={() => {
                setKategori(k.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                kategori === k.key
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-blue-50 text-gray-700"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        
        {/* Separator */}
        <div className="border-l border-gray-300 mx-2"></div>
        
        {/* Filter Status */}
        <div className="flex flex-wrap gap-2">
          {statusList.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setStatusFilter(s.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === s.key
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-green-50 text-gray-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID KONTAK */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalls.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-5 rounded-full">
                <FiPhoneCall className="text-4xl text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Belum Ada Kontak
            </h3>
            <p className="text-gray-500">Tidak ada kontak ditemukan</p>
          </div>
        )}

        {filteredCalls.map((call) => {
          // Pastikan icon dan color sesuai dengan data terbaru
          const iconColor = getIconColor(call.icon);
          const iconComponent = getIconComponent(call.icon);
          
          return (
          <div key={call.id} className={`bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border-l-4 ${call.is_active ? 'border-l-blue-500' : 'border-l-gray-400'} ${!call.is_active ? 'opacity-75' : ''}`}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-full bg-gray-50 ${iconColor}`}>
                  {iconComponent}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    call.type === "CALL_CENTER" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}>
                    {call.type === "CALL_CENTER" ? "Call Center" : "WhatsApp"}
                  </span>
                  
                  {/* Toggle Status Button */}
                  <button
                    onClick={() => handleToggleActive(call.id, call.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all transform hover:scale-105 border-2 ${
                      call.is_active 
                        ? "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 shadow-md" 
                        : "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 shadow-md"
                    }`}
                    title={`Klik untuk ${call.is_active ? 'nonaktifkan' : 'aktifkan'}`}
                  >
                    {call.is_active ? "✓ Aktif" : "✗ Nonaktif"}
                  </button>
                </div>
              </div>
              <h2 className={`text-lg font-semibold mb-1 ${call.is_active ? 'text-gray-800' : 'text-gray-500'}`}>
                {call.name}
              </h2>
              <p className={`text-sm font-mono mb-3 ${call.is_active ? 'text-gray-600' : 'text-gray-400'}`}>
                {call.number}
              </p>
            </div>
            <div className="flex justify-between p-4 border-t text-sm">
              <button 
                onClick={() => handleEdit(call.id)} 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
              >
                <FaEdit /> Edit
              </button>
              <button 
                onClick={() => handleDelete(call.id)} 
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
              >
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {filteredCalls.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FiPhoneCall />
                {editingId ? "Edit Kontak" : "Tambah Kontak"}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white hover:text-gray-200 transition"
              >
                <FaTimes size={22} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Kontak</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full border rounded-lg p-3" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nomor</label>
                    <input 
                      type="text" 
                      value={formData.number} 
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })} 
                      className="w-full border rounded-lg p-3" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipe</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                      className="w-full border rounded-lg p-3"
                    >
                      <option value="CALL_CENTER">Call Center</option>
                      <option value="WHATSAPP">WhatsApp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon</label>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full bg-gray-50 transition-all duration-200 ${getIconColor(formData.icon)}`}>
                        {getIconComponent(formData.icon)}
                      </div>
                      <select
                        value={formData.icon}
                        onChange={(e) => handleIconChange(e.target.value)}
                        className={`flex-1 border rounded-lg p-3 transition-opacity ${
                          formData.type === "WHATSAPP" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={formData.type === "WHATSAPP"}
                      >
                        {iconOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Preview icon akan berubah sesuai pilihan Anda
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingId ? "Simpan" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}