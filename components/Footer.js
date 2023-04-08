import React from 'react';
import { Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(211, 211, 211)',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        zIndex: 1000 // Add zIndex to bring the footer to the front
      }}
    >
      <Container maxWidth="lg">
        <Box py={2} textAlign="center">
          <p>
            &copy; {(new Date()).getFullYear()} Demand Forecasting App. All rights reserved.
          </p>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
