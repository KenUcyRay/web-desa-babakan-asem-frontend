import React from "react";
import kumpul from "../assets/kumpul.jpg";
import struktur from "../assets/struktur.png";

export default function ProfilDesa() {
  return (
    <div className="font-poppins bg-gray-50">
      
      {/* ✅ Bagian Judul + Deskripsi Singkat */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        {/* Deskripsi Singkat */}
        <div>
          <h1 className="text-4xl font-bold text-green-700 mb-4">Profil Desa Babakan Asem</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Desa Babakan Asem adalah desa yang kaya akan sejarah, budaya, dan potensi masyarakatnya.
            Dengan semangat kebersamaan dan gotong royong, desa ini terus berkembang menuju masa depan
            yang lebih baik, tetap menjaga nilai-nilai tradisi namun beradaptasi dengan perkembangan zaman.
          </p>
        </div>
        {/* Foto Kumpul */}
        <div className="flex justify-center">
          <img
            src={kumpul}  
            alt="Warga Desa Berkumpul"
            className="rounded-xl shadow-lg w-full md:w-4/5 object-cover"
          />
        </div>
      </section>

      {/* ✅ Sejarah Desa */}
      <section className="bg-white shadow-sm py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Sejarah Desa</h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            Menurut sejarahnya, Desa Babakan Asem pada awalnya termasuk wilayah Desa Bongkok dan Desa
            Conggeang seperti Kampung Babakan Asem, Naringgul, Cisalak (Jolak) dan Cikara (Taman) itu
            termasuk ke dalam wilayah hukum Desa Bongkok kemudian Kampung Combong (Neglasari),
            Peueung, Kendal dan Tagog (Banasbanten). Nama Desa Babakan Asem sendiri berasal dari satu
            kampung atau babakan dan ada pohon asem yang besar, maka diberi nama Desa Babakan Asem.
            Babakan Asem juga merupakan singkatan dari Bareng Bakti Negara Anu Sempurna.
            Sementara moto Desa Babakan Asem adalah <strong>"Ayem Tengrtrem Kerta Raharja"</strong>.
          </p>
        </div>
      </section>

      {/* ✅ Visi & Misi */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* Visi */}
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Visi</h3>
          <p className="text-gray-700 leading-relaxed">
            “Mewujudkan Desa Babakan Asem yang mandiri, maju, dan berdaya saing dengan tetap menjaga
            nilai-nilai budaya dan gotong royong masyarakat.”
          </p>
        </div>

        {/* Misi */}
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Misi</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Meningkatkan kesejahteraan masyarakat melalui pembangunan berkelanjutan.</li>
            <li>Memberdayakan potensi desa untuk mendukung ekonomi kreatif.</li>
            <li>Meningkatkan kualitas pendidikan & kesehatan masyarakat.</li>
            <li>Menjaga kelestarian lingkungan & budaya lokal.</li>
          </ul>
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Struktur Organisasi Desa Babakan Asem
          </h2>
          <img
            src={struktur}
            alt="Struktur Organisasi Desa"
            className="rounded-lg shadow-md mx-auto"
          />
        </div>
      </section>

      {/* ✅ Peta Lokasi Desa */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* Batas Desa */}
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Batas Wilayah Desa</h3>
          <p className="text-gray-700 leading-relaxed">
            Wilayah Desa Babakan Asem memiliki luas sekitar ± 1.527 hektar dengan batas-batas:
          </p>
          <ul className="mt-4 space-y-2 text-gray-800">
            <li><strong>Utara:</strong> Desa Ungkal</li>
            <li><strong>Selatan:</strong> Desa Bugel</li>
            <li><strong>Barat:</strong> Desa Cacaban & Desa Prasih</li>
            <li><strong>Timur:</strong> Desa Cipelang & kawasan BPM Taman</li>
          </ul>
        </div>

        {/* Google Maps Live */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Lokasi Desa Babakan Asem"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.704903283145!2d107.59031737499678!3d-7.161007992841409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68f0dfadceb4e7%3A0xaaaaaa!2sDesa%20Babakan%20Asem!5e0!3m2!1sid!2sid!4v1680000000000"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
