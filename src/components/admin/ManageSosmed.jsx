import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

export default function ManageSosmed() {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formType, setFormType] = useState("lokasi");
  const [formValue, setFormValue] = useState("");
  const [formLabel, setFormLabel] = useState("");

  // Dummy data for testing
  const dummyData = [
    {
      id: 1,
      type: "lokasi",
      value: "Jl. Raya Babakan Asem No. 123, Kecamatan Cibinong, Kabupaten Bogor, Jawa Barat 16918",
      label: "Alamat Kantor Desa",
      icon: FaMapMarkerAlt,
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: 2,
      type: "telepon",
      value: "085330192025",
      label: "Nomor Telepon",
      icon: FaPhoneAlt,
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: 3,
      type: "whatsapp",
      value: "6285330192025",
      label: "WhatsApp",
      icon: FaWhatsapp,
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: 4,
      type: "email",
      value: "babakanasem@gmail.com",
      label: "Email Kantor",
      icon: FaEnvelope,
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
  ];

  const contactTypes = [
    {
      id: "lokasi",
      label: "Lokasi/Alamat",
      icon: FaMapMarkerAlt,
      placeholder: "Masukkan alamat lengkap",
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: "telepon",
      label: "Telepon",
      icon: FaPhoneAlt,
      placeholder: "Masukkan nomor telepon",
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: FaWhatsapp,
      placeholder: "Masukkan nomor WhatsApp",
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
    {
      id: "email",
      label: "Email",
      icon: FaEnvelope,
      placeholder: "Masukkan alamat email",
      iconColor: "text-gray-900",
      bgColor: "bg-gradient-to-br from-green-400 to-[#B6F500]",
    },
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setData(dummyData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const resetForm = () => {
    setFormType("lokasi");
    setFormValue("");
    setFormLabel("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValue.trim() || !formLabel.trim()) {
      alert("Mohon lengkapi semua field");
      return;
    }

    // Validate based on type
    if (formType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValue)) {
        alert("Format email tidak valid");
        return;
      }
    } else if (formType === "telepon" || formType === "whatsapp") {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formValue)) {
        alert("Format nomor telepon tidak valid");
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingId) {
        // Update existing
        const updatedData = data.map((item) =>
          item.id === editingId
            ? {
                ...item,
                type: formType,
                value: formValue,
                label: formLabel,
                icon: contactTypes.find((t) => t.id === formType)?.icon || FaMapMarkerAlt,
                iconColor: contactTypes.find((t) => t.id === formType)?.iconColor || "text-gray-900",
                bgColor: contactTypes.find((t) => t.id === formType)?.bgColor || "bg-gradient-to-br from-green-400 to-[#B6F500]",
              }
            : item
        );
        setData(updatedData);
        alertSuccess("Kontak berhasil diperbarui!");
      } else {
        // Create new
        const newContact = {
          id: Date.now(),
          type: formType,
          value: formValue,
          label: formLabel,
          icon: contactTypes.find((t) => t.id === formType)?.icon || FaMapMarkerAlt,
          iconColor: contactTypes.find((t) => t.id === formType)?.iconColor || "text-gray-900",
          bgColor: contactTypes.find((t) => t.id === formType)?.bgColor || "bg-gradient-to-br from-green-400 to-[#B6F500]",
        };
        setData([...data, newContact]);
        alertSuccess("Kontak berhasil ditambahkan!");
      }
      
      resetForm();
      setShowForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (item) => {
    setFormType(item.type);
    setFormValue(item.value);
    setFormLabel(item.label);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
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
      const updatedData = data.filter((d) => d.id !== item.id);
      setData(updatedData);
      alertSuccess("Kontak berhasil dihapus!");
    }
  };

  const isTypeDisabled = (type) => {
    return data.some((item) => item.type === type && item.id !== editingId);
  };

  const LoadingSpinner = ({ className }) => (
    <svg
      className={`${className} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      ></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      ></path>
    </svg>
  );

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-gray-800">
          <FaEnvelope className="text-3xl text-green-600" />
          <h1 className="text-2xl font-bold">Kelola Kontak & Lokasi</h1>
        </div>
        {data.length < 4 && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5"
          >
            <FaPlus /> Tambah Kontak
          </button>
        )}
      </div>



      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FaEnvelope />
                {editingId ? "Edit Kontak" : "Tambah Kontak"}
              </h2>
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }} 
                className="text-white hover:text-gray-200 transition"
              >
                <FaTimes size={22} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pilih Jenis Kontak:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contactTypes.map((type) => {
                      const Icon = type.icon;
                      const disabled = isTypeDisabled(type.id);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => setFormType(type.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formType === type.id
                              ? "border-green-500 bg-green-50 text-green-800 shadow-lg"
                              : disabled
                              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                              : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Icon className={`w-6 h-6 ${disabled ? "text-gray-400" : ""}`} />
                            <span className="text-sm font-medium">{type.label}</span>
                            {disabled && (
                              <span className="text-xs text-red-500">Sudah ada</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Label/Nama:</label>
                    <input 
                      type="text" 
                      value={formLabel} 
                      onChange={(e) => setFormLabel(e.target.value)} 
                      placeholder="Contoh: Alamat Kantor Desa"
                      className="w-full border rounded-lg p-3" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {contactTypes.find((t) => t.id === formType)?.label}:
                    </label>
                    <input 
                      type={formType === "email" ? "email" : formType === "telepon" || formType === "whatsapp" ? "tel" : "text"}
                      value={formValue} 
                      onChange={(e) => setFormValue(e.target.value)} 
                      placeholder={contactTypes.find((t) => t.id === formType)?.placeholder}
                      className="w-full border rounded-lg p-3" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }} 
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Menyimpan..." : (editingId ? "Simpan" : "Tambah")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* GRID KONTAK */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center items-center gap-4">
              <LoadingSpinner className="w-8 h-8 text-green-600" />
              <span className="text-gray-600 font-medium">Memuat data...</span>
            </div>
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-5 rounded-full">
                <FaEnvelope className="text-4xl text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Belum Ada Kontak
            </h3>
            <p className="text-gray-500">Tidak ada kontak ditemukan</p>
          </div>
        )}

        {!isLoading && data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border-l-4 border-l-green-500">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bgColor} ${item.iconColor}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-1 text-gray-800">
                  {item.label}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {item.value}
                </p>
              </div>
              <div className="flex justify-between p-4 border-t text-sm">
                <button 
                  onClick={() => handleEdit(item)} 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(item)} 
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
