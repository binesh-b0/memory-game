type HighScore = {
    name: string;
    moves: number;
    timeLeft: number;
    timestamp: number;
  };
  
  const HIGH_SCORES_KEY = 'memoryGameHighScores';
  
  export const loadHighScores = (): HighScore[] => {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  };
  
  export const saveHighScores = (scores: HighScore[]): void => {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
  };