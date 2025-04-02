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
    getUserAchievements: '/user_Achievement',
    updateUserAchievement: '/user_Achievement',
  },
  avatar: {
    getUserAvatarBorders: '/avatar/purchased_avatar',
    updateUserAvatarBorder: '/avatar/purchased_avatar',
  },
};

export default api;
