// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import FileUploadForm from '../components/FileUploadForm';
import Login from '../components/Login';
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
      <Box my={4}>
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
            <div>
              {!loggedIn ? (
                <Box
                  sx={{
                    minHeight: '100vh',
                    backgroundImage: "url('/background.webp')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                <Login onLoginSuccess={handleLoginSuccess} />
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="center" marginBottom={10}>
                    <Navbar />
                  </Box>
                  <Typography variant="h3" component="h1" align="center" gutterBottom>
                    Empower Your Business with Demand Forecasting
                  </Typography>
                  <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Image src="/fcst.jpeg" alt="Demand forecasting" width={500} height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box mt={2}>
                        <Typography variant="body1">
                          Discover the power of data-driven decision-making with our state-of-the-art demand forecasting platform, 
                          specifically designed for small businesses in the retail industry. By leveraging advanced predictive algorithms 
                          and machine learning, we provide you with highly accurate demand forecasts, empowering you to optimize 
                          inventory management, reduce costs, and increase profits. 
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Image src="/img2.png" alt="Demand forecasting" width={500} height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display={"flex"} justifyContent="center">
                        <Typography variant="body1">
                          Our user-friendly platform makes it easy for you to get started. 
                          Simply upload your historical demand data as a .csv file and let our sophisticated forecasting engine generate tailored 
                          forecasts for your business. Don't miss out on the opportunity to transform your business operations, enhance 
                          customer satisfaction, and stay ahead of the competition. Experience the benefits of reliable and precise
                          demand forecasting today!
                        </Typography>
                      </Box>
                      <br></br>
                      <Box display="flex" justifyContent="center">
                        <Link href="/login" passHref>
                          <Button variant="contained" color="primary">
                            Get Started
                          </Button>
                        </Link>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="center" marginTop={10}>
                    <FileUploadForm/>
                  </Box>
                </>
              )}
            </div>
          </Box>
        </main>
        <Box paddingBottom={10}></Box> {/* Add padding to the bottom */}
        <Footer />
      </Box>
    </Container>      
  );
}
