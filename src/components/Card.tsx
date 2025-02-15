
type CardProps = {
  value: number;
  isFlipped: boolean;
  onClick: () => void;
};

export default function Card({ value, isFlipped, onClick }: CardProps) {

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick = {onClick}
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