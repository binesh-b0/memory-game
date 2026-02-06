import { useEffect, useMemo, useRef, useState } from 'react';
import useGameLogic from './hooks/useGameLogic';
import { useHighScores } from './hooks/useHighScores';
import Card from './components/Card';
import BackgroundParticles from './components/BackgroundParticles';
import WinConfetti from './components/WinConfetti';
import { AnimatePresence, motion } from 'framer-motion';
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
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 4, moveLimit: 20, timeLimit: 60 },
  medium: { pairs: 6, moveLimit: 30, timeLimit: 90 },
  hard: { pairs: 8, moveLimit: 40, timeLimit: 120 }
} as const;

type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { pairs, moveLimit, timeLimit } = DIFFICULTY_SETTINGS[difficulty];
  const { cards, matches, moves, gameOver, initializeGame, handleCardClick, resetTrigger, isRevealing, shakeIds, pulseIds } = useGameLogic(pairs);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const { highScores, addHighScore } = useHighScores();
  const [modalOpen, setModalOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [nextDifficulty, setNextDifficulty] = useState<Difficulty>(difficulty);
  const savedScoreRef = useRef(false);
  const initializeGameRef = useRef(initializeGame);
  const prevDifficultyRef = useRef<Difficulty>(difficulty);

  const gameLocked = (moves > 0 || isRevealing) && !showGameOver;

  useEffect(() => {
    initializeGameRef.current = initializeGame;
  }, [initializeGame]);

  useEffect(() => {
    initializeGameRef.current();
  }, []);

  useEffect(() => {
    if (prevDifficultyRef.current === difficulty) return;
    prevDifficultyRef.current = difficulty;
    initializeGame();
  }, [difficulty, initializeGame]);

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
  const cardCount = pairs * 2;
  const boardColsXs = 4;
  const boardColsSm = difficulty === 'medium' ? 6 : 4;
  const boardRowsXs = Math.ceil(cardCount / boardColsXs);
  const boardRowsSm = Math.ceil(cardCount / boardColsSm);
  const hasWon = matches.length === pairs;
  const outOfTime = timeLeft === 0;
  const outOfMoves = moves >= moveLimit;
  const showBestLabel = bestScore ? `Best: ${bestScore.moves} moves` : 'No scores yet';

  return (
    <Container 
      maxWidth="md"
      sx={{
        py: { xs: 2, sm: 3 },
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <BackgroundParticles />
      <WinConfetti active={showGameOver && hasWon} />
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          width: '100%',
          position: 'relative',
          borderRadius: 3,
          boxShadow: '0 22px 70px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(14px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          minHeight: 0,
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

        <Dialog open={newGameOpen} onClose={() => setNewGameOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>New game</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <ToggleButtonGroup
                value={nextDifficulty}
                exclusive
                onChange={(_, value: Difficulty | null) => value && setNextDifficulty(value)}
                size="small"
                fullWidth
              >
                <ToggleButton value="easy">Easy</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="hard">Hard</ToggleButton>
              </ToggleButtonGroup>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`${DIFFICULTY_SETTINGS[nextDifficulty].pairs * 2} cards`} variant="outlined" />
                <Chip label={`${DIFFICULTY_SETTINGS[nextDifficulty].moveLimit} moves`} variant="outlined" />
                <Chip label={`${DIFFICULTY_SETTINGS[nextDifficulty].timeLimit}s`} variant="outlined" />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewGameOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setNewGameOpen(false);
                if (nextDifficulty !== difficulty) {
                  setDifficulty(nextDifficulty);
                  return;
                }
                initializeGame();
              }}
              variant="contained"
            >
              Start
            </Button>
          </DialogActions>
        </Dialog>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4">Memory match</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Flip two cards. Match all pairs before time or moves run out.
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
            <Tooltip title={gameLocked ? 'Start a new game' : 'New game'}>
              <span>
                <IconButton
                  onClick={() => {
                    setNextDifficulty(difficulty);
                    setNewGameOpen(true);
                  }}
                  aria-label="New game"
                >
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
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
            {isRevealing ? <Chip label="Memorize" color="secondary" /> : null}
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

        <Box sx={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', py: 1 }}>
          <AnimatePresence mode="wait">
            <Box
              key={`${difficulty}-${resetTrigger ? 1 : 0}`}
              component={motion.div}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              sx={{
                height: '100%',
                maxWidth: '100%',
                aspectRatio: { xs: `${boardColsXs}/${boardRowsXs}`, sm: `${boardColsSm}/${boardRowsSm}` },
                display: 'grid',
                gridTemplateColumns: { xs: `repeat(${boardColsXs}, 1fr)`, sm: `repeat(${boardColsSm}, 1fr)` },
                gridAutoRows: '1fr',
                gap: { xs: 0.9, sm: 1.2 },
                p: { xs: 1, sm: 1.25 },
                borderRadius: 2.5,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {cards.map(card => (
                <Box key={card.id} sx={{ minWidth: 0, minHeight: 0 }}>
                  <Card
                    value={card.value}
                    isFlipped={card.isFlipped}
                    isMatched={card.isMatched}
                    shake={shakeIds.includes(card.id)}
                    pulse={pulseIds.includes(card.id)}
                    onClick={() => handleCardClick(card.id)}
                  />
                </Box>
              ))}
            </Box>
          </AnimatePresence>
        </Box>

      </Paper>
    </Container>
  );
}
