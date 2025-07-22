import { useEffect, useState } from "react";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaComments,
  FaUsers,
  FaStore,
  FaClipboardList,
  FaImage,
  FaTasks
} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { MessageApi } from "../../libs/api/MessageApi";
import { UserApi } from "../../libs/api/UserApi";
import { ProductApi } from "../../libs/api/ProductApi"; 
import { AdministrasiApi } from "../../libs/api/AdministrasiApi"; 
import { GaleryApi } from "../../libs/api/GaleryApi"; 
import { ProgramApi } from "../../libs/api/ProgramApi"; 
import { MemberApi } from "../../libs/api/MemberApi"; 
import { alertError } from "../../libs/alert";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const [bumdesPreview, setBumdesPreview] = useState([]);
  const [administrasiPreview, setAdministrasiPreview] = useState([]);
  const [galeriPreview, setGaleriPreview] = useState([]);
  const [pkkPreview, setPkkPreview] = useState([]);
  const [anggotaPreview, setAnggotaPreview] = useState([]);

  // ✅ DATA DEMO PENDUDUK (bisa fetch API kalau ada)
  const pendudukData = [
    { name: "Laki-laki", jumlah: 320 },
    { name: "Perempuan", jumlah: 340 },
    { name: "Kepala Keluarga", jumlah: 120 },
    { name: "Anak-anak", jumlah: 210 },
  ];

  const fetchNews = async () => {
    const res = await NewsApi.getOwnNews(1, 3);
    if (!res.ok) return alertError("Gagal ambil berita");
    const data = await res.json();
    setNews(data.news || []);
  };

  const fetchAgenda = async () => {
    const res = await AgendaApi.getOwnAgenda(1, 3);
    if (!res.ok) return alertError("Gagal ambil agenda");
    const data = await res.json();
    setAgenda(data.agenda || []);
  };

  const fetchMessages = async () => {
    const res = await MessageApi.getMessages("?page=1&limit=3");
    if (!res.ok) return alertError("Gagal ambil pesan");
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const fetchUsers = async () => {
    const res = await UserApi.getAllUsers(1, 3);
    if (!res.ok) return alertError("Gagal ambil user");
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchBumdesPreview = async () => {
    const res = await ProductApi.getOwnProducts(1, 3);
    if (!res.ok) return alertError("Gagal ambil produk BUMDes");
    const data = await res.json();
    setBumdesPreview(data.products || []);
  };

  const fetchAdministrasiPreview = async () => {
    try {
      const online = await AdministrasiApi.getOnline();
      const layanan = await AdministrasiApi.getLayanan();
      const pengantar = await AdministrasiApi.getPengantar();

      const merge = [
        ...(await online.json()).data.slice(0, 1),
        ...(await layanan.json()).data.slice(0, 1),
        ...(await pengantar.json()).data.slice(0, 1),
      ];
      setAdministrasiPreview(merge);
    } catch (e) {
      alertError("Gagal ambil preview administrasi");
    }
  };

  const fetchGaleriPreview = async () => {
    const res = await GaleryApi.getGaleri(1, 3);
    if (!res.ok) return alertError("Gagal ambil galeri");
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  const fetchPkkPreview = async () => {
    const res = await ProgramApi.getPrograms(1, 3);
    if (!res.ok) return alertError("Gagal ambil program PKK");
    const data = await res.json();
    setPkkPreview(data.programs || []);
  };

  const fetchAnggotaPreview = async () => {
    const res = await MemberApi.getMembers("", 1, 3);
    if (!res.ok) return alertError("Gagal ambil anggota");
    const data = await res.json();
    setAnggotaPreview(data.members || []);
  };

  useEffect(() => {
    fetchNews();
    fetchAgenda();
    fetchMessages();
    fetchUsers();
    fetchBumdesPreview();
    fetchAdministrasiPreview();
    fetchGaleriPreview();
    fetchPkkPreview();
    fetchAnggotaPreview();
  }, []);

  return (
    <div className="w-full font-[Poppins,sans-serif]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Admin
      </h1>

      {/* ✅ GRID STATISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaNewspaper className="text-green-500" />}
          title="Berita"
          count={news.length}
          onClick={() => navigate("/admin/manage-berita")}
        />
        <StatCard
          icon={<FaCalendarAlt className="text-blue-500" />}
          title="Agenda"
          count={agenda.length}
          onClick={() => navigate("/admin/manage-agenda")}
        />
        <StatCard
          icon={<FaComments className="text-orange-500" />}
          title="Pesan"
          count={messages.length}
          onClick={() => navigate("/admin/manage-pesan")}
        />
        <StatCard
          icon={<FaUsers className="text-purple-500" />}
          title="Users"
          count={users.length}
          onClick={() => navigate("/admin/manage-user")}
        />
      </div>

      {/* ✅ INFROGRAFIS PENDUDUK */}
      <div 
        className="bg-white rounded-xl shadow-md p-6 mb-8 cursor-pointer hover:shadow-lg transition"
        onClick={() => navigate("/admin/manage-penduduk")}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Infografis Penduduk
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pendudukData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#B6F500" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 text-center mt-3">
          Klik grafik untuk kelola data penduduk →
        </p>
      </div>

      {/* ✅ PREVIEW SECTIONS */}
      <PreviewSection
        title="Produk BUMDes"
        icon={<FaStore />}
        data={bumdesPreview.map((p) => ({
          title: p.product.title,
          desc: p.product.description,
          img: `${import.meta.env.VITE_BASE_URL}/products/images/${p.product.featured_image}`,
        }))}
        onClick={() => navigate("/admin/manage-bumdes")}
      />

      <PreviewSection
        title="Administrasi"
        icon={<FaClipboardList />}
        data={administrasiPreview.map((a) => ({
          title: a.name,
          desc: a.type,
        }))}
        onClick={() => navigate("/admin/manage-administrasi")}
      />

      <PreviewSection
        title="Galeri"
        icon={<FaImage />}
        data={galeriPreview.map((g) => ({
          title: g.title,
          img: `${import.meta.env.VITE_BASE_URL}/galeri/images/${g.image}`,
        }))}
        onClick={() => navigate("/admin/manage-galeri")}
      />

      <PreviewSection
        title="Program PKK"
        icon={<FaTasks />}
        data={pkkPreview.map((p) => ({
          title: p.title,
          desc: p.description,
          img: `${import.meta.env.VITE_BASE_URL}/programs/images/${p.featured_image}`,
        }))}
        onClick={() => navigate("/admin/manage-pkk")}
      />

      <PreviewSection
        title="Struktur Organisasi"
        icon={<FiUsers />}
        data={anggotaPreview.map((m) => ({
          title: m.name,
          desc: m.position,
          img: m.profile_photo.startsWith("http")
            ? m.profile_photo
            : `${import.meta.env.VITE_BASE_URL}/organizations/images/${m.profile_photo}`,
        }))}
        onClick={() => navigate("/admin/manage-anggota")}
      />
    </div>
  );
}

// ✅ MINI CARD STATISTIK
function StatCard({ icon, title, count, onClick }) {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center cursor-pointer"
      onClick={onClick}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
    </div>
  );
}

// ✅ PREVIEW SECTION LIST
function PreviewSection({ title, icon, data, onClick }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon} {title}
        </h2>
      </div>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data</p>
        ) : (
          data.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center border-b pb-2">
              {item.img && (
                <img src={item.img} className="w-12 h-12 rounded object-cover" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                {item.desc && (
                  <p className="text-sm text-gray-500">{item.desc}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="text-right mt-3">
        <button
          onClick={onClick}
          className="text-green-600 font-medium hover:underline"
        >
          ➜ Lihat Lengkap
        </button>
      </div>
    </div>
  );
}
