import Head from 'next/head';
import FileUploadForm from '../components/FileUploadForm';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Box my={4}>
        <Head>
          <title>Login - Demand Forecasting App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Box maxWidth="lg" mx="auto">
            <Box display="flex" justifyContent="center" marginBottom={10}>
              <Navbar />
            </Box>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Login />
            </Box>
          </Box>
        </main>
        <Footer />
      </Box>
    </Container>
  );
}
