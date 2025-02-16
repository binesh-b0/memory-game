import { useState, useEffect } from 'react';
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
    setHighScores(loadHighScores());
  }, []);

  const addHighScore = (name: string, moves: number, timeLeft: number) => {
    const newScore = { name, moves, timeLeft, timestamp: Date.now() };
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => a.moves - b.moves)
      .slice(0, 10);
    setHighScores(updatedScores);
    saveHighScores(updatedScores);
  };

  return { highScores, addHighScore };
};