import Head from 'next/head';
import FileUploadForm from '../components/FileUploadForm';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxWidth={false} disableGutters>
        <Box mt={4}>
          <Head>
            <title>Login - CFA Chat</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
            <Box maxWidth="lg" mx="auto" mt={55} mb={25} flexGrow={1}>
              <Login />
            </Box>
          </main>
        </Box>
      </Container >
      <Footer />
    </Box >
  );
}
