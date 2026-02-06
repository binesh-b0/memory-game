import { alpha, createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export type ThemeId = 'midnight' | 'cyberpunk';

export const themeOptions: Array<{ id: ThemeId; label: string }> = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
];

const baseComponents = () => ({
  MuiButton: {
    defaultProps: { disableElevation: true },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: alpha(theme.palette.common.white, 0.045),
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: 2,
        borderRadius: 12,
        backgroundColor: alpha(theme.palette.common.white, 0.035),
        border: 0,
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
      root: ({ theme }: { theme: Theme }) => ({
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
      root: ({ ownerState }: { ownerState: { variant?: string } }) => ({
        backgroundImage: 'none',
        border: ownerState.variant === 'outlined' ? `1px solid ${alpha('#ffffff', 0.06)}` : 'none',
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: 14,
        border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
      }),
    },
  },
});

export const createAppTheme = (id: ThemeId) => {
  if (id === 'cyberpunk') {
    return createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#ff2bd6' },
        secondary: { main: '#00e5ff' },
        background: {
          default: '#070311',
          paper: alpha('#0b0620', 0.72),
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
        h4: { fontWeight: 780, letterSpacing: -0.8 },
        h6: { fontWeight: 650, letterSpacing: -0.2 },
        button: { textTransform: 'none', fontWeight: 650 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            'html, body, #root': { height: '100%', overflow: 'hidden' },
            body: {
              margin: 0,
              backgroundColor: '#070311',
              backgroundImage: [
                'radial-gradient(900px circle at 15% 5%, rgba(255,43,214,0.22), transparent 60%)',
                'radial-gradient(700px circle at 90% 35%, rgba(0,229,255,0.18), transparent 55%)',
                'radial-gradient(900px circle at 25% 115%, rgba(16,185,129,0.10), transparent 55%)',
              ].join(','),
              backgroundAttachment: 'fixed',
              overscrollBehavior: 'none',
            },
            '*': { boxSizing: 'border-box' },
          },
        },
        ...baseComponents(),
      },
    });
  }

  return createTheme({
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
      ...baseComponents(),
    },
  });
};
