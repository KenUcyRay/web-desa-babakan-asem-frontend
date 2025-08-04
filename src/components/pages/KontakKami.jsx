import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "@fontsource/poppins";
import { MessageApi } from "../../libs/api/MessageApi";
import { alertSuccess, alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";

export default function KontakKami() {
  const { t } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await MessageApi.create(name, email, message);
    const responseBody = await response.json();

    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }
    await alertSuccess(t("contact.form.success"));

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="font-poppins">
      {/* - Banner */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t("contact.hero.title")}
        </h1>
        <p
          className="mt-2 text-gray-800 text-lg"
          dangerouslySetInnerHTML={{
            __html: t("contact.hero.description"),
          }}
        />
      </div>

      {/* - Content */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 gap-10 px-4">
        {/* - Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gray-50 p-6 border-b text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("contact.form.title")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {t("contact.form.description")}
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-[#9BEC00] to-[#D2FF72]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.placeholder_name")}
                  className="w-full rounded-lg p-3 bg-white shadow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  {t("contact.form.email")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.placeholder_email")}
                  className="w-full rounded-lg p-3 bg-white shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows="4"
                  placeholder={t("contact.form.placeholder_message")}
                  className="w-full rounded-lg p-3 bg-white shadow"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:scale-105 transition"
                >
                  {t("contact.form.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* - Info Kontak */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-xl shadow-lg bg-white flex gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] text-gray-900">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {t("contact.info.address.title")}
              </h4>
              <p className="text-sm text-gray-600">
                {t("contact.info.address.detail")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="tel:085330192025"
              className="p-5 rounded-xl shadow-md bg-white flex flex-col gap-2"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] text-gray-900">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {t("contact.info.phone.title")}
                </h4>
                <p className="text-xs text-gray-700">
                  {t("contact.info.phone.number")}
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/6285330192025"
              className="p-5 rounded-xl shadow-md bg-white flex flex-col gap-2"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] text-gray-900">
                <FaWhatsapp />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {t("contact.info.whatsapp.title")}
                </h4>
                <p className="text-xs text-gray-700">
                  {t("contact.info.whatsapp.number")}
                </p>
              </div>
            </a>
          </div>

          <a
            href="mailto:babakanasem@gmail.com"
            className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] text-gray-900">
              <FaEnvelope />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">
                {t("contact.info.email.title")}
              </h4>
              <p className="text-sm text-gray-700">
                {t("contact.info.email.address")}
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
