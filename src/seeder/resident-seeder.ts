import { PrismaClient } from "@prisma/client";
import { ResidentType } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.resident.createMany({
    data: [
      {
        key: "Laki-laki",
        value: 600,
        resident_type: ResidentType.GENDER,
      },
      {
        key: "Perempuan",
        value: 500,
        resident_type: ResidentType.GENDER,
      },
      {
        key: "Kepala Keluarga",
        value: 300,
        resident_type: ResidentType.KEPALA_KELUARGA,
      },
      {
        key: "Anak-anak",
        value: 400,
        resident_type: ResidentType.ANAK_ANAK,
      },
      {
        key: "Petani",
        value: 200,
        resident_type: ResidentType.PERKERJAAN,
      },
      {
        key: "Nelayan",
        value: 50,
        resident_type: ResidentType.PERKERJAAN,
      },
      { key: "Guru", value: 30, resident_type: ResidentType.PERKERJAAN },
      { key: "Pedagang", value: 80, resident_type: ResidentType.PERKERJAAN },
      { key: "Pengawai", value: 40, resident_type: ResidentType.PERKERJAAN },
      {
        key: "Sd",
        value: 250,
        resident_type: ResidentType.PENDIDIKAN,
      },
      {
        key: "Smp",
        value: 300,
        resident_type: ResidentType.PENDIDIKAN,
      },
      {
        key: "Sma",
        value: 200,
        resident_type: ResidentType.PENDIDIKAN,
      },
      {
        key: "S1",
        value: 100,
        resident_type: ResidentType.PENDIDIKAN,
      },
      {
        key: "S2",
        value: 50,
        resident_type: ResidentType.PENDIDIKAN,
      },
      {
        key: "Menikah",
        value: 450,
        resident_type: ResidentType.PERNIKAHAN,
      },
      {
        key: "Cerai",
        value: 50,
        resident_type: ResidentType.PERNIKAHAN,
      },
      {
        key: "Belum Menikah",
        value: 300,
        resident_type: ResidentType.PERNIKAHAN,
      },
      {
        key: "Islam",
        value: 700,
        resident_type: ResidentType.AGAMA,
      },
      {
        key: "Kristen",
        value: 100,
        resident_type: ResidentType.AGAMA,
      },
      {
        key: "Hindu",
        value: 50,
        resident_type: ResidentType.AGAMA,
      },
      {
        key: "Buddha",
        value: 20,
        resident_type: ResidentType.AGAMA,
      },
      {
        key: "0-5",
        value: 50,
        resident_type: ResidentType.USIA,
      },
      {
        key: "6-17",
        value: 150,
        resident_type: ResidentType.USIA,
      },

      {
        key: "18-40",
        value: 300,
        resident_type: ResidentType.USIA,
      },
      {
        key: "41-60",
        value: 200,
        resident_type: ResidentType.USIA,
      },
      {
        key: "61+",
        value: 100,
        resident_type: ResidentType.USIA,
      },
      {
        key: "Dusun A",
        value: 300,
        resident_type: ResidentType.DUSUN,
      },
      {
        key: "Dusun B",
        value: 250,
        resident_type: ResidentType.DUSUN,
      },
      {
        key: "Dusun C",
        value: 220,
        resident_type: ResidentType.DUSUN,
      },
    ],
  });
};

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
