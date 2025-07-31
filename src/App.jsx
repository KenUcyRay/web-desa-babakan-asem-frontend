import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Toaster } from "react-hot-toast";

// - Navbar + Footer untuk umum
import NavbarTop from "./components/layout/NavbarTop";
import NavbarBottom from "./components/layout/NavbarBottom";
import Footer from "./components/layout/Footer";

// - Floating Menu
import FloatingMenu from "./components/layout/FloatingMenu";

// - Halaman Umum
import Home from "./components/pages/Home";
import Administrasi from "./components/services/Administrasi";
import Agenda from "./components/content/Agenda";
import Berita from "./components/content/Berita";
import DetailBerita from "./components/content/DetailBerita";
import DetailAgenda from "./components/content/DetailAgenda";
import DetailProduk from "./components/services/DetailProduk";
import Panduan from "./components/pages/Panduan";
import Galery from "./components/content/Galery";
import Bumdes from "./components/organizations/Bumdes";
import KarangTaruna from "./components/organizations/KarangTaruna";
import Pkk from "./components/organizations/Pkk";
import PotensiDesa from "./components/pages/PotensiDesa";
import Pemerintahan from "./components/pages/Pemerintahan";
import KontakKami from "./components/pages/KontakKami";
import ProfilDesa from "./components/pages/ProfilDesa";

// - Autentikasi
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Wait from "./components/ui/Wait";

// - Infografis Nested
import InfografisLayout from "./components/Infografis/InfografisLayout";
import Penduduk from "./components/Infografis/Penduduk";
import IDM from "./components/Infografis/IDM";
import Bansos from "./components/Infografis/Bansos";
import SDGs from "./components/Infografis/SDGs";

// - Halaman DPD
import Bpd from "./components/organizations/Bpd";

// - Form Administrasi
import SuratPengantar from "./components/forms/SuratPengantar";

// - Admin Panel
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageBerita from "./components/admin/ManageBerita";
import ManageAgenda from "./components/admin/ManageAgenda";
import ManagePesan from "./components/admin/ManagePesan";
import ManageUser from "./components/admin/ManageUser";
import ManageBumdes from "./components/admin/ManageBumdes";
import ManageGalery from "./components/admin/ManageGalery";
import ManageAnggota from "./components/admin/ManageAnggota";
import ManageAdministrasi from "./components/admin/ManageAdministrasi";
import ManagePkk from "./components/admin/ManagePkk";

// - Pengaturan Admin
import PengaturanProfil from "./components/admin/settings/PengaturanProfil";
import AdminLayout from "./components/admin/AdminLayout";
import StPkk from "./components/organizations/StPkk";

// - Profil User
import Profile from "./components/pages/Profile";
import ScrollToTop from "./components/layout/ScrollToTop";

// - Kelola Infografis Admin
import ManagePenduduk from "./components/admin/KelolaInfografis/ManagePenduduk";
import ManageIDM from "./components/admin/KelolaInfografis/ManageIDM";
import ManageSDGs from "./components/admin/KelolaInfografis/ManageSDGs";
import ManageBansos from "./components/admin/KelolaInfografis/ManageBansos";

//profile
import { useAuth } from "./contexts/AuthContext";
import { UserApi } from "./libs/api/UserApi";

// ✅ Layout Umum (Navbar + Footer aktif + Floating Menu)
function LayoutUmum() {
  const { isLoggedIn, setAdminStatus } = useAuth();

  const fetchProfile = async () => {
    if (!isLoggedIn) return;

    const response = await UserApi.getUserProfile();
    if (response.status === 200) {
      const responseBody = await response.json();
      setAdminStatus(responseBody.user.role === "ADMIN");
    } else {
      setAdminStatus(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  });

  return (
    <>
      <NavbarTop />
      <div className="pt-[60px] lg:pt-[40px] animate-fade">
        <NavbarBottom />

        <Routes>
          {/* - Halaman Utama */}
          <Route path="/" element={<Home />} />
          <Route path="/administrasi" element={<Administrasi />} />

          {/* - Agenda & Berita */}
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda/:id" element={<DetailAgenda />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<DetailBerita />} />

          {/* - Produk BUMDes */}
          <Route path="/bumdes" element={<Bumdes />} />
          <Route path="/bumdes/:id" element={<DetailProduk />} />

          {/* - Halaman Umum lainnya */}
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/galeri" element={<Galery />} />
          <Route path="/karang-taruna" element={<KarangTaruna />} />
          <Route path="/pkk" element={<Pkk />} />
          <Route path="/potensi" element={<PotensiDesa />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/bpd" element={<Bpd />} />
          <Route path="/profil" element={<ProfilDesa />} />
          <Route path="/kontak" element={<KontakKami />} />
          <Route path="/pkk/struktur" element={<StPkk />} />

          {/* - Profil User */}
          <Route path="/profile" element={<Profile />} />

          {/* - Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/wait" element={<Wait />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* - Infografis Nested */}
          <Route path="/infografis" element={<InfografisLayout />}>
            <Route index element={<Navigate to="penduduk" replace />} />
            <Route path="penduduk" element={<Penduduk />} />
            <Route path="idm" element={<IDM />} />
            <Route path="bansos" element={<Bansos />} />
            <Route path="sdgs" element={<SDGs />} />
          </Route>

          {/* - Form Administrasi */}
          <Route path="/surat-pengantar" element={<SuratPengantar />} />
        </Routes>

        {/* ✅ Floating Menu tampil di semua halaman umum */}
        <FloatingMenu />

        {/* ✅ Footer tetap di bawah */}
        <Footer />
      </div>
    </>
  );
}

// ✅ Layout Admin (tanpa FloatingMenu & Footer)
function LayoutAdmin() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        {/* - Menu Admin */}
        <Route path="manage-berita" element={<ManageBerita />} />
        <Route path="manage-agenda" element={<ManageAgenda />} />
        <Route path="manage-pesan" element={<ManagePesan />} />
        <Route path="manage-user" element={<ManageUser />} />
        <Route path="manage-bumdes" element={<ManageBumdes />} />
        <Route path="manage-galery" element={<ManageGalery />} />
        <Route path="manage-anggota" element={<ManageAnggota />} />
        <Route path="manage-administrasi" element={<ManageAdministrasi />} />
        <Route path="manage-pkk" element={<ManagePkk />} />

        {/* - Kelola Infografis */}
        <Route path="kelola-infografis/penduduk" element={<ManagePenduduk />} />
        <Route path="kelola-infografis/idm" element={<ManageIDM />} />
        <Route path="kelola-infografis/sdgs" element={<ManageSDGs />} />
        <Route path="kelola-infografis/bansos" element={<ManageBansos />} />

        {/* - Pengaturan Admin */}
        <Route path="pengaturan/profil" element={<PengaturanProfil />} />

        {/* - Redirect default kalau salah path */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

// ✅ Loader + Progress saat pindah halaman
function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NProgress.start();
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAdminPage =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-[9999]">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isAdminPage ? <LayoutAdmin /> : <LayoutUmum />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />

      {/* ✅ Tambahan Toaster biar bisa dipakai di semua halaman */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#333",
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontFamily: "Poppins, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </Router>
  );
}
