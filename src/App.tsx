import { useEffect } from 'react';
import useGameLogic from './hooks/useGameLogic';
import Card from './components/Card';

export default function App() {
  const { cards, matches, initializeGame, handleCardClick } = useGameLogic(3);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div style={{ 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1>Memory Game ({matches.length}/3 matched)</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gap: '1rem',
        justifyContent: 'center',
        margin: '2rem 0'
      }}>
        {cards.map(card => (
          <Card
            key={card.id}
            value={card.value}
            isFlipped={card.isFlipped}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
      <button 
        onClick={initializeGame}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1.1rem',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        New Game
      </button>
    </div>
  );
}