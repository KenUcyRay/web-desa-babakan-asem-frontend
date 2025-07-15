import TopNavbar from "./components/TopNavbar";   // Navbar paling atas (PKK, BUMDES, dll)
import NavbarTop from "./components/NavbarTop";   // Navbar utama (logo + menu dropdown)

export default function App() {
  return (
    <>
      {/* Navbar Atas FIXED */}
      <TopNavbar />

      {/* Wrapper: dorong konten turun supaya NavbarTop nggak ketiban */}
      <div className="pt-[36px]"> 
        {/* Navbar utama STICKY di bawah TopNavbar */}
        <NavbarTop />

        {/* Konten halaman (dummy) */}
        <div className="h-[2000px] bg-gray-100">
          <h1 className="text-center text-3xl pt-20">Konten Halaman</h1>
          <p className="text-center mt-4">
            Scroll → Navbar atas diam di atas layar, Navbar utama ikut scroll sticky di bawahnya
          </p>
        </div>
      </div>
    </>
  );
}
