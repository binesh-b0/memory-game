import { useCallback, useEffect, useState } from 'react';
import { loadHighScores, saveHighScores } from '../utils/storage';

type HighScore = {
  name: string;
  moves: number;
  timeLeft: number;
  timestamp: number;
};

export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    const scores = loadHighScores()
      .sort((a, b) => a.moves - b.moves)
      .slice(0, 10);
    setHighScores(scores);
  }, []);

  const addHighScore = useCallback((name: string, moves: number, timeLeft: number) => {
    setHighScores(prev => {
      const newScore = { name, moves, timeLeft, timestamp: Date.now() };
      const updatedScores = [...prev, newScore]
        .sort((a, b) => a.moves - b.moves)
        .slice(0, 10);
      saveHighScores(updatedScores);
      return updatedScores;
    });
  }, []);

  return { highScores, addHighScore };
};
