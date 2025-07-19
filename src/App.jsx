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

// ✅ Navbar + Footer hanya untuk umum
import TopNavbar from "./components/layout/TopNavbar";
import NavbarTop from "./components/layout/NavbarTop";
import Footer from "./components/layout/Footer";

// ✅ Halaman Umum
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

// ✅ Autentikasi
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Wait from "./components/ui/Wait";

// ✅ Infografis Nested
import InfografisLayout from "./components/Infografis/InfografisLayout";
import Penduduk from "./components/Infografis/Penduduk";
import IDM from "./components/Infografis/IDM";
import Bansos from "./components/Infografis/Bansos";
import SDGs from "./components/Infografis/SDGs";

// ✅ Halaman DPD
import Dpd from "./components/organizations/Dpd";
import DetailDpd from "./components/organizations/DetailDpd";

// ✅ Form Administrasi
import SuratPengantar from "./components/forms/SuratPengantar";
import FormulirLayanan from "./components/forms/FormulirLayanan";
import FormOnline from "./components/forms/FormOnline";

// ✅ Admin Panel
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageBerita from "./components/admin/ManageBerita";
import ManageAgenda from "./components/admin/ManageAgenda";
import ManagePesan from "./components/admin/ManagePesan";
import ManageUser from "./components/admin/ManageUser";
import ManageBumdes from "./components/admin/ManageBumdes"; // ✅ Tambahan untuk BUMDes

// ✅ Pengaturan Admin
import PengaturanProfil from "./components/admin/settings/PengaturanProfil";
import PengaturanHakAkses from "./components/admin/settings/PengaturanHakAkses";
import AdminLayout from "./components/admin/AdminLayout";
import StPkk from "./components/organizations/StPkk";

import ScrollToTop from "./components/layout/ScrollToTop";

// ✅ Layout Umum (Navbar & Footer aktif)
function LayoutUmum() {
  return (
    <>
      <TopNavbar />
      <div className="pt-[36px] animate-fade">
        <NavbarTop />
        <Routes>
          {/* ✅ Halaman Utama */}
          <Route path="/" element={<Home />} />
          <Route path="/administrasi" element={<Administrasi />} />

          {/* ✅ Agenda & Berita */}
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda/:id" element={<DetailAgenda />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<DetailBerita />} />

          {/* ✅ Produk BUMDes */}
          <Route path="/bumdes" element={<Bumdes />} />
          <Route path="/bumdes/:id" element={<DetailProduk />} />

          {/* ✅ Halaman Umum lainnya */}
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/galeri" element={<Galery />} />
          <Route path="/karang-taruna" element={<KarangTaruna />} />
          <Route path="/pkk" element={<Pkk />} />
          <Route path="/potensi" element={<PotensiDesa />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/dpd" element={<Dpd />} />
          <Route path="/profil" element={<ProfilDesa />} />
          <Route path="/kontak" element={<KontakKami />} />
          <Route path="/pkk/struktur" element={<StPkk />} />
          <Route path="/detail-dpd" element={<DetailDpd />} />

          {/* ✅ Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/wait" element={<Wait />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ Infografis Nested */}
          <Route path="/infografis" element={<InfografisLayout />}>
            <Route index element={<Navigate to="penduduk" replace />} />
            <Route path="penduduk" element={<Penduduk />} />
            <Route path="idm" element={<IDM />} />
            <Route path="bansos" element={<Bansos />} />
            <Route path="sdgs" element={<SDGs />} />
          </Route>

          {/* ✅ Form Administrasi */}
          <Route path="/surat-pengantar" element={<SuratPengantar />} />
          <Route path="/formulir-layanan" element={<FormulirLayanan />} />
          <Route path="/layanan-online" element={<FormOnline />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

// ✅ Layout Admin (tanpa Navbar & Footer)
function LayoutAdmin() {
  return (
    <Routes>
      {/* ✅ Dashboard Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ✅ Menu Admin */}
        <Route path="/admin/manage-berita" element={<ManageBerita />} />
        <Route path="/admin/manage-agenda" element={<ManageAgenda />} />
        <Route path="/admin/manage-pesan" element={<ManagePesan />} />
        <Route path="/admin/manage-user" element={<ManageUser />} />
        <Route path="/admin/manage-bumdes" element={<ManageBumdes />} /> {/* ✅ Baru */}

        {/* ✅ Pengaturan Admin */}
        <Route path="/admin/pengaturan/profil" element={<PengaturanProfil />} />
        <Route
          path="/admin/pengaturan/hak-akses"
          element={<PengaturanHakAkses />}
        />

        {/* ✅ Redirect default */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

// ✅ Loader + Progress + Fade Animasi saat pindah halaman
function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mulai progress bar
    NProgress.start();
    setLoading(true);

    // Selesai setelah 500ms
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
      {/* ✅ Fullscreen Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-[9999]">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ✅ Layout sesuai halaman */}
      {isAdminPage ? <LayoutAdmin /> : <LayoutUmum />}
    </>
  );
}

// ✅ Entry utama App
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
