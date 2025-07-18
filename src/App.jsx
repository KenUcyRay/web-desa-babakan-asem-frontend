import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// ✅ Navbar + Footer hanya untuk umum
import TopNavbar from "./components/TopNavbar";
import NavbarTop from "./components/NavbarTop";
import Footer from "./components/Footer";

// ✅ Halaman Umum
import Home from "./components/Home";
import Administrasi from "./components/Administrasi";
import Agenda from "./components/Agenda";
import Berita from "./components/Berita";
import DetailBerita from "./components/DetailBerita";
import DetailAgenda from "./components/DetailAgenda";
import DetailProduk from "./components/DetailProduk";
import Panduan from "./components/Panduan";
import Galery from "./components/Galery";
import Bumdes from "./components/Bumdes";
import KarangTaruna from "./components/KarangTaruna";
import Pkk from "./components/Pkk";
import PotensiDesa from "./components/PotensiDesa";
import Pemerintahan from "./components/Pemerintahan";
import KontakKami from "./components/KontakKami";
import ProfilDesa from "./components/ProfilDesa";

// ✅ Autentikasi
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Wait from "./components/Wait";

// ✅ Infografis Nested
import InfografisLayout from "./components/Infografis/InfografisLayout";
import Penduduk from "./components/Infografis/Penduduk";
import IDM from "./components/Infografis/IDM";
import Bansos from "./components/Infografis/Bansos";
import SDGs from "./components/Infografis/SDGs";

// ✅ Halaman DPD
import Dpd from "./components/Dpd";

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

// ✅ Pengaturan Admin
import PengaturanWebsite from "./components/admin/pengaturan/PengaturanWebsite";
import PengaturanProfil from "./components/admin/pengaturan/PengaturanProfil";
import PengaturanHakAkses from "./components/admin/pengaturan/PengaturanHakAkses";


// ✅ Layout untuk Halaman Umum (Navbar & Footer aktif)
function LayoutUmum() {
  return (
    <>
      <TopNavbar />
      <div className="pt-[36px]">
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


// ✅ Layout untuk Halaman Admin (Tanpa Navbar & Footer)
function LayoutAdmin() {
  return (
    <Routes>
      {/* ✅ Dashboard Admin */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* ✅ Menu Admin */}
      <Route path="/admin/manage-berita" element={<ManageBerita />} />
      <Route path="/admin/manage-agenda" element={<ManageAgenda />} />
      <Route path="/admin/manage-pesan" element={<ManagePesan />} />
      <Route path="/admin/manage-user" element={<ManageUser />} />

      {/* ✅ Pengaturan Admin */}
      <Route path="/admin/pengaturan/website" element={<PengaturanWebsite />} />
      <Route path="/admin/pengaturan/profil" element={<PengaturanProfil />} />
      <Route path="/admin/pengaturan/hak-akses" element={<PengaturanHakAkses />} />

      {/* ✅ Redirect default jika ke /admin/ */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}


// ✅ Tentukan Layout berdasar URL
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  return isAdminPage ? <LayoutAdmin /> : <LayoutUmum />;
}


// ✅ Entry utama App
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
