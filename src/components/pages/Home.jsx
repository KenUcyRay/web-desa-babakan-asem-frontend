import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaHandsHelping,
  FaChartBar,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import LogoDesa from "../../assets/logo.png"; // ✅ logo lokal

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
  }, []);

  // ✅ Scroll ke atas tiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const quickMenu = [
    {
      title: "Profil Desa",
      desc: "Sejarah, visi & misi desa",
      icon: <FaMapMarkerAlt className="text-green-600 text-4xl" />,
    },
    {
      title: "Berita Desa",
      desc: "Informasi terkini",
      icon: <FaNewspaper className="text-blue-600 text-4xl" />,
    },
    {
      title: "Layanan Publik",
      desc: "Pengajuan surat & layanan",
      icon: <FaHandsHelping className="text-yellow-600 text-4xl" />,
    },
    {
      title: "Infografis",
      desc: "Data statistik desa",
      icon: <FaChartBar className="text-purple-600 text-4xl" />,
    },
  ];

  const latestNews = [
    {
      id: 1,
      title: "Perbaikan Jalan Desa Selesai",
      date: "18 Juli 2025",
      img: "https://images.unsplash.com/photo-1594897030264-5b9c538c1cc0?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Gotong Royong Bersih Desa",
      date: "15 Juli 2025",
      img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      title: "Pelatihan UMKM Warga",
      date: "10 Juli 2025",
      img: "https://images.unsplash.com/photo-1573497490850-15d4980c8d9a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      title: "Peringatan Hari Kemerdekaan",
      date: "1 Juli 2025",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const bumdesPreview = [
    {
      title: "Beras Organik Premium",
      price: "Rp 50.000",
      img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Kerajinan Bambu",
      price: "Rp 75.000",
      img: "https://images.unsplash.com/photo-1607083206968-13611e1d9b8b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Madu Hutan Asli",
      price: "Rp 120.000",
      img: "https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // ✅ Data APB Desa untuk Pie Chart
  const apbData = [
    { name: "Pendapatan", value: 1200000000, color: "#4ade80" }, // hijau
    { name: "Belanja", value: 950000000, color: "#f87171" }, // merah
    { name: "Sisa Anggaran", value: 250000000, color: "#60a5fa" }, // biru
  ];

  return (
    <div className="font-poppins">
      {/* ✅ HERO CAROUSEL */}
      <div className="relative pb-4">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
        >
          {[
            {
              img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1600&q=80",
              title: "Selamat Datang di Desa Babakan Asem",
              desc: "Desa yang asri, ramah, dan penuh gotong royong.",
            },
            {
              img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
              title: "Profil Desa Babakan Asem",
              desc: (
                <>
                  Kunjungi{" "}
                  <Link
                    to="/profil"
                    className="underline hover:text-green-200 transition"
                  >
                    Profil Desa →
                  </Link>
                </>
              ),
            },
            {
              img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
              title: "Potensi & Kegiatan Desa",
              desc: "Memberdayakan UMKM & budaya lokal bersama masyarakat.",
            },
          ].map((slide, idx) => (
            <div key={idx} className="relative">
              <div className="h-[260px] md:h-[380px] overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ✅ Overlay teks */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
                <h2
                  className="text-2xl md:text-4xl font-bold mb-2"
                  data-aos="fade-down"
                >
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg" data-aos="fade-up">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* ✅ QUICK MENU */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {quickMenu.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-transform"
            data-aos="fade-up"
          >
            <div>{item.icon}</div>
            <h3 className="font-bold text-lg mt-3">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ✅ PENJELASAN DESA + LOGO */}
      <div className="bg-green-50 py-12" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
              Tentang Desa Babakan Asem
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Desa Babakan Asem merupakan desa yang terletak di kawasan asri
              dengan mayoritas penduduk bermata pencaharian sebagai petani dan
              pengrajin. Desa ini memiliki potensi alam yang melimpah, budaya
              gotong royong yang kuat, serta berbagai produk unggulan yang
              dikelola oleh Badan Usaha Milik Desa (BUMDes).{" "}
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Kami terus berkomitmen untuk membangun desa yang mandiri,
              berdaya saing, dan sejahtera melalui pemberdayaan masyarakat
              lokal.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={LogoDesa}
              alt="Logo Desa Babakan Asem"
              className="w-36 md:w-52 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* ✅ BERITA TERBARU */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Berita Terbaru</h2>
          <Link to="/berita" className="text-green-600 hover:underline">
            Lihat Semua →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestNews.map((news) => (
            <Link
              key={news.id}
              to={`/berita/${news.id}`}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-transform"
              data-aos="zoom-in"
            >
              <img
                src={news.img}
                alt={news.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500">{news.date}</p>
                <h3 className="font-semibold text-lg mt-1">{news.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ PREVIEW BUMDes */}
      <div className="bg-green-50 py-12" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Produk BUMDes</h2>
            <Link to="/bumdes" className="text-green-600 hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bumdesPreview.map((prod, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition-transform"
              >
                <img
                  src={prod.img}
                  alt={prod.title}
                  className="w-full h-40 md:h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{prod.title}</h3>
                  <p className="text-green-700 font-bold mt-1">{prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ APB Desa dengan Pie Chart */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          APB Desa Tahun 2025
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={apbData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {apbData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Statistik angka */}
          <div className="grid gap-4">
            {apbData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700 font-medium">
                  {item.name}:{" "}
                  <span className="font-bold">
                    Rp {item.value.toLocaleString("id-ID")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ MAP DESA */}
      <div className="relative h-[250px] md:h-[320px] w-full">
        <iframe
          title="Peta Desa Babakan Asem"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.123456!2d110.123456!3d-7.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDesa%20Babakan%20Asem!5e0!3m2!1sid!2sid!4v1234567890"
          className="absolute top-0 left-0 w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
