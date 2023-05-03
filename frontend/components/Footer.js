import React from 'react';
import { Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '2px solid rgba(0, 0, 0, 0.12)',
        zIndex: 1000, // Add zIndex to bring the footer to the front
        position: 'relative',
        width: '100%',
        bottom: 0,
        boxShadow: '0px 100px 0px rgba(211, 211, 211)',
      }}
    >
      <Container maxWidth="lg">
        <Box py={2} textAlign="center">
          <p>
            &copy; {(new Date()).getFullYear()} CFAChat.com All rights reserved.
          </p>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
