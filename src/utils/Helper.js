import { alertError } from "../libs/alert";

export class Helper {
  static formatTanggal(isoString) {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  static formatRupiahMillion(angka, language = "id") {
    if (angka >= 1000000) {
      const million = angka / 1000000;
      const millionText = language === "en" ? "million" : "juta";
      return `${
        million % 1 === 0 ? million.toFixed(0) : million.toFixed(1)
      } ${millionText}`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  static formatAgendaDateTime(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const formatterTanggal = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });

    const formatterWaktu = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    });

    const tanggal = formatterTanggal.format(start);
    const waktu = `${formatterWaktu.format(start)} - ${formatterWaktu.format(
      end
    )}`;

    return { tanggal, waktu };
  }
  static truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  static formatText(text) {
    if (!text) return "-";
    return text
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  static async errorResponseHandler(responseBody) {
    let errorMessage = "Gagal menyimpan perubahan.";
    if (responseBody.error && Array.isArray(responseBody.error)) {
      const errorMessages = responseBody.error.map((err) =>
        err.path?.length ? `${err.path[0]}: ${err.message}` : err.message
      );
      errorMessage = errorMessages.join(", ");
    } else if (typeof responseBody.error === "string") {
      errorMessage = responseBody.error;
    }
    await alertError(errorMessage);
  }
}
