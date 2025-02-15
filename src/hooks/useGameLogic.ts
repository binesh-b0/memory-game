import { useState, useEffect, useCallback } from 'react';

type Card = {
  id: number;
  value: number;
  isFlipped: boolean;
};

export default function useGameLogic(pairs: number) {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);

  // Initialize cards
  const initializeGame = useCallback(() => {
    const values = [...Array(pairs).keys()].flatMap(n => [n, n]);
    const shuffled = values.sort(() => Math.random() - 0.5);
    
    setCards(shuffled.map((value, id) => ({
      id,
      value,
      isFlipped: false
    })));
    setFlippedIds([]);
    setMatches([]);
  }, [pairs]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (flippedIds.length === 2 || cards[id].isFlipped) return;

    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    setFlippedIds([...flippedIds, id]);
  };

  // Check for matches
  useEffect(() => {
    if (flippedIds.length === 2) {
      const [first, second] = flippedIds;
      const isMatch = cards[first].value === cards[second].value;

      setTimeout(() => {
        setCards(cards.map(card => {
          if (!isMatch && (card.id === first || card.id === second)) {
            return { ...card, isFlipped: false };
          }
          return card;
        }));
        setFlippedIds([]);

        if (isMatch) {
          setMatches([...matches, cards[first].value]);
        }
      }, 1000);
    }
  }, [flippedIds]);

  return { cards, matches, initializeGame, handleCardClick };
}