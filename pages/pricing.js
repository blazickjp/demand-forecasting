import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material";
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)({
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

const Title = styled(Typography)({
    marginBottom: '1rem',
});

const StyledButton = styled(Button)({
    marginTop: '1rem',
});

export default function PricingPage() {
    return (
        <Box minHeight="85vh" display="flex" flexDirection="column" my={8}>
            <Head>
                <title>Pricing - Demand Forecasting App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Box flexGrow={1}>
                <Container maxWidth="md">
                    <Box my={4}>
                        <Typography variant="h2" component="h1" align="center" gutterBottom>
                            Pricing
                        </Typography>
                        <Typography variant="h5" component="p" align="center" gutterBottom>
                            We believe in empowering all businesses with cutting-edge technology. That's why our app is absolutely free!
                        </Typography>
                        <Box my={16}>
                            <Grid container spacing={4} justifyContent="center">
                                <Grid item xs={12} sm={6} md={4}>
                                    <StyledPaper>
                                        <Title variant="h4" component="h2">
                                            Free Access
                                        </Title>
                                        <Typography variant="body1">
                                            Unlimited forecasting
                                        </Typography>
                                        <Typography variant="body1">
                                            Access to all features
                                        </Typography>
                                        <Typography variant="body1">
                                            Regular updates
                                        </Typography>
                                        <Typography variant="body1">
                                            24/7 support
                                        </Typography>
                                        <StyledButton
                                            variant="contained"
                                            color="primary"
                                            href="/signup"
                                        >
                                            Sign Up Now
                                        </StyledButton>
                                    </StyledPaper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}
