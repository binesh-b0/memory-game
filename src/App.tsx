import { useEffect, useState } from 'react';
import Card from './components/Card';

type CardType = {
  id: number;
  value: number;
  isFlipped: boolean;
};

export default function App() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedIds, setFlippedIds] = useState<number[]>([]);

  // initialize cards
  useEffect(() => {
    const initialCards = [1,1,2,2,3,3,]
    .map((value,id)=>({id,value,isFlipped:false}));
    setCards(initialCards);
  }, []);

  const handleCardClick = (id:number) => {
    if (flippedIds.length === 2 || flippedIds.includes(id)) return;
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    // check if the flipped cards are a match
    setTimeout(() => {
      const [first, second] = newFlipped;
      if (cards[first].value !== cards[second].value) {
        setCards(cards.map(card => 
          card.id === first || card.id === second
          ? {...card, isFlipped:false}
          : card
        ));
      }
    }, 1000);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      maxWidth: '400px',
      margin: '2rem auto'
    }}>
     {cards.map(card => (
        <Card
          key={card.id}
          value={card.value}
          isFlipped={card.isFlipped || flippedIds.includes(card.id)}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
}