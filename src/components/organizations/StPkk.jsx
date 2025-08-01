import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MemberApi } from "../../libs/api/MemberApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertError } from "../../libs/alert";
import { useTranslation } from "react-i18next";

export default function StPkk() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [galery, setGalery] = useState([]);

  const fetchMembers = async () => {
    const response = await MemberApi.getMembers("PKK");
    const responseBody = await response.json();

    if (!response.ok) {
      await alertError(t("detailPkk.errorMembers"));
      return;
    }
    setMembers(responseBody.members);
  };

  const fetchGalery = async () => {
    const response = await GaleryApi.getGaleri(1, 8, "PKK");
    if (response.status === 200) {
      const responseBody = await response.json();
      setGalery(responseBody.galeri);
    } else {
      await alertError(t("detailPkk.errorGalery"));
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
    fetchMembers();
    fetchGalery();
  }, []);

  return (
    <div className="font-poppins text-gray-800 w-full">
      <section
        className="relative bg-gradient-to-b from-green-50 to-white w-full py-16 text-center"
        data-aos="fade-down"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          {t("detailPkk.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("detailPkk.subtitle")}
        </p>
      </section>

      <section className="max-w-screen-lg mx-auto px-6 py-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          {t("detailPkk.structureTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    ? `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                        member.profile_photo
                      }`
                    : "/default-user.png"
                }
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full border-2 border-green-300 mb-3"
              />
              <span className="font-semibold text-gray-800 text-lg text-center">
                {member.name}
              </span>
              <span className="text-green-700 text-sm mt-1">
                {member.position}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-screen-lg mx-auto px-6 py-12">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          {t("detailPkk.galleryTitle")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galery.map((item, idx) => (
            <div
              key={item.id}
              className="relative group"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                  item.image
                }`}
                alt="Galeri PKK"
                className="rounded-xl shadow-md w-full h-48 object-cover group-hover:opacity-80 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white text-sm font-medium rounded-xl">
                {t("detailPkk.galleryLabel")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
