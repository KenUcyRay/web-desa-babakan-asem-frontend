import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import NavbarTop from "./components/NavbarTop";
import Footer from "./components/Footer";

// hal umum
import Home from "./components/Home";
import Administrasi from "./components/Administrasi";
import Agenda from "./components/Agenda";
import Berita from "./components/Berita";
import DetailBerita from "./components/DetailBerita";
import Panduan from "./components/Panduan";
import Galery from "./components/Galery";
import Bumdes from "./components/Bumdes";
import KarangTaruna from "./components/KarangTaruna";
import Pkk from "./components/Pkk";
import PotensiDesa from "./components/PotensiDesa";
import Pemerintahan from "./components/Pemerintahan";
import KontakKami from "./components/KontakKami";
import ProfilDesa from "./components/ProfilDesa";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Wait from "./components/Wait";
import DetailAgenda from "./components/DetailAgenda";
import DetailProduk from "./components/DetailProduk";

// halaman infografis
import InfografisLayout from "./components/Infografis/InfografisLayout";
import Penduduk from "./components/Infografis/Penduduk";
import IDM from "./components/Infografis/IDM";
import Bansos from "./components/Infografis/Bansos";
import SDGs from "./components/Infografis/SDGs";

// ✅ import halaman DPD
import Dpd from "./components/Dpd";

export default function App() {
  return (
    <Router>
      <TopNavbar />

      {/* Supaya NavbarTop nggak ketiban */}
      <div className="pt-[36px]">
        <NavbarTop />

        <Routes>
          {/*  Route Halaman Utama */}
          <Route path="/" element={<Home />} />
          <Route path="/administrasi" element={<Administrasi />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<DetailBerita />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/galeri" element={<Galery />} />
          <Route path="/agenda/:id" element={<DetailAgenda />} />
          <Route path="/bumdes/:id" element={<DetailProduk />} />
          <Route path="/bumdes" element={<Bumdes />} />
          <Route path="/bumdes/:id" element={<DetailProduk />} />

          {/* Route Halaman Tambahan */}
          <Route path="/bumdes" element={<Bumdes />} />
          <Route path="/karang-taruna" element={<KarangTaruna />} />
          <Route path="/pkk" element={<Pkk />} />
          <Route path="/potensi" element={<PotensiDesa />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/dpd" element={<Dpd />} /> {/* ✅ Halaman DPD */}
          <Route path="/profil" element={<ProfilDesa />} />
          <Route path="/kontak" element={<KontakKami />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/wait" element={<Wait />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Nested route untuk Infografis */}
          <Route path="/infografis" element={<InfografisLayout />}>
            {/* Default ke Penduduk kalau langsung /infografis */}
            <Route index element={<Penduduk />} />
            <Route path="penduduk" element={<Penduduk />} />
            <Route path="idm" element={<IDM />} />
            <Route path="bansos" element={<Bansos />} />
            <Route path="sdgs" element={<SDGs />} />
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
