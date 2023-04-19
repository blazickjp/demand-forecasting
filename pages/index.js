// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box marginTop={15}>
        <Head>
          <title>Demand Forecasting App</title>
          <link rel="icon" href="/favicon.ico" />
          <style>{`
            html {
              scroll-behavior: smooth;
            }
          `}</style>
        </Head>
        <main>
          <Box maxWidth="lg" mx="auto">
            <Box>
              <Navbar />
            </Box>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h2" component="h1">
                Empower Your Business with Demand Forecasting
              </Typography>
              <Box mt={2}>
                <Link href="/login" passHref>
                  <Button variant="contained" color="primary">
                    Get Started
                  </Button>
                </Link>
              </Box>
            </Box>
            <Grid container spacing={5} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <Image src="/fcst.jpeg" alt="Demand forecasting" width={500} height={400} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Data-Driven Decision Making
                </Typography>
                <Typography variant="body1">
                  Discover the power of data-driven decision-making with our state-of-the-art demand forecasting platform,
                  specifically designed for small businesses in the retail industry. By leveraging advanced predictive algorithms
                  and machine learning, we provide you with highly accurate demand forecasts, empowering you to optimize
                  inventory management, reduce costs, and increase profits.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  User-Friendly Platform
                </Typography>
                <Typography variant="body1">
                  Our user-friendly platform makes it easy for you to get started. Simply upload your historical demand data as a .csv file and let our sophisticated forecasting engine generate tailored forecasts for your business. Don't miss out on the opportunity to transform your business operations, enhance customer satisfaction, and stay ahead of the competition. Experience the benefits of reliable and precise demand forecasting today!
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Image src="/img2.png" alt="Demand forecasting" width={500} height={400} />
              </Grid>
            </Grid>
            <Box paddingBottom={10}></Box> {/* Add padding to the bottom */}
            <Box mt={5}>
              <Typography variant="h4" component="h2" gutterBottom textAlign="center">
                Trusted by Top Companies
              </Typography>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={6} sm={4} md={2}>
                  {/* Replace these images with client logos */}
                  <Image src="/dsg.png" alt="Client logo" width={100} height={50} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Image src="/macys.png" alt="Client logo" width={100} height={50} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Image src="/amazon.png" alt="Client logo" width={100} height={50} />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Image src="/google.png" alt="Client logo" width={100} height={50} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </main>
        <Box paddingBottom={10}></Box> {/* Add padding to the bottom */}
        <Footer />
      </Box>
    </Container>
  );
}

