export interface CreateVillageAchievementRequest {
  title: string;
  description: string;
  date: Date;
  featured_image: string;
}

export interface UpdateVillageAchievementRequest {
  title?: string;
  description?: string;
  date?: Date;
  featured_image?: string;
}
