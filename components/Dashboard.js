// pages/dashboard.js
import Head from 'next/head';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import useAuth from '../hooks/useAuth';
import { Container, Typography, Box } from '@mui/material';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <Box minHeight="100vh" display="flex" flexDirection="column">
            <Head>
                <title>Dashboard - Demand Forecasting App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AuthenticatedNavbar />
            <Box flexGrow={1}>
                <Container maxWidth="lg">
                    <Box my={4}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            Dashboard
                        </Typography>
                        <Typography variant="body1">
                            Welcome, {user ? user.displayName || user.email : 'Loading...'}!
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
