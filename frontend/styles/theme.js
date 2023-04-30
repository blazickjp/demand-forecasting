// styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3458', // OpenAI-like primary color (dark blue)
    },
    secondary: {
      main: '#00c2ff', // OpenAI-like secondary color (cyan)
    },
    background: {
      default: 'white', // OpenAI-like background color (light gray)
    },
  },
  typography: {
    body1: {
      fontSize: '1.2rem',

    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

export default theme;
