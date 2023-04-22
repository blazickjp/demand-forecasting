import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSync, faLock, faLaptopCode, faWarehouse, faChartLine } from '@fortawesome/free-solid-svg-icons';

const featureBoxStyles = {
  background: "rgba(230, 230, 230, 0.8)",
  borderRadius: "4px",
  padding: "24px",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transform: "scale(1.02)",
  },
};


export default function FeaturesPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Box my={4}>
        <Head>
          <title>Features - DiY.AI</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Box maxWidth="lg" mx="auto" px={2}>
            <Box display="flex" justifyContent="center" marginBottom={10}>
              <Navbar />
            </Box>
            <Typography variant="h2" component="h1" align="center" gutterBottom mb={4}>
              Powerful Demand Forecasting Made Simple
            </Typography>
            <Typography variant="h5" component="h2" align="center" gutterBottom mb={6}>
              Experience state-of-the-art forecasting without the need for coding or complex mathematics
            </Typography>

            <Box my={4}>
              <Typography variant="h4" component="h3" align="center" gutterBottom mb={4}>
                Key Features
              </Typography>
              <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faCog} /> Sophisticated Forecasting Algorithms
                    </Typography>
                    <Typography variant="body1" align="center">
                      Our platform leverages state-of-the-art deep learning and statistical algorithms to deliver highly accurate demand forecasts. With a wide range of forecasting models at our disposal, we tailor our approach to your unique business needs, ensuring the best possible predictions.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faLaptopCode} /> No Coding or Mathematical Knowledge Required
                    </Typography>
                    <Typography variant="body1" align="center">
                      Our user-friendly platform requires no coding or advanced mathematical knowledge. Simply upload your historical demand data, and our sophisticated forecasting engine will generate tailored forecasts for your business. Focus on making data-driven decisions while our platform handles the complex calculations.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faWarehouse} /> Optimized Inventory Management
                    </Typography>
                    <Typography variant="body1" align="center">
                      By providing highly accurate demand forecasts, our platform empowers you to optimize your inventory management. Ensure that you have the right products in the right quantities at the right time, reducing excess stock, minimizing stockouts, and improving customer satisfaction.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faChartLine} /> Data-Driven Decision Making
                    </Typography>
                    <Typography variant="body1" align="center">
                      Make informed decisions based on reliable and precise demand forecasts. Our platform helps you identify trends, seasonality, and other factors influencing demand, allowing you to plan effectively, allocate resources efficiently, and stay ahead of the competition.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faSync} /> Seamless Integration with Existing Systems
                    </Typography>
                    <Typography variant="body1" align="center">
                      Our demand forecasting platform is designed to integrate seamlessly with your existing systems, such as ERP, WMS, and e-commerce platforms. This ensures a smooth and efficient workflow, allowing you to take full advantage of our powerful forecasting capabilities without disrupting your day-to-day operations.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={featureBoxStyles}>
                    <Typography variant="h6" component="h4" align="center" gutterBottom>
                      <FontAwesomeIcon icon={faLock} /> Secure Data Handling and Privacy
                    </Typography>
                    <Typography variant="body1" align="center">
                      We take data security and privacy seriously. Our platform employs advanced encryption methods and secure cloud storage to protect your sensitive information. You can rest assured that your data is safe and accessible only by authorized users within your organization.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </main>
        <Footer />
      </Box>
    </Container>
  );
}
