export interface PkkCreateRequest {
  title: string;
  description: string;
  featured_image: string;
}

export interface PkkUpdateRequest {
  title?: string;
  description?: string;
}
