import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseClient';


const NavLink = styled(Button)`
  font-weight: 600;
`;

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#EDF2F6' }}>
      <Toolbar>
        <Link href="/" passHref>
          <NavLink color="primary">CFAChat</NavLink>
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
                <NavLink color="primary">About</NavLink>
              </Link>
            </>
          )}
          {user ? (
            <NavLink onClick={handleLogout}>Logout</NavLink>
          ) : (
            <Link href="/login" passHref>
              <NavLink color="primary">Login</NavLink>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
