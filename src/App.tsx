import { useEffect, useMemo, useRef, useState } from 'react';
import useGameLogic from './hooks/useGameLogic';
import { useHighScores } from './hooks/useHighScores';
import Card from './components/Card';
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 4, moveLimit: 20, timeLimit: 60 },
  medium: { pairs: 6, moveLimit: 30, timeLimit: 90 },
  hard: { pairs: 8, moveLimit: 40, timeLimit: 120 }
} as const;

type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { pairs, moveLimit, timeLimit } = DIFFICULTY_SETTINGS[difficulty];
  const { cards, matches, moves, gameOver, initializeGame, handleCardClick, resetTrigger } = useGameLogic(pairs);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const { highScores, addHighScore } = useHighScores();
  const [modalOpen, setModalOpen] = useState(false);
  const savedScoreRef = useRef(false);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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

  useEffect(() => {
    if (!gameStarted && moves === 0) return;

    const hasWon = matches.length === pairs;
    const outOfTime = timeLeft === 0;
    const outOfMoves = moves >= moveLimit;

    if (hasWon && !savedScoreRef.current) {
      savedScoreRef.current = true;
      addHighScore('Player', moves, timeLeft);
    }

    if (hasWon || gameOver || outOfTime || outOfMoves) {
      setShowGameOver(true);
      setGameStarted(false);
    }
  }, [addHighScore, gameOver, gameStarted, matches.length, moveLimit, moves, pairs, timeLeft]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setGameStarted(false);
    setShowGameOver(false);
    savedScoreRef.current = false;
  }, [resetTrigger, timeLimit]);

  useEffect(() => {
    if (moves > 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [moves, gameStarted]);

  const bestScore = useMemo(() => {
    if (highScores.length === 0) return null;
    return [...highScores].sort((a, b) => a.moves - b.moves)[0];
  }, [highScores]);

  const movesLeft = Math.max(moveLimit - moves, 0);
  const boardColumns = difficulty === 'medium' ? { xs: 'repeat(4, 1fr)', sm: 'repeat(6, 1fr)' } : { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)' };
  const hasWon = matches.length === pairs;
  const outOfTime = timeLeft === 0;
  const outOfMoves = moves >= moveLimit;
  const showBestLabel = bestScore ? `Best: ${bestScore.moves} moves` : 'No scores yet';

  return (
    <Container 
      maxWidth="md"
      sx={{
        py: { xs: 3, sm: 5 },
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          width: '100%',
          position: 'relative',
          borderRadius: 4,
          boxShadow: '0 22px 70px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Dialog open={showGameOver} onClose={() => setShowGameOver(false)}>
          <DialogTitle>{hasWon ? 'You win' : 'Game over'}</DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              <Typography color="text.secondary">
                {hasWon ? 'Clean match.' : outOfTime ? 'Out of time.' : outOfMoves ? 'Out of moves.' : 'Try again.'}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip icon={<AutorenewIcon />} label={`${moves} moves`} variant="outlined" />
                <Chip icon={<AccessTimeIcon />} label={`${timeLeft}s left`} variant="outlined" />
                <Chip icon={<CheckCircleIcon />} label={`${matches.length}/${pairs} matched`} variant="outlined" />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGameOver(false)} variant="outlined">
              Close
            </Button>
            <Button
              onClick={() => {
                initializeGame();
                setShowGameOver(false);
              }}
              variant="contained"
            >
              Play again
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>High scores</DialogTitle>
          <DialogContent>
            <List sx={{ p: 0 }} disablePadding>
              {highScores.length === 0 ? (
                <ListItem disablePadding>
                  <ListItemText primary="No scores yet." secondary="Win a game to save your best run." />
                </ListItem>
              ) : (
                highScores.map((score, index) => (
                  <ListItem key={score.timestamp} disablePadding sx={{ py: 0.75 }}>
                    <ListItemText
                      primary={`${index + 1}. ${score.name}`}
                      secondary={`${score.moves} moves • ${score.timeLeft}s left`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4">Memory match</Typography>
            <Typography variant="body2" color="text.secondary">
              Flip two cards. Match all pairs before time or moves run out.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <ToggleButtonGroup
              value={difficulty}
              exclusive
              onChange={(_, value: Difficulty | null) => value && setDifficulty(value)}
              size="small"
            >
              <ToggleButton value="easy">Easy</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="hard">Hard</ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title="High scores">
              <IconButton onClick={() => setModalOpen(true)} aria-label="High scores">
                <LeaderboardIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Chip icon={<EmojiEventsIcon />} label={showBestLabel} variant="outlined" />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Chip label={`${pairs * 2} cards`} variant="outlined" />
            <Chip label={`${movesLeft} moves left`} variant="outlined" />
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
          {[
            {
              key: 'time',
              label: 'Time',
              value: `${timeLeft}s`,
              progress: (timeLeft / timeLimit) * 100,
              icon: <AccessTimeIcon fontSize="small" />,
              color: 'secondary.main',
            },
            {
              key: 'moves',
              label: 'Moves',
              value: `${movesLeft}`,
              progress: (moves / moveLimit) * 100,
              icon: <AutorenewIcon fontSize="small" />,
              color: 'primary.main',
            },
            {
              key: 'matches',
              label: 'Matched',
              value: `${matches.length}/${pairs}`,
              progress: (matches.length / pairs) * 100,
              icon: <CheckCircleIcon fontSize="small" />,
              color: 'success.main',
            },
          ].map(stat => (
            <Paper
              key={stat.key}
              variant="outlined"
              sx={{
                flex: 1,
                p: 1.25,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, stat.progress))}
                    size={56}
                    thickness={4}
                    sx={{ color: stat.color, opacity: 0.95 }}
                  />
                  <Box
                    sx={{
                      inset: 0,
                      position: 'absolute',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 750, lineHeight: 1.1 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: boardColumns,
            gap: { xs: 1.25, sm: 1.75 },
            p: { xs: 1.25, sm: 2 },
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
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

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={initializeGame} fullWidth size="large">
            New game
          </Button>
          <Button variant="outlined" onClick={() => setModalOpen(true)} fullWidth size="large" startIcon={<LeaderboardIcon />}>
            Scores
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
