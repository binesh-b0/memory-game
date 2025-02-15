import { useState } from 'react';

type CardProps = {
  value: number;
};

export default function Card({ value }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        width: '100px',
        height: '100px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isFlipped ? '#4CAF50' : '#fff',
        transition: 'background-color 0.3s'
      }}
    >
      {isFlipped ? value : '?'}
    </div>
  );
}