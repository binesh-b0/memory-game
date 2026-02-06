import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8b5cf6' },
    secondary: { main: '#22d3ee' },
    background: {
      default: '#070A14',
      paper: alpha('#0B1020', 0.78),
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 750, letterSpacing: -0.6 },
    h6: { fontWeight: 650, letterSpacing: -0.2 },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': { height: '100%', overflow: 'hidden' },
        body: {
          margin: 0,
          backgroundColor: '#070A14',
          backgroundImage: [
            'radial-gradient(900px circle at 20% 10%, rgba(139,92,246,0.28), transparent 60%)',
            'radial-gradient(700px circle at 90% 35%, rgba(34,211,238,0.18), transparent 55%)',
            'radial-gradient(900px circle at 35% 110%, rgba(16,185,129,0.12), transparent 55%)',
          ].join(','),
          backgroundAttachment: 'fixed',
          overscrollBehavior: 'none',
        },
        '*': { boxSizing: 'border-box' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.white, 0.03),
          borderColor: alpha(theme.palette.common.white, 0.14),
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: 2,
          borderRadius: 12,
          backgroundColor: alpha(theme.palette.common.white, 0.035),
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }),
        grouped: {
          margin: 2,
          border: 0,
          borderRadius: 10,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: 0,
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.06),
          },
          '&.Mui-selected': {
            color: theme.palette.common.white,
            backgroundColor: alpha(theme.palette.primary.main, 0.24),
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha('#ffffff', 0.08)}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 14,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }),
      },
    },
  },
});
