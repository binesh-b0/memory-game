import { useEffect, useState } from 'react';
import useGameLogic from './hooks/useGameLogic';
import Card from './components/Card';
import {
  CircularProgress,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 4, moveLimit: 20, timeLimit: 60 },
  medium: { pairs: 6, moveLimit: 30, timeLimit: 90 },
  hard: { pairs: 8, moveLimit: 40, timeLimit: 120 }
};

export default function App() {
  // Game states
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_SETTINGS>('easy');
  const { pairs, moveLimit, timeLimit } = DIFFICULTY_SETTINGS[difficulty];
  const { cards, matches, moves, gameOver, initializeGame, handleCardClick, resetTrigger } = useGameLogic(pairs);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleDifficultyChange = (event: SelectChangeEvent<keyof typeof DIFFICULTY_SETTINGS>) => {
    setDifficulty(event.target.value as keyof typeof DIFFICULTY_SETTINGS);
  };

  // Timer management
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Game over conditions
  useEffect(() => {
    if (gameOver || timeLeft === 0 || moves >= moveLimit) {
      setShowGameOver(true);
      setGameStarted(false);
    }
  }, [gameOver, timeLeft, moves, moveLimit]);

  // Reset game state
  useEffect(() => {
    setTimeLeft(timeLimit);
    setGameStarted(false);
    setShowGameOver(false);
  }, [resetTrigger, timeLimit]);

  // Start game when first move is made
  useEffect(() => {
    if (moves > 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [moves, gameStarted]);

  return (
    <Container 
      maxWidth={false}
      sx={{
        py: 4,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        font:'popins'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          maxWidth: '800px',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Game Over Overlay */}
        <Dialog open={showGameOver} onClose={() => setShowGameOver(false)}>
          <DialogTitle>
            {matches.length === pairs ? '🎉 Congratulations!' : 'Game Over'}
          </DialogTitle>
          <DialogContent>
            {matches.length === pairs ? (
              <Typography>You won in {moves} moves!</Typography>
            ) : (
              <Typography>Better luck next time!</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                initializeGame();
                setShowGameOver(false);
              }}
            >
              Play Again
            </Button>
          </DialogActions>
        </Dialog>

        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Select
            value={difficulty}
            onChange={handleDifficultyChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </Box>

        {/* Game Stats (Graphical Metrics) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mb: 3 }}>
          {/* Time Left */}
          <Tooltip title="Time Left" placement="top">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={(timeLeft / timeLimit) * 100}
              size={60}
              thickness={4}
              color="primary"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption">{timeLeft}s</Typography>
            </Box>
          </Box>
          </Tooltip>

          {/* Moves */}
          <Tooltip title="Moves" placement="top">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={(moves / moveLimit) * 100}
              size={60}
              thickness={4}
              color="secondary"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AutorenewIcon fontSize="small" />
              <Typography variant="caption">{moves}</Typography>
            </Box>
          </Box>
          </Tooltip>

          {/* Matched */}
          <Tooltip title="Matches" placement="top">

          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={(matches.length / pairs) * 100}
              size={60}
              thickness={4}
              sx={{ color: '#4caf50' }}
              />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              >
              <CheckCircleIcon fontSize="small" />
              <Typography variant="caption">{matches.length}</Typography>
            </Box>
          </Box>
              </Tooltip>
        </Box>

        {/* Game Board */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(6, 1fr)' },
            gap: 2,
            mb: 3
          }}
        >
          {cards.map(card => (
            <Box key={card.id} sx={{ aspectRatio: '1' }}>
              <Card
                value={card.value}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(card.id)}
              />
            </Box>
          ))}
        </Box>

        {/* Controls */}
        <Button
          variant="contained"
          color="primary"
          onClick={initializeGame}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          New Game
        </Button>
      </Paper>
    </Container>
  );
}
