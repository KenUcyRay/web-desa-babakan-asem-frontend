import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertError } from "../../libs/alert";
import { AgendaApi } from "../../libs/api/AgendaApi";

export default function Bpd() {
  const agendaBPD = [
    { title: "Musyawarah Desa Rencana Kerja 2025", tanggal: "12 Agustus 2025" },
    { title: "Evaluasi APB Desa Semester 1", tanggal: "5 September 2025" },
    { title: "Reses & Penyerapan Aspirasi Warga", tanggal: "20 Oktober 2025" },
  ];

  const [agenda, setAgenda] = useState([]);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 3, "BPD"); // ambil 3 agenda terbaru
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data agenda BPD.");
      return;
    }
    setAgenda(responseBody.agenda);
  };

  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("BPD");
    const responseBody = await response.json();
    if (!response.ok) {
      await alertError("Gagal mengambil data anggota BPD.");
      return;
    }
    setMembers(responseBody.members);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
    fetchMembers(); // Panggil saat mount
    fetchAgenda();
  }, []);

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ HERO Section - teks tengah */}
      <section
        className="relative bg-gradient-to-b from-green-50 to-white w-full py-16 text-center"
        data-aos="fade-down"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          Badan Permusyawaratan Desa
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Lembaga perwakilan masyarakat desa yang berfungsi menampung aspirasi
          warga, mengawasi jalannya pemerintahan desa, serta memastikan
          transparansi pembangunan.
        </p>
      </section>

      {/* ✅ Penjelasan & Tugas BPD */}
      <section
        className="max-w-screen-lg mx-auto px-6 py-12 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Peran & Tugas Utama BPD
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          Badan Permusyawaratan Desa (BPD) merupakan mitra pemerintah desa dalam
          penyelenggaraan pemerintahan desa. BPD berfungsi sebagai lembaga yang
          menampung dan menyalurkan aspirasi masyarakat, membahas dan
          menyepakati rancangan peraturan desa, serta melakukan pengawasan
          terhadap kinerja pemerintah desa.
        </p>
        <ul className="text-left max-w-2xl mx-auto mt-6 space-y-3">
          <li className="flex items-start gap-3" data-aos="fade-right">
            ✅ <span>Menampung aspirasi dan kebutuhan masyarakat desa.</span>
          </li>
          <li
            className="flex items-start gap-3"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            ✅{" "}
            <span>Mengawasi jalannya pemerintahan desa secara transparan.</span>
          </li>
          <li
            className="flex items-start gap-3"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            ✅{" "}
            <span>
              Memberikan masukan dalam penyusunan APB Desa dan peraturan desa.
            </span>
          </li>
          <li
            className="flex items-start gap-3"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            ✅{" "}
            <span>
              Menjadi jembatan komunikasi antara pemerintah desa dan masyarakat.
            </span>
          </li>
        </ul>
      </section>

      {/* ✅ Statistik BPD (style simple) */}
      <section className="max-w-screen-lg mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div
          className="border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          data-aos="zoom-in"
        >
          <h3 className="text-3xl font-bold text-green-700">7</h3>
          <p className="text-gray-600 mt-2">Anggota Aktif</p>
        </div>
        <div
          className="border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          data-aos="zoom-in"
          data-aos-delay="150"
        >
          <h3 className="text-3xl font-bold text-green-700">4</h3>
          <p className="text-gray-600 mt-2">Program Tahunan</p>
        </div>
        <div
          className="border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <h3 className="text-3xl font-bold text-green-700">90+</h3>
          <p className="text-gray-600 mt-2">Aspirasi Warga</p>
        </div>
      </section>

      {/* ✅ Struktur Organisasi BPD */}
      <section className="max-w-screen-lg mx-auto px-6 py-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          Struktur Organisasi BPD
        </h2>
        <div className="space-y-4">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-white border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <span className="font-semibold text-gray-800 text-lg">
                {member.name}
              </span>
              <span className="text-green-700 text-sm mt-1 sm:mt-0">
                {member.position}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Agenda BPD - versi list simple */}
      <section className="max-w-screen-lg mx-auto px-6 py-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          Agenda Mendatang
        </h2>
        <div className="space-y-4">
          {agenda.map((item, idx) => (
            <div
              key={item.agenda.id}
              className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl p-4 hover:shadow-md transition"
              data-aos="fade-right"
              data-aos-delay={idx * 150}
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  {item.agenda.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    Helper.formatAgendaDateTime(
                      item.agenda.start_time,
                      item.agenda.end_time
                    ).tanggal
                  }
                </p>
              </div>
              <span className="text-green-600 text-sm font-medium">📅</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
