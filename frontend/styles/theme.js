// styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // typography: {
  //   fontFamily: '"Custom Font", sans-serif',
  //   h4: {
  //     fontWeight: 900,
  //     fontSize: '72px',
  //     lineHeight: 1.2,
  //   },
  // },
  palette: {
    primary: {
      main: '#1D3B6C', // OpenAI-like primary color (dark blue)
    },
    secondary: {
      main: '#1C9190', // OpenAI-like secondary color (cyan)
    },
    background: {
      default: '#EDF2F6', // OpenAI-like background color (light gray)
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
// #EDF2F6 - light gray
