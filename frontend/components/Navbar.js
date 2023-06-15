import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseClient';


const NavLink = styled(Button)`
  color: white;
  font-weight: 600;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Link href="/" passHref>
          <Typography
            variant="h6"
            sx={{ color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            DiY.AI
          </Typography>
        </Link>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {!user && (
            <>
              <Link href="/about" passHref>
                <NavLink>About</NavLink>
              </Link>
              <Link href="/features" passHref>
                <NavLink>Features</NavLink>
              </Link>
              <Link href="/pricing" passHref>
                <NavLink>Pricing</NavLink>
              </Link>
            </>
          )}
          {user ? (
            <NavLink onClick={handleLogout}>Logout</NavLink>
          ) : (
            <Link href="/login" passHref>
              <NavLink>Login</NavLink>
            </Link>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
