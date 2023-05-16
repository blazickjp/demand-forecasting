import Head from 'next/head';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container disableGutters>
        <Box mt={4}>
          <Head>
            <title>Login - CFA Chat</title>
          </Head>
          <Box maxWidth="lg" mx="auto" mt={55} mb={25} flexGrow={1}>
            <Login />
          </Box>
        </Box>
      </Container >
      <Footer />
    </Box >
  );
}
