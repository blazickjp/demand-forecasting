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
    // Uncomment the font you want to use
    // fontFamily: 'Poppins, sans-serif',
    // fontFamily: 'Open Sans, sans-serif',
    // fontFamily: 'Lato, sans-serif',
    // fontFamily: 'Montserrat, sans-serif',
    fontFamily: 'Source Sans Pro, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1.2rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

export default theme;