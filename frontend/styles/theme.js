// styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3458',
    },
    secondary: {
      main: '#1C9190',
    },
    background: {
      default: '#EDF2F6',
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
