export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: string;
  is_earned: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
}
