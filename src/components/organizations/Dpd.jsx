import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helper } from "../../utils/Helper";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { MemberApi } from "../../libs/api/MemberApi";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Dpd() {
  const navigate = useNavigate();

  const [agenda, setAgenda] = useState([]);
  const [members, setMembers] = useState([]);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 3, "DPD");
    if (response.status === 200) {
      const responseBody = await response.json();
      setAgenda(responseBody.agenda);
    } else {
      alertError("Gagal mengambil data agenda. Silakan coba lagi nanti.");
    }
  };

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("DPD");
    const responseBody = await response.json();
    if (!response.ok) {
      let errorMessage = "Gagal mengambil data anggota.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    setMembers(responseBody.members);
  };

  useEffect(() => {
    fetchAgenda();
    fetchMembers();
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
  }, []);

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ HERO Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50 w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 min-w-0" data-aos="fade-right">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Dewan Perwakilan Desa{" "}
              <span className="text-green-700">Babakan Asem</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
              Menampung aspirasi warga, mengawasi jalannya pemerintahan desa,
              serta memastikan pembangunan desa berjalan transparan.
            </p>
          </div>
          <div className="flex-1 min-w-0 w-full" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800"
              alt="DPD Hero"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ✅ Statistik */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          className="bg-yellow-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-700">6</h2>
          <p className="text-base md:text-lg font-medium">Anggota Aktif</p>
        </div>
        <div
          className="bg-green-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition"
          data-aos="zoom-in"
          data-aos-delay="150"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-700">3</h2>
          <p className="text-base md:text-lg font-medium">Program Tahunan</p>
        </div>
        <div
          className="bg-blue-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700">120+</h2>
          <p className="text-base md:text-lg font-medium">Aspirasi Diterima</p>
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          data-aos="fade-up"
        >
          Struktur Organisasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center p-6 w-full"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* ✅ Foto profil */}
              <img
                src={`${import.meta.env.VITE_BASE_URL}/organizations/images/${member.profile_photo}`}
                alt={member.name ?? member.title}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto object-cover mb-4"
              />

              {/* ✅ Nama lengkap anggota (fallback ke title kalau name kosong) */}
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                {member.name ?? member.title}
              </h3>

              {/* ✅ Jabatan / Posisi */}
              <p className="text-sm md:text-base text-green-700 font-medium">
                {member.position}
              </p>

              {/* ✅ Masa Jabatan */}
              {(member.term_start || member.term_end) && (
                <p className="text-xs text-gray-500 mt-1">
                  {member.term_start} - {member.term_end}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Agenda Preview */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8" data-aos="fade-up">
          Agenda Mendatang
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {agenda.map((item, idx) => (
            <div
              key={item.agenda.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition w-full"
              data-aos="zoom-in"
              data-aos-delay={idx * 150}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${item.agenda.featured_image}`}
                alt={item.agenda.title}
                className="h-40 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-left text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg">
                  {item.agenda.title}
                </h3>
                {(() => {
                  const { tanggal } = Helper.formatAgendaDateTime(
                    item.agenda.start_time,
                    item.agenda.end_time
                  );
                  return (
                    <p className="text-xs sm:text-sm opacity-80">{tanggal}</p>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Tombol ke Detail */}
        <button
          onClick={() => navigate("/detail-dpd")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow-md hover:shadow-lg hover:scale-105 transition font-semibold text-green-900"
          data-aos="fade-up"
        >
          Lihat Agenda Lengkap →
        </button>
      </section>
    </div>
  );
}
