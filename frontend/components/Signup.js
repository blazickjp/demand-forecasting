// pages/signup.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebaseClient';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box, Grid, Paper, Button, TextField, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const db = getFirestore();

export default function Signup() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const validateEmail = (email) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            console.error('Error during sign up: Passwords do not match');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Store extended user profile information in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                // Add any other fields you need
            });

        } catch (error) {
            console.error('Error during sign up:', error);
        }
    };


    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle sign-up logic here
    };

    const isFormValid = () => {
        return (
            isEmailValid &&
            isPasswordValid &&
            password.length > 6 &&
            confirmPassword.length > 6 &&
            email.length > 0 &&
            firstName.length > 0 &&
            lastName.length > 0
        );
    };

    return (
        <Box>
            <Navbar />
            <Container maxWidth="xs">
                <Box mt={20} mx={1} mb={12}>
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        error={firstName.length === 0}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        error={firstName.length === 0}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setIsEmailValid(validateEmail(e.target.value));
                                            isFormValid();
                                        }}
                                        error={!isEmailValid}
                                        helperText={!isEmailValid ? 'Invalid email format' : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            isFormValid();
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setIsPasswordValid(e.target.value === password);
                                            isFormValid();

                                        }}
                                    />
                                    {password.length > 0 && confirmPassword.length > 0 && (
                                        <Box display="flex" justifyContent="flex-end" alignItems="center" paddingRight={1}>
                                            {isPasswordValid ? (
                                                <CheckCircleOutlineIcon color="success" />
                                            ) : (
                                                <Typography color="error" variant="caption">
                                                    Passwords don't match
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mb: 2, color: "primary.main" }}
                                        onClick={handleEmailSignup}
                                        disabled={!isFormValid()}
                                    >
                                        Sign up
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Container >
            <Footer />
        </Box >
    );
}
