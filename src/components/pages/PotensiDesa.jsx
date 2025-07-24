import React, { useEffect } from "react";
import { FaSeedling, FaHorse, FaTree } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Import gambar lokal
import tani from "../../assets/sawah.jpeg";
import sapi from "../../assets/sapi.jpeg";
import kebun from "../../assets/kebun.jpeg";

export default function PotensiDesa() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ✅ Ganti foto carousel ke gambar lokal
  const potensiImages = [
    {
      src: tani,
      title: "Pertanian Subur",
      desc: "Sawah luas menghasilkan padi, jagung, ubi kayu, dan sayuran segar.",
    },
    {
      src: sapi,
      title: "Peternakan Terawat",
      desc: "Sapi, kambing, ayam, dan domba menunjang ketahanan pangan desa.",
    },
    {
      src: kebun,
      title: "Perkebunan Hijau",
      desc: "Perkebunan mangga, pisang, dan hortikultura menambah penghasilan warga.",
    },
  ];

  return (
    <div className="bg-gray-50 py-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ✅ JUDUL */}
        <h1
          className="text-3xl md:text-4xl font-bold text-center text-gray-900"
          data-aos="fade-up"
        >
          Potensi Desa Babakan Asem
        </h1>
        <p
          className="text-center text-gray-600 mt-3 mb-10 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Mayoritas warga bekerja sebagai petani, peternak, dan pekebun dengan hasil pangan yang berkualitas dan alami.
        </p>

        {/* ✅ GRID POTENSI */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] mb-16">
          {/* Pertanian */}
          <div
            className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition"
            data-aos="fade-right"
          >
            <img
              src={tani}
              alt="Pertanian"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaSeedling /> Pertanian
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Padi, jagung, ubi kayu, kacang tanah, dan sayuran menjadi andalan desa.
              </p>
            </div>
          </div>

          {/* Peternakan */}
          <div
            className="bg-orange-50 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition"
            data-aos="fade-up"
          >
            <img
              src={sapi}
              alt="Peternakan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaHorse /> Peternakan
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Sapi, kambing, ayam, & domba untuk konsumsi lokal dan meningkatkan ekonomi warga.
              </p>
            </div>
          </div>

          {/* Perkebunan */}
          <div
            className="bg-blue-50 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition md:col-span-2"
            data-aos="fade-left"
          >
            <img
              src={kebun}
              alt="Perkebunan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaTree /> Perkebunan
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Mangga, pisang, dan tanaman hortikultura menjadi tambahan penghasilan warga.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ CAROUSEL FOTO POTENSI */}
        <div data-aos="zoom-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Dari bumi subur dan ternak terawat, <br className="hidden md:block" />
            kami hadirkan pangan berkualitas untuk keluarga Anda
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Lihat langsung potensi unggulan desa kami melalui galeri foto di bawah ini.
          </p>

          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
          >
            {potensiImages.map((item, index) => (
              <div key={index}>
                <img
                  src={item.src}
                  alt={item.title}
                  className="rounded-lg shadow-md"
                />
                <p className="legend">
                  <strong>{item.title}</strong> – {item.desc}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
