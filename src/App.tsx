import { useState } from 'react';
import Card from './components/Card';

export default function App() {
  const [cards] = useState([1, 1, 2, 2, 3, 3]); // Simple pairs
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      maxWidth: '400px',
      margin: '2rem auto'
    }}>
      {cards.map((value, index) => (
        <Card key={index} value={value} />
      ))}
    </div>
  );
}