const api = {
  user: {
    registerUser: '/auth/registration',
    loginUser: '/auth/user/login',
  },
  feedback: {
    createFeedback: 'feedback/user',
    updateFeedback: (id: string) => `/feedback/${id}`,
  },
  achievement: {
    getUserAchievements: 'achievement/user_achievement',
    updateUserAchievement: 'achievement/user_achievement',
    getAchievements: 'achievement',
  },
  avatar: {
    getUserAvatarBorders: '/avatar/purchased_avatar',
    updateUserAvatarBorder: '/avatar/purchased_avatar',
  },
};

export default api;
