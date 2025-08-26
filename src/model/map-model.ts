import { MapType } from "@prisma/client";

export type coordinates = number[][] | number[];

export interface CreateMapRequest {
  type: MapType;
  name: string;
  description: string;
  year: number;
  coordinates: coordinates;
  color?: string;
  radius?: number;
  icon?: string;
}

export interface UpdateMapRequest {
  type: MapType;
  name: string;
  description: string;
  year: number;
  coordinates: coordinates;
  color?: string;
  radius?: number;
  icon?: string;
}
