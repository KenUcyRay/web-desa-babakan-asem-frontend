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

    console.log("Start Time:", formatterWaktu.format(start));

    const tanggal = formatterTanggal.format(start);
    const waktu = `${formatterWaktu.format(start)} - ${formatterWaktu.format(
      end
    )}`;

    return { tanggal, waktu };
  }
}
