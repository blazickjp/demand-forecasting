// pages/about.js
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid } from "@mui/material";
import Image from 'next/image';


export default function AboutPage() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" my={8}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap" rel="stylesheet" />
        <title>About - Demand Forecasting App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box flexGrow={1} pb={8}>
        <Container maxWidth="lg">
          <Box my={4}>
            <Typography variant="h2" component="h1" align="center" gutterBottom >
              About Us
            </Typography>
            <Box my={4}>
              <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Image src="https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" width={550} height={400} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Our Mission
                  </Typography>
                  <Typography variant="body1">
                    Our mission at Demand Forecasting App is to empower businesses of all sizes, especially small businesses, to make data-driven decisions through precise and reliable demand forecasting. By democratizing advanced AI and predictive algorithms, we level the playing field and make cutting-edge technology accessible to a wider range of businesses. We provide actionable insights for optimizing inventory management, reducing costs, and increasing profits, all through a user-friendly platform. Our dedicated team is passionate about helping clients achieve their goals and stay ahead of the competition in a rapidly evolving market landscape.                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Our Team
                  </Typography>
                  <Typography variant="body1">
                    At Demand Forecasting App, our team's <strong>passion</strong> and <strong>expertise</strong> fuel our drive to excel:

                    <ul>
                      <li><em>Data scientists</em> boasting over <strong>20 years</strong> of combined experience</li>
                      <li>Adept at crafting <strong>demand forecasting solutions</strong> for leading retailers</li>
                      <li>Dedicated to <strong>empowering small businesses</strong> with advanced AI technology</li>
                      <li>Delivering <strong>actionable insights</strong> for inventory optimization and profit enhancement</li>
                      <li>Committed to providing a <strong>user-friendly</strong> and <strong>accessible</strong> platform</li>
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Image src="https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" width={550} height={400} />

                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Image src="https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" width={550} height={400} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: { md: 4 } }}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Our Values
                  </Typography>
                  <Typography variant="body1">
                    At Demand Forecasting App, our core values guide every decision we make and shape our commitment to delivering exceptional solutions for our clients:
                    <ul>
                      <li><strong>Customer-centric</strong>: We prioritize our customers' needs, ensuring their success drives our own.</li>
                      <li><strong>Innovation</strong>: We embrace cutting-edge technology and continuously strive to improve our offerings.</li>
                      <li><strong>Collaboration</strong>: We believe in the power of teamwork and fostering an environment where diverse perspectives thrive.</li>
                      <li><strong>Integrity</strong>: We maintain the highest standards of honesty and professionalism in all our dealings.</li>
                      <li><strong>Accessibility</strong>: We're dedicated to making advanced AI-driven forecasting tools available to businesses of all sizes.</li>
                      <li><strong>Sustainability</strong>: We understand the importance of minimizing waste and promoting efficient resource allocation to create a positive impact on the environment and the bottom line.</li>
                    </ul>
                  </Typography>
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
