// pages/signup.js
import React from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebaseClient';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box, Grid, Paper, Button, TextField, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle sign-up logic here
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="xs">
                <Box my={25} mx={1} marginBottom={35}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Box textAlign="center" pb={2}>
                            <Avatar sx={{ margin: 'auto', backgroundColor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography variant="h5" component="h1" gutterBottom>
                                Sign Up
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="email"
                                        label="Email Address"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="password"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                    >
                                        Sign Up
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Container>
            <Footer />
        </div>
    );
}
