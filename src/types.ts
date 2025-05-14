export type RootStackParamList = {
  Home: undefined;
  Guided: undefined;
  UnGuided: undefined;
  GuidedCategory: {category: string};
  Avatar: undefined;
  Tracing: {
    id: string;
    category: string;
    fromQuiz: boolean;
    isLastQuestion: boolean;
  };
  Achievement: undefined;
  CompletionScreen: {category: string};
  Login: undefined;
  SignUp: undefined;
  FeedbackSection: undefined;
  SettingScreen: undefined;
  QuizScreen: {category: string};
  GuestLogin: undefined;
  QuizHomeScreen: {quizCategory: string; fromCompletionScreen: boolean};
};
