export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
}
