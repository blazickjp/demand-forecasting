import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const NavLink = styled(Button)`
  color: white;
  font-weight: 600;
  margin: 0 0.5rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link href="/" passHref>
          <Typography variant="h6" sx={{ color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            Demand Forecasting App
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link href="/about" passHref>
            <NavLink>About</NavLink>
          </Link>
          <Link href="/features" passHref>
            <NavLink>Features</NavLink>
          </Link>
          <Link href="#pricing" passHref>
            <NavLink>Pricing</NavLink>
          </Link>
          <Link href="/login" passHref>
            <NavLink>Login</NavLink>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
