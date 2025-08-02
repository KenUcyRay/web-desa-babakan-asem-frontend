import { Agenda, AgendaType } from "@prisma/client";
import { UserResponse } from "./user-model";

export interface AgendaCreateRequest {
  title: string;
  content: string;
  location: string;
  start_time: Date | string; // ISO 8601 format
  end_time: Date | string; // ISO 8601 format
  is_published?: boolean;
  type: AgendaType;
}
export interface AgendaUpdateRequest {
  title?: string;
  content?: string;
  location?: string;
  start_time?: Date | string; // ISO 8601 format
  end_time?: Date | string;
  is_published?: boolean;
  type?: AgendaType;
}

export interface AgendaGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  agenda: Agenda[];
}

export const toAgendaGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  agenda: Agenda[]
): AgendaGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    agenda,
  };
};

export interface AgendaWithUser {
  user_created: UserResponse;
  agenda: Agenda;
}

export interface AgendaWithUserGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  agenda: AgendaWithUser[];
}

export const toAgendaWithUserGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  agenda: AgendaWithUser[]
): AgendaWithUserGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    agenda,
  };
};
