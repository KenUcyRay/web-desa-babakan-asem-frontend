import React, { useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "@fontsource/poppins";
import { MessageApi } from "../../libs/api/MessageApi";
import { ContactApi } from "../../libs/api/ContactApi";
import { alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";

export default function KontakKami() {
  const { t, i18n } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [contacts, setContacts] = React.useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = React.useState(true);

  const iconMap = {
    LOKASI: FaMapMarkerAlt,
    TELEPON: FaPhoneAlt,
    WHATSAPP: FaWhatsapp,
    EMAIL: FaEnvelope,
  };

  const getContactIcon = (type) => {
    return iconMap[type] || FaEnvelope;
  };

  const getContactLink = (contact) => {
    switch (contact.type) {
      case "TELEPON":
        return `tel:${contact.value}`;
      case "WHATSAPP":
        // Format nomor untuk WhatsApp (tambah 62 jika dimulai dengan 0)
        const waNumber = contact.value.startsWith("0")
          ? "62" + contact.value.substring(1)
          : contact.value;
        return `https://wa.me/${waNumber}`;
      case "EMAIL":
        return `mailto:${contact.value}`;
      default:
        return null;
    }
  };

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await ContactApi.getPublic();
      console.log("Contacts fetched:", response);
      setContacts(response);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await MessageApi.create(
        name,
        email,
        message,
        i18n.language
      );
      const responseBody = await response.json();

      if (!response.ok) {
        await Helper.errorResponseHandler(responseBody);
        return;
      }
      await alertSuccess(t("contact.form.success"));

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
      await Helper.errorResponseHandler({ message: error.message });
    }
  };

  // Render contact card
  const renderContactCard = (contact) => {
    const Icon = getContactIcon(contact.type);
    const link = getContactLink(contact);
    const isClickable = link !== null;

    const CardContent = () => (
      <>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-[#B6F500] text-gray-900">
          <Icon />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">
            {contact.label}
          </h4>
          <p className="text-xs text-gray-700">
            {contact.value}
          </p>
        </div>
      </>
    );

    const baseClasses = "p-5 rounded-xl shadow-md bg-white flex flex-col gap-2";

    if (isClickable) {
      return (
        <a
          key={contact.id}
          href={link}
          className={`${baseClasses}`}
          target={contact.type === "WHATSAPP" ? "_blank" : undefined}
          rel={contact.type === "WHATSAPP" ? "noopener noreferrer" : undefined}
        >
          <CardContent />
        </a>
      );
    }

    return (
      <div key={contact.id} className={baseClasses}>
        <CardContent />
      </div>
    );
  };

  // Separate contacts by type
  const lokasiContact = contacts.find((c) => c.type === "LOKASI");
  const otherContacts = contacts.filter((c) => c.type !== "LOKASI");

  return (
    <div className="font-poppins">
      {/* - Banner */}
      <div className="bg-gradient-to-r from-green-400 to-[#B6F500] py-16 text-center">
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
          <div className="bg-green-50 p-6 border-b text-center">
            <h2 className="text-2xl font-bold text-green-800">
              {t("contact.form.title")}
            </h2>
            <p className="text-green-600 text-sm mt-1">
              {t("contact.form.description")}
            </p>
          </div>
          <div className="p-6 bg-white">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.placeholder_name")}
                  className="w-full rounded-lg p-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("contact.form.placeholder_email")}
                  className="w-full rounded-lg p-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows="4"
                  placeholder={t("contact.form.placeholder_message")}
                  className="w-full rounded-lg p-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-br from-green-400 to-[#B6F500] text-gray-900 font-semibold rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  {t("contact.form.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* - Info Kontak Dinamis */}
        <div className="flex flex-col gap-6">
          {isLoadingContacts ? (
            <div className="p-6 rounded-xl shadow-lg bg-white text-center">
              <div className="flex justify-center items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Memuat kontak...</p>
              </div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-6 rounded-xl shadow-lg bg-white text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-5 rounded-full">
                  <FaEnvelope className="text-4xl text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Belum Ada Kontak
              </h3>
              <p className="text-gray-500">Informasi kontak belum tersedia</p>
            </div>
          ) : (
            <>
              {/* Lokasi/Alamat - Full width */}
              {lokasiContact && (
                <div className="p-6 rounded-xl shadow-lg bg-white flex gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-[#B6F500] text-gray-900">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {lokasiContact.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {lokasiContact.value}
                    </p>
                  </div>
                </div>
              )}

              {/* Other contacts - Grid 2 columns atau items */}
              {otherContacts.length > 0 && (
                <>
                  {otherContacts.length === 1 ? (
                    // Jika hanya 1 contact, tampilkan full width
                    <a
                      href={getContactLink(otherContacts[0])}
                      className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4"
                      target={otherContacts[0].type === "WHATSAPP" ? "_blank" : undefined}
                      rel={otherContacts[0].type === "WHATSAPP" ? "noopener noreferrer" : undefined}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-[#B6F500] text-gray-900">
                        {React.createElement(getContactIcon(otherContacts[0].type))}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {otherContacts[0].label}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {otherContacts[0].value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    // Jika lebih dari 1, tampilkan dalam grid
                    <div className="grid grid-cols-2 gap-4">
                      {otherContacts.map((contact) => renderContactCard(contact))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}