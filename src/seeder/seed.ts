// Untuk setup dan menggunakan database

import { PrismaClient } from "@prisma/client";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Contoh fungsi untuk mengambil data dari database
async function getRegions() {
  const regions = await prisma.region.findMany({
    include: {
      pois: true, // Include related POIs
    },
  });
  return regions;
}

// Contoh fungsi untuk mengambil POI
async function getPOIs() {
  const pois = await prisma.pOI.findMany({
    include: {
      region: true, // Include related region
    },
  });
  return pois;
}

// Contoh API route untuk backend (jika menggunakan Next.js atau framework serupa)
export async function GET(request: Request) {
  try {
    const regions = await getRegions();
    return new Response(JSON.stringify(regions), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch regions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
