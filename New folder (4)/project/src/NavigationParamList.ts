export type MainStackParamList = {
  Disclaimer: {};
  MainMenu: {};
  Game: {};
  GameOver: {
    score: number;
    completed: boolean;
  };
};