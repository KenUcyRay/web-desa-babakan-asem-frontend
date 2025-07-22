import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import LogoDesa from "../../assets/logo.png";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import { alertError } from "../../libs/alert";
import { ProductApi } from "../../libs/api/ProductApi";
import foto1 from "../../assets/babakan.jpg";
import foto2 from "../../assets/kantor.jpg";
import foto3 from "../../assets/jalan.jpg";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
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

  const apbData = [
    { name: "Pendapatan", value: 350, color: "#4ade80" },
    { name: "Belanja", value: 280, color: "#f87171" },
    { name: "Sisa Anggaran", value: 70, color: "#60a5fa" },
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
    const response = await NewsApi.getNews(1, 4);
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

  const slides = [
    {
      img: foto1,
      title: "Selamat Datang di Desa Babakan Asem",
      desc: "Desa yang asri, ramah, dan penuh gotong royong.",
    },
    {
      img: foto2,
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
      img: foto3,
      title: "Potensi & Kegiatan Desa",
      desc: "Memberdayakan UMKM & budaya lokal bersama masyarakat.",
    },
  ];

  return (
    <div className="font-poppins w-full">
      {/* ✅ HERO CAROUSEL */}
      <div className="relative pb-4">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="relative">
              <div className="h-[30vh] md:h-[45vh] lg:h-[55vh] overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-[5%]">
                <h2
                  className="font-bold mb-2 text-[clamp(1.5rem,3vw,3rem)]"
                  data-aos="fade-down"
                >
                  {slide.title}
                </h2>
                <p
                  className="text-[clamp(0.9rem,1.5vw,1.3rem)]"
                  data-aos="fade-up"
                >
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
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
            <h3 className="font-bold text-[clamp(1rem,1.5vw,1.2rem)] mt-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-[clamp(0.8rem,1vw,1rem)] mt-1">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* ✅ PENJELASAN DESA + LOGO */}
      <div className="bg-green-50 py-[clamp(2rem,6vh,4rem)] px-[5%]" data-aos="fade-up">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[clamp(1.5rem,2.5vw,2.2rem)] font-bold text-green-700 mb-4">
              Tentang Desa Babakan Asem
            </h2>
            <p className="text-gray-700 leading-relaxed text-[clamp(0.9rem,1.3vw,1rem)]">
              Desa Babakan Asem merupakan desa yang terletak di kawasan asri
              dengan mayoritas penduduk bermata pencaharian sebagai petani dan
              pengrajin. Desa ini memiliki potensi alam yang melimpah, budaya
              gotong royong yang kuat, serta berbagai produk unggulan yang
              dikelola oleh Badan Usaha Milik Desa (BUMDes).
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed text-[clamp(0.9rem,1.3vw,1rem)]">
              Kami terus berkomitmen untuk membangun desa yang mandiri, berdaya
              saing, dan sejahtera melalui pemberdayaan masyarakat lokal.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={LogoDesa}
              alt="Logo Desa Babakan Asem"
              className="w-[20vw] min-w-[100px] max-w-[200px] drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* ✅ BERITA TERBARU */}
      <div className="w-full px-[5%] py-[clamp(2rem,6vh,4rem)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[clamp(1.2rem,2vw,1.8rem)] font-bold">Berita Terbaru</h2>
          <Link to="/berita" className="text-green-600 hover:underline text-[clamp(0.9rem,1.2vw,1rem)]">
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
                <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.2rem)] mt-1">
                  {item.news.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ PREVIEW BUMDes */}
      <div className="bg-green-50 py-[clamp(2rem,6vh,4rem)] px-[5%]" data-aos="fade-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[clamp(1.2rem,2vw,1.8rem)] font-bold">Produk BUMDes</h2>
          <Link to="/bumdes" className="text-green-600 hover:underline text-[clamp(0.9rem,1.2vw,1rem)]">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
          {products.map((product) => (
            <Link
              key={product.product.id}
              to={`/bumdes/${product.product.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition-transform"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/products/images/${product.product.featured_image}`}
                alt={product.product.title}
                className="w-full h-[20vh] object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.2rem)]">
                  {product.product.title}
                </h3>
                <p className="text-green-700 font-bold mt-1">
                  Rp {Helper.formatRupiah(product.product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ APB Desa */}
      <div className="w-full px-[5%] py-[clamp(2rem,6vh,4rem)]">
        <h2
          className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          📊 APB Desa Tahun 2025
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-[clamp(1rem,3vw,2rem)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* ✅ Chart */}
            <div className="w-full md:w-[50%] h-[30vh]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={apbData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
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

            {/* ✅ Detail anggaran */}
            <div className="grid gap-4">
              {apbData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-gray-700 text-[clamp(0.9rem,1.3vw,1rem)]"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">
                    {item.name}:{" "}
                    <span className="font-bold">{item.value} JT</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
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
