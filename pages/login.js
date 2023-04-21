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
          <title>Login - DiY.AI</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Box maxWidth="lg" mx="auto" mt={55} mb={20}>
            <Login />
          </Box>
        </main>
        <Footer />
      </Box >
    </Container >
  );
}
