export type RootStackParamList = {
  Home: undefined;
  Guided: undefined;
  UnGuided: undefined;
  GuidedCategory: {category: string};
  Avatar: undefined;
  Tracing: {id: string; category: string};
  Achievement: undefined;
  CompletionScreen: {category: string};
  Login: undefined;
  SignUp: undefined;
  FeedbackSection: undefined;
  SettingScreen: undefined;
  QuizScreen: {category: 'animals' | 'fruits' | 'body'};
  GuestLogin: undefined;
  QuizHomeScreen: undefined;
};
