import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaHandsHelping,
  FaChartBar,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import LogoDesa from "../../assets/logo.png";
import HeroVideo from "../../assets/new.mp4";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import { alertError } from "../../libs/alert";
import { ProductApi } from "../../libs/api/ProductApi";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.body.style.fontFamily = "'Poppins', sans-serif";
  }, []);

  const quickMenu = [
    {
      title: "Profil Desa",
      desc: "Sejarah, visi & misi desa",
      icon: <FaMapMarkerAlt className="text-green-600 text-4xl" />,
      link: "/profil",
    },
    {
      title: "Berita Desa",
      desc: "Informasi terkini",
      icon: <FaNewspaper className="text-blue-600 text-4xl" />,
      link: "/berita",
    },
    {
      title: "Layanan Publik",
      desc: "Pengajuan surat & layanan",
      icon: <FaHandsHelping className="text-yellow-600 text-4xl" />,
      link: "/administrasi",
    },
    {
      title: "Infografis",
      desc: "Data statistik desa",
      icon: <FaChartBar className="text-purple-600 text-4xl" />,
      link: "/infografis/penduduk",
    },
  ];

  // ✅ Data Chart untuk ComboChart
  const apbData = [
    { name: "Pendapatan", anggaran: 350, realisasi: 300 },
    { name: "Belanja", anggaran: 280, realisasi: 250 },
    { name: "Sisa", anggaran: 70, realisasi: 50 },
  ];

  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);

  const fetchProduct = async () => {
    const response = await ProductApi.getProducts(1, 3);
    if (response.status === 200) {
      const responseBody = await response.json();
      setProducts(responseBody.products);
    } else {
      await alertError("Gagal mengambil data product. Silakan coba lagi nanti.");
    }
  };

  const fetchNews = async () => {
    const response = await NewsApi.getNews(1, 3);
    if (response.status === 200) {
      const responseBody = await response.json();
      setNews(responseBody.news);
    } else {
      alertError("Gagal mengambil data berita. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchNews();
    fetchProduct();
  }, []);

  return (
    <div className="font-[Poppins] w-full">
      {/* ✅ HERO VIDEO */}
      <div className="relative h-screen w-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover will-change-transform"
          style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
        >
          <source src={HeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1
            className="text-[clamp(1.8rem,4vw,3rem)] font-bold"
            data-aos="fade-down"
          >
            Selamat Datang di Desa Babakan Asem
          </h1>
          <p
            className="mt-3 text-[clamp(0.9rem,1.6vw,1.2rem)] max-w-xl leading-relaxed"
            data-aos="fade-up"
          >
            Desa yang asri, ramah, dan penuh gotong royong.
          </p>
          <p
            className="mt-1 text-[clamp(0.8rem,1.4vw,1rem)] opacity-90"
            data-aos="fade-up"
          >
            Kabupaten Sumedang
          </p>
        </div>
      </div>

      {/* ✅ QUICK MENU */}
      <div className="w-full px-[5%] py-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
        {quickMenu.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="bg-white shadow rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-transform"
            data-aos="fade-up"
          >
            <div>{item.icon}</div>
            <h3 className="font-bold text-[clamp(0.95rem,1.4vw,1.1rem)] mt-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-[clamp(0.75rem,1vw,0.95rem)] mt-1">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* ✅ TENTANG DESA */}
      <div
        className="bg-green-50 py-[clamp(2rem,6vh,4rem)] px-[5%]"
        data-aos="fade-up"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-bold text-green-700 mb-4">
              Tentang Desa Babakan Asem
            </h2>
            <p className="text-gray-700 leading-relaxed text-[clamp(0.85rem,1.2vw,1rem)]">
              Desa Babakan Asem merupakan desa yang terletak di kawasan asri
              dengan mayoritas penduduk bermata pencaharian sebagai petani dan
              pengrajin. Desa ini memiliki potensi alam yang melimpah, budaya
              gotong royong yang kuat, serta berbagai produk unggulan yang
              dikelola oleh Badan Usaha Milik Desa (BUMDes).
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed text-[clamp(0.85rem,1.2vw,1rem)]">
              Kami terus berkomitmen untuk membangun desa yang mandiri, berdaya
              saing, dan sejahtera melalui pemberdayaan masyarakat lokal.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={LogoDesa}
              alt="Logo Desa Babakan Asem"
              className="w-[20vw] min-w-[100px] max-w-[180px] drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* ✅ BERITA TERBARU */}
      <div className="w-full px-[5%] py-[clamp(2rem,6vh,4rem)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-bold">
            Berita Terbaru
          </h2>
          <Link
            to="/berita"
            className="text-green-600 hover:underline text-[clamp(0.8rem,1.1vw,0.95rem)]"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
          {news.map((item) => (
            <Link
              key={item.news.id}
              to={`/berita/${item.news.id}`}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-transform"
              data-aos="zoom-in"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/news/images/${item.news.featured_image}`}
                alt={item.news.title}
                className="w-full h-[18vh] object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  {Helper.formatTanggal(item.news.created_at)}
                </p>
                <h3 className="font-semibold text-[clamp(0.95rem,1.4vw,1.1rem)] mt-1">
                  {item.news.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ PRODUK BUMDes PREVIEW (CARD PERSIS BUMDes.jsx) */}
      <div
        className="bg-green-50 py-[clamp(2rem,6vh,4rem)] px-[5%]"
        data-aos="fade-up"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-bold">
            Produk BUMDes
          </h2>
          <Link
            to="/bumdes"
            className="text-green-600 hover:underline text-[clamp(0.8rem,1.1vw,0.95rem)]"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item, idx) => {
            const full = Math.floor(item.average_rating);
            const half = item.average_rating - full >= 0.5;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <Link to={`/bumdes/${item.product.id}`}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/products/images/${item.product.featured_image}`}
                    alt={item.product.title}
                    className="w-full h-48 object-cover rounded-t-2xl hover:opacity-90 transition"
                  />
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/bumdes/${item.product.id}`}>
                    <h3 className="font-semibold text-[1rem] text-gray-800 hover:text-green-700 transition">
                      {item.product.title}
                    </h3>
                  </Link>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      let icon;
                      if (star <= full) {
                        icon = <FaStar className="text-yellow-400" />;
                      } else if (star === full + 1 && half) {
                        icon = <FaStarHalfAlt className="text-yellow-400" />;
                      } else {
                        icon = <FaRegStar className="text-gray-300" />;
                      }
                      return <span key={star}>{icon}</span>;
                    })}
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.average_rating?.toFixed(1) ?? "0.0"})
                    </span>
                  </div>

                  {/* Harga & WA */}
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <p className="text-lg font-bold text-green-700">
                      {Helper.formatRupiah(item.product.price)}
                    </p>
                    <a
                      href={item.product.link_whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg shadow hover:shadow-md transition text-sm"
                    >
                      <FaWhatsapp /> Pesan
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ APB Desa Combo Chart */}
      <div className="w-full px-[5%] py-[clamp(2rem,6vh,4rem)]">
        <h2
          className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          📊 APB Desa Tahun 2025
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-[clamp(1rem,3vw,2rem)]">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={apbData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="anggaran" barSize={30} fill="#4ade80" name="Anggaran" />
              <Line type="monotone" dataKey="realisasi" stroke="#3b82f6" strokeWidth={2} name="Realisasi" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ MAP DESA */}
      <div className="relative h-[30vh] md:h-[40vh] w-full">
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