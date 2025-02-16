import { useState, useEffect, useCallback, useRef } from 'react';

type Card = {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameLogicReturn = {
  cards: Card[];
  matches: number[];
  moves: number;
  gameOver: boolean;
  initializeGame: () => void;
  handleCardClick: (id: number) => void;
  resetTrigger: boolean;
};

export default function useGameLogic(pairs: number): GameLogicReturn {
  // Game states
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize game
  const initializeGame = useCallback(() => {
    const values = Array.from({ length: pairs }, (_, i) => i + 1).flatMap(n => [n, n]);
    const shuffled = [...values].sort(() => Math.random() - 0.5);

    setCards(shuffled.map((value, id) => ({
      id,
      value,
      isFlipped: false,
      isMatched: false
    })));
    setFlippedIds([]);
    setMatches([]);
    setMoves(0);
    setGameOver(false);
    setResetTrigger(prev => !prev);
  }, [pairs]);

  const handleCardClick = useCallback((id: number) => {
    if (gameOver || flippedIds.length >= 2 || cards[id]?.isFlipped || cards[id]?.isMatched) return;

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    setFlippedIds(prev => [...prev, id]);
    setMoves(prev => prev + 1);
  }, [gameOver, flippedIds, cards]);

  // Check for matches
  useEffect(() => {
    if (flippedIds.length === 2) {
      const [firstId, secondId] = flippedIds;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard) {
        const isMatch = firstCard.value === secondCard.value;

        timerRef.current = setTimeout(() => {
          setCards(prev => prev.map(card => {
            if ([firstId, secondId].includes(card.id)) {
              return isMatch ? 
                { ...card, isMatched: true } : 
                { ...card, isFlipped: false };
            }
            return card;
          }));

          setFlippedIds([]);
          if (isMatch) {
            const newMatches = [...matches, firstCard.value];
            setMatches(newMatches);
            if (newMatches.length === pairs) setGameOver(true);
          }
        }, 1000);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flippedIds, cards, matches, pairs]);

  return { cards, matches, moves, gameOver, initializeGame, handleCardClick, resetTrigger };
}