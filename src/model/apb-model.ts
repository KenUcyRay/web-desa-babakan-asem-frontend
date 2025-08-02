export interface CreateApbRequest {
  bidang: string;
  anggaran: number;
  realisasi: number;
  tahun: Date;
}

export interface UpdateApbRequest {
  bidang?: string;
  anggaran?: number;
  realisasi?: number;
  tahun?: Date;
}
