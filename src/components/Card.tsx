import { motion } from 'framer-motion';

type CardProps = {
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
};

export default function Card({ value, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <motion.div
      onClick={!isMatched ? onClick : undefined}
      style={{
        width: '100%',
        height: '100%',
        perspective: '1000px',
        cursor: isMatched ? 'default' : 'pointer'
      }}
      animate={{
        rotateY: isFlipped ? 180 : 0,
        scale: isMatched ? 0.95 : 1

      }}
      transition={{ duration: 0.6 }}
    >
      {/* Card Container */}
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minWidth: '80px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Face - Question Mark */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '2px solid #e0e0e0',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
          animate={{
             rotateY: isFlipped ? 180 : 0, 
             scaleX: isFlipped ? -1 : 1  // Fix mirror effect

            }}
        >
          ?
        </motion.div>
        
        {/* Back Face - Card Value */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isMatched ? '#4CAF50' : '#2196F3',
            borderRadius: '8px',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            transform: 'rotateY(180deg)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
          animate={{ 
            rotateY: isFlipped ? 0 : 180,
            scaleX: isFlipped ? -1 : 1  // Fix mirror effect
          }}
        >
          {value}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}