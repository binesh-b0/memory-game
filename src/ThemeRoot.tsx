import { StrictMode, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { createAppTheme, themeOptions } from './theme';
import type { ThemeId } from './theme';

const STORAGE_KEY = 'memoryGameThemeId';

const isThemeId = (value: string): value is ThemeId => themeOptions.some(t => t.id === value);

const getInitialThemeId = (): ThemeId => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw && isThemeId(raw)) return raw;
  return 'midnight';
};

export default function ThemeRoot() {
  const [themeId, setThemeId] = useState<ThemeId>(getInitialThemeId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const theme = useMemo(() => createAppTheme(themeId), [themeId]);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App themeId={themeId} setThemeId={setThemeId} themeOptions={themeOptions} />
      </ThemeProvider>
    </StrictMode>
  );
}

