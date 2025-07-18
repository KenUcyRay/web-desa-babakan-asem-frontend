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
}
