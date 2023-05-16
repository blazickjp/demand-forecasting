// pages/about.js
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { maxWidth, minHeight } from '@mui/system';

export default function AboutPage() {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" mt={8}>
      <Head>
        <title>About - CFAChat</title>
      </Head>
      <Navbar />
      <Box flexGrow={1}>
        <Box
          display="flex"
          height={520}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="520px"
          style={{
            background:
              "linear-gradient(180deg,rgba(155, 108, 252, 0.15) 0%,transparent 100%) 0 0 no-repeat,#191C23 url(https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__480.jpg) center center/cover repeat scroll padding-box",
            padding: "0px 0",
          }}
        >
          {/* <Typography
            variant="h1"
            align="center"
            sx={{
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            Who We Are
          </Typography>
          <Typography
            variant="h1"
            align="center"
            sx={{
              color: "#fff",
              marginBottom: "16px",
            }}
          >
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "10px",
            }}
          >
            Revolutionize your CFA preparation with our AI-powered study assistant, tailored to your needs.
          </Typography> */}
        </Box>
        <Box mt={8} width={"100%"} display="flex" justifyContent="center" alignItems="center" alignContent={"center"}>
          <Typography variant="h3" component="h2" gutterBottom>
            Our Mission
          </Typography>
        </Box>
        <Container maxWidth="lg">
          <Box mb={20} mt={8}>
            <Grid container spacing={8} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image="https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Image"
                    sx={{ flexGrow: 1 }}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Typography variant="body1">
                      Our mission at CFAChat is to empower CFA candidates by providing a personalized, AI-driven study assistant that helps them efficiently and effectively prepare for the CFA exams. By leveraging advanced AI and adaptive learning algorithms, we aim to revolutionize the way candidates approach their studies, enabling them to focus on the topics that matter most and make the most of their study time.
                    </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box sx={{ backgroundColor: "#DCE7EB", width: "100%", paddingY: "20px" }}>
          <Box mt={8} width={"100%"} display="flex" justifyContent="center" alignItems="center" alignContent={"center"}>
            <Typography variant="h3" component="h2" gutterBottom>
              Our Team
            </Typography>
          </Box>
          <Container>
            <Box my={8}>
              <Grid container spacing={8} justifyContent="center" alignItems="center" alignContent={"center"}>
                <Grid item xs={12} md={6}>
                  <Box minHeight="300px">
                    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        {/* <Typography variant="body1" paddingY={3}>
                          At CFAChat, our team is passionate about empowering CFA candidates to succeed:
                        </Typography> */}
                        {/* <Typography variant="body1">
                          <ul>
                            <li>Committed to delivering the most effective study tools for the CFA curriculum</li>
                            <li>Dedicated to continuous improvement of our platform based on user feedback</li>
                            <li>Collaborating with industry experts and partners to enhance our offerings</li>
                          </ul>
                        </Typography> */}
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box minHeight="300px">
                    <Card>
                      <CardMedia
                        component="img"
                        height="100%"
                        image="https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Image"
                      />
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box >
      <Footer />
    </Box >
  );
}
