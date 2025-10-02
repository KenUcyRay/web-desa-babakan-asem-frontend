import { alertError } from "../libs/alert";

export class Helper {
  // Context constants for error handling
  static CONTEXT = {
    LOGIN: 'login',
    REGISTER: 'register', 
    LOGOUT: 'logout',
    SAVE: 'save',
    DELETE: 'delete',
    UPDATE: 'update',
    FORGOT_PASSWORD: 'forgot_password',
    RESET_PASSWORD: 'reset_password',
    VERIFY_TOKEN: 'verify_token'
  };
  static localToUTC(localDateTime) {
    if (!localDateTime) return "";
    return new Date(localDateTime).toISOString();
  }

  static utcToLocal(utcDateTime) {
    if (!utcDateTime) return "";
    const date = new Date(utcDateTime);
    const tzOffset = date.getTimezoneOffset() * 60000; // offset dalam ms
    const localISOTime = new Date(date - tzOffset).toISOString();
    return localISOTime.slice(0, 16); // ambil "YYYY-MM-DDTHH:mm"
  }
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

  static async errorResponseHandler(responseBody, context = null) {
    // Deteksi bahasa dari localStorage atau default ke Indonesia
    const lang = localStorage.getItem("i18nextLng") || "id";
    const isEnglish = lang.startsWith("en");

    let errorMessage;

    // Pesan default berdasarkan konteks
    if (context === 'login') {
      errorMessage = isEnglish
        ? "Login failed. Please check your credentials."
        : "Login gagal. Periksa email/nomor telepon dan password Anda.";
    } else if (context === 'register') {
      errorMessage = isEnglish
        ? "Registration failed."
        : "Pendaftaran gagal.";
    } else if (context === 'logout') {
      errorMessage = isEnglish
        ? "Logout failed."
        : "Logout gagal.";
    } else if (context === 'forgot_password') {
      errorMessage = isEnglish
        ? "Failed to send reset email."
        : "Gagal mengirim email reset password.";
    } else if (context === 'reset_password') {
      errorMessage = isEnglish
        ? "Failed to reset password."
        : "Gagal mereset password.";
    } else if (context === 'verify_token') {
      errorMessage = isEnglish
        ? "Invalid or expired reset token."
        : "Token reset tidak valid atau sudah kadaluarsa.";
    } else if (context === 'update') {
      errorMessage = isEnglish
        ? "Failed to update data."
        : "Gagal memperbarui data.";
    } else if (context === 'delete') {
      errorMessage = isEnglish
        ? "Failed to delete data."
        : "Gagal menghapus data.";
    } else if (context === 'save') {
      errorMessage = isEnglish
        ? "Failed to save changes."
        : "Gagal menyimpan perubahan.";
    } else {
      errorMessage = isEnglish
        ? "Operation failed."
        : "Operasi gagal.";
    }

    // Handle specific error types
    if (
      responseBody.errors?.name === "ZodError" &&
      Array.isArray(responseBody.errors.issues)
    ) {
      const limit = 2; // Tampilkan maksimal 2 pesan
      const totalErrors = responseBody.errors.issues.length;

      const zodMessages = responseBody.errors.issues
        .slice(0, limit)
        .map((i) => `${i.path?.[0] ?? ""}: ${i.message}`);

      if (totalErrors > limit) {
        const moreText = isEnglish
          ? `...and ${totalErrors - limit} more errors`
          : `...dan ${totalErrors - limit} error lainnya`;
        zodMessages.push(moreText);
      }

      errorMessage = zodMessages.join("<br>");
    } else if (typeof responseBody.errors === "string") {
      // Handle specific error messages
      const errorText = responseBody.errors.toLowerCase();
      
      if (errorText.includes('email') && errorText.includes('already') || errorText.includes('sudah terdaftar')) {
        errorMessage = isEnglish
          ? "Email is already registered. Please use a different email or try logging in."
          : "Email sudah terdaftar. Gunakan email lain atau coba login.";
      } else if (errorText.includes('user') && errorText.includes('not found') || errorText.includes('tidak ditemukan')) {
        errorMessage = isEnglish
          ? "Account not found. Please check your credentials or register first."
          : "Akun belum terdaftar. Periksa data Anda atau daftar terlebih dahulu.";
      } else if (errorText.includes('invalid') && errorText.includes('credentials')) {
        errorMessage = isEnglish
          ? "Invalid credentials. Please check your email/phone and password."
          : "Data login salah. Periksa email/nomor telepon dan password Anda.";
      } else {
        errorMessage = responseBody.errors;
      }
    } else if (responseBody.message) {
      const messageText = responseBody.message.toLowerCase();
      
      if (messageText.includes('email') && messageText.includes('already') || messageText.includes('sudah terdaftar')) {
        errorMessage = isEnglish
          ? "Email is already registered. Please use a different email or try logging in."
          : "Email sudah terdaftar. Gunakan email lain atau coba login.";
      } else if (messageText.includes('user') && messageText.includes('not found') || messageText.includes('tidak ditemukan')) {
        errorMessage = isEnglish
          ? "Account not found. Please check your credentials or register first."
          : "Akun belum terdaftar. Periksa data Anda atau daftar terlebih dahulu.";
      } else {
        errorMessage = responseBody.message;
      }
    }

    await alertError(errorMessage);
  }

  static formatISODate(isoString, locale = "id-ID") {
    const date = new Date(isoString);

    // Opsi format tanggal dan waktu
    const options = {
      year: "numeric",
      month: "long", // "Agustus"
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short", // Menambahkan zona waktu
    };

    return date.toLocaleString(locale, options);
  }
}
