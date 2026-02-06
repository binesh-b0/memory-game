import { motion } from 'framer-motion';
import { alpha, styled, useTheme } from '@mui/material/styles';

type CardProps = {
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
  shake?: boolean;
  pulse?: boolean;
  onClick: () => void;
};

const CardButton = styled(motion.button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  display: 'block',
  perspective: 1000,
  WebkitTapHighlightColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
  '&:disabled': {
    cursor: 'default',
  },
  '&:focus-visible': {
    outline: `3px solid ${alpha(theme.palette.primary.main, 0.6)}`,
    outlineOffset: 2,
  },
}));

const CardInner = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  borderRadius: theme.shape.borderRadius,
}));

const Face = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  display: 'grid',
  placeItems: 'center',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
  boxShadow: `0 12px 30px ${alpha('#000', 0.35)}`,
  userSelect: 'none',
}));

export default function Card({ value, isFlipped, isMatched, shake = false, pulse = false, onClick }: CardProps) {
  const theme = useTheme();
  const faces = ['🧠', '⚡', '🌙', '🔥', '🎧', '🧩', '🍀', '🚀'];
  const face = faces[value - 1] ?? '⭐';

  const backGradient = isMatched
    ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.95)}, ${alpha(theme.palette.success.dark, 0.9)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)}, ${alpha(theme.palette.secondary.main, 0.9)})`;

  const frontBg = `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.06)}, ${alpha(theme.palette.common.white, 0.03)})`;

  return (
    <CardButton
      type="button"
      onClick={!isMatched ? onClick : undefined}
      disabled={isMatched}
      whileHover={!isMatched ? { y: -2 } : undefined}
      whileTap={!isMatched ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        x: shake ? [0, -6, 6, -4, 4, 0] : 0,
        scale: isMatched ? 0.97 : pulse ? 1.03 : 1,
      }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-label={isFlipped ? `Card ${face}` : 'Hidden card'}
    >
      <CardInner
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 38 }}
      >
        <Face style={{ background: frontBg }}>
          <span
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              letterSpacing: -0.6,
              color: alpha(theme.palette.common.white, 0.85),
            }}
          >
            ?
          </span>
        </Face>
        <Face style={{ transform: 'rotateY(180deg)', background: backGradient }}>
          <span style={{ fontSize: '2.1rem', lineHeight: 1 }}>{face}</span>
        </Face>
      </CardInner>
    </CardButton>
  );
}
