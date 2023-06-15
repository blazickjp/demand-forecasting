import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseClient';
import useAuth from '../hooks/useAuth';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Avatar,
} from '@mui/material';
import { GoogleAuthProvider } from 'firebase/auth';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="xs">
        <Box mx={1} marginTop={-30}>
          <Paper elevation={2} sx={{ padding: 2 }}>
            <Box textAlign="center" pb={2}>
              <Avatar sx={{ margin: 'auto', backgroundColor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5" component="h1" gutterBottom>
                Sign In
              </Typography>
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={handleEmailLogin}
            >
              Sign in
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={() => handleLogin(new GoogleAuthProvider())}
                >
                  Sign in with Google
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Don't have an account?{' '}
                  <Link href="/signup" passHref>
                    <Typography component="a" variant="body2" color="primary">
                      Sign Up
                    </Typography>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
