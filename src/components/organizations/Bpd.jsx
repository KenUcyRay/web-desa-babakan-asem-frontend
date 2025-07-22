import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertError } from "../../libs/alert";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { Helper } from "../../utils/Helper";

export default function Bpd() {
  const [agenda, setAgenda] = useState([]);
  const [members, setMembers] = useState([]);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 3, "BPD");
    const responseBody = await response.json();
    if (!response.ok) return alertError("Gagal mengambil data agenda BPD.");
    setAgenda(responseBody.agenda);
  };

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("BPD");
    const responseBody = await response.json();
    if (!response.ok) return alertError("Gagal mengambil data anggota BPD.");
    setMembers(responseBody.members);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
    fetchMembers();
    fetchAgenda();
  }, []);

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ HERO Section */}
      <section
        className="relative bg-gradient-to-b from-green-50 to-white w-full py-12 md:py-16 text-center px-4"
        data-aos="fade-down"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-green-700 mb-4 leading-tight">
          Badan Permusyawaratan Desa
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Lembaga perwakilan masyarakat desa yang berfungsi menampung aspirasi
          warga, mengawasi jalannya pemerintahan desa, serta memastikan
          transparansi pembangunan.
        </p>
      </section>

      {/* ✅ Peran & Tugas */}
      <section
        className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Peran & Tugas Utama BPD
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          Badan Permusyawaratan Desa (BPD) merupakan mitra pemerintah desa dalam
          penyelenggaraan pemerintahan desa. BPD berfungsi sebagai lembaga yang
          menampung dan menyalurkan aspirasi masyarakat, membahas dan
          menyepakati rancangan peraturan desa, serta melakukan pengawasan
          terhadap kinerja pemerintah desa.
        </p>
        <ul className="text-left max-w-2xl mx-auto mt-6 space-y-4">
          {[
            "Menampung aspirasi dan kebutuhan masyarakat desa.",
            "Mengawasi jalannya pemerintahan desa secara transparan.",
            "Memberikan masukan dalam penyusunan APB Desa dan peraturan desa.",
            "Menjadi jembatan komunikasi antara pemerintah desa dan masyarakat.",
          ].map((tugas, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm md:text-base"
              data-aos="fade-right"
              data-aos-delay={i * 100}
            >
              ✅ <span>{tugas}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ✅ Statistik */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { angka: "7", label: "Anggota Aktif" },
            { angka: "4", label: "Program Tahunan" },
            { angka: "90+", label: "Aspirasi Warga" },
          ].map((stat, i) => (
            <div
              key={i}
              className="border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              data-aos="zoom-in"
              data-aos-delay={i * 150}
            >
              <h3 className="text-3xl font-bold text-green-700">{stat.angka}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          Struktur Organisasi BPD
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col items-center bg-white border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <img
                src={
                  member.profile_photo
                    ? `${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`
                    : "/default-user.png"
                }
                alt={member.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-green-300 mb-3"
              />
              <span className="font-semibold text-gray-800 text-sm md:text-base text-center">
                {member.name}
              </span>
              <span className="text-green-700 text-xs md:text-sm mt-1 text-center">
                {member.position}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Agenda BPD */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          Agenda Mendatang
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agenda.map((item, idx) => (
            <div
              key={item.agenda.id}
              className="bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              data-aos="fade-right"
              data-aos-delay={idx * 150}
            >
              <img
                src={
                  item.agenda.featured_image
                    ? `${import.meta.env.VITE_BASE_URL}/agenda/images/${item.agenda.featured_image}`
                    : "/default-agenda.jpg"
                }
                alt={item.agenda.title}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  {item.agenda.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {
                    Helper.formatAgendaDateTime(
                      item.agenda.start_time,
                      item.agenda.end_time
                    ).tanggal
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
