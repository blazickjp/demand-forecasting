// components/Login.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup } from 'firebase/auth';
import { auth, } from '../firebaseClient';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material"
import { GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router])

  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, new provider());
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  return (
    <Container maxWidth="xs">
      <Box my={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              fullWidth
              color="primary"
              onClick={() => handleLogin(GoogleAuthProvider)}
            >
              Sign in with Google
            </Button>
          </Grid>
        </Grid>
      </Box >
    </Container >
  );
}
