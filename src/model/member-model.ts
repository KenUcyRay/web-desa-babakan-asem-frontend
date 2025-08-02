import { Organization } from "@prisma/client";

export interface MemberCreateRequest {
  name: string;
  position: string;
  term_start: number;
  term_end: number;
  organization_type: Organization;
  is_term: boolean;
  important_level: number; // Optional, defaults to 1 if not provided
}

export interface MemberUpdateRequest {
  name?: string;
  position?: string;
  term_start?: number;
  term_end?: number;
  organization_type?: Organization;
  profile_photo?: string; // Optional for updates
  is_term?: boolean;
  important_level?: number; // Optional, defaults to 1 if not provided
}
