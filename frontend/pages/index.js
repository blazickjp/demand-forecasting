import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box, Grid, Button, Tooltip, Chip } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OfferCard from '../components/OfferCard';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';


export default function Home() {

  const FAQItem = ({ question, answer }) => (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography>{question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container disableGutters>
      <Box marginTop={0}>
        <Head>
          <title>CFAChat</title>
          <link rel="icon" href="/favicon.ico" />
          <style>{`
            html {
              scroll-behavior: smooth;
            }
          `}</style>
        </Head>
        <main>
          <Box maxWidth="100%" mx="auto">
            <Box>
              <Navbar />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="620px"
              style={{
                background: "linear-gradient(180deg,rgba(155, 108, 252, 0.15) 0%,transparent 100%) 0 0 no-repeat,#191C23 url(https://uploads.quarkly.io/5f44d0da669357001e60ed14/images/default-website-illustration-works-angle.svg?v=2020-11-06T16:36:54.345Z) center center/cover repeat scroll padding-box",
                padding: "0px 0"
              }}
            >
              <Typography
                variant="h1"
                align="center"
                sx={{
                  color: "#fff",
                  marginBottom: "16px"
                }}
              >
                Your Personalized CFA
              </Typography>
              <Typography
                variant="h1"
                align="center"
                sx={{
                  color: "#fff",
                  marginBottom: "16px"
                }}
              >
                Study Assistant
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "10px"
                }}
              >
                Supercharge your study habits with our AI powered CFA Study Assistant.
              </Typography>
              <Link href="#mission">
                <Button
                  variant="contained"
                  sx={{
                    color: "white",
                    marginTop: "80px",
                    letterSpacing: "0.5px",
                    '&:hover': {
                      transform: "translateY(-4px)"
                    }
                  }}
                >
                  Learn More
                </Button>
              </Link>
            </Box>
            {/* Mission Statement Section */}
            <Box mt={10} mb={10} textAlign="center" py={6}>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '800px', margin: 'auto' }}>
                Our mission is to help CFA candidates excel in their studies by providing a personalized, AI-powered study assistant. We aim to revolutionize the learning experience, making it more engaging, efficient, and effective for everyone. By leveraging advanced artificial intelligence technology, we continuously adapt to each user's unique learning style and pace, ensuring a truly personalized study experience. Our platform is designed to be user-friendly, interactive, and supportive, empowering CFA candidates to achieve their full potential and succeed in their professional endeavors.
              </Typography>
            </Box>
            <Box sx={{ backgroundColor: '#DCE7EB', width: '100%' }}>

              <Container maxWidth="xl" sx={{ backgroundColor: "#DCE7EB" }}>
                <Box mt={10} mb={10} py={12}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                      What We Offer
                    </Typography>
                  </Box>
                  <Grid container spacing={0} justifyContent="center" mt={4}>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <OfferCard
                        sx={{ maxWidth: '300px' }} // You can set the desired max width for the cards
                        image="https://images.pexels.com/photos/433333/pexels-photo-433333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        title="Personalized Study Plan"
                        additionalContent={
                          <Tooltip title="Features are currently in development and being rolled out to a limited number of users for testing.">
                            <Chip
                              icon={<VisibilityIcon />}
                              label="Preview"
                              sx={{ color: 'primary.main', borderColor: 'primary.main', borderWidth: 1 }}
                              variant="outlined"
                            />
                          </Tooltip>
                        }
                        description="Our AI-powered study assistant creates a customized study plan tailored to your needs, helping you focus on the topics that matter most and making the most of your study time."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <OfferCard
                        sx={{ maxWidth: '300px' }} // You can set the desired max width for the cards
                        image="https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        title="Adaptive Learning"
                        additionalContent={
                          <Tooltip title="Features are currently in development and being rolled out to a limited number of users for testing.">
                            <Chip
                              icon={<VisibilityIcon />}
                              label="Preview"
                              sx={{ color: 'primary.main', borderColor: 'primary.main', borderWidth: 1 }}
                              variant="outlined"
                            />
                          </Tooltip>
                        }
                        description="Leveraging adaptive learning algorithms, our study assistant adjusts the difficulty and focus of the questions based on your performance, ensuring continuous improvement and mastery of the CFA curriculum."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <OfferCard
                        sx={{ maxWidth: '300px' }} // You can set the desired max width for the cards
                        image="https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        title="Real-time Feedback & Analytics"
                        description="Receive instant feedback on your answers and track your progress with in-depth analytics, enabling you to identify your strengths and weaknesses and fine-tune your study approach."
                        additionalContent={
                          <Tooltip title="Features are currently in development and being rolled out to a limited number of users for testing.">
                            <Chip
                              icon={<VisibilityIcon />}
                              label="Preview"
                              sx={{ color: 'primary.main', borderColor: 'primary.main', borderWidth: 1 }}
                              variant="outlined"
                            />
                          </Tooltip>
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Container>
            </Box>


            <Box mt={10} mb={10} py={6} px={10}>
              <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
                Frequently Asked Questions
              </Typography>
              <Grid container spacing={3} justifyContent="center" mt={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="What is CFAChat?"
                    answer="CFAChat is an AI-powered study assistant designed to help CFA candidates excel in their studies by providing personalized learning experiences, real-time feedback, and in-depth analytics."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="How does CFAChat personalize my study plan?"
                    answer="CFAChat's AI algorithms analyze your performance on practice questions and quizzes, identifying your strengths and weaknesses. Based on this analysis, CFAChat creates a customized study plan tailored to your needs, ensuring you focus on the topics that matter most."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="Is CFAChat suitable for all CFA levels?"
                    answer="Yes, CFAChat is designed to assist candidates studying for all three levels of the CFA exam. Our AI algorithms and content are tailored to the specific requirements and learning objectives of each level."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="Can I track my progress with CFAChat?"
                    answer="Absolutely! CFAChat provides real-time feedback on your answers and in-depth analytics to help you track your progress, identify your strengths and weaknesses, and fine-tune your study approach."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="How much does CFAChat cost?"
                    answer="CFAChat will offer various pricing plans to suit different needs and budgets. While in preview, our users will have 100% unlimited access for free."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FAQItem
                    question="Is my data secure with CFAChat?"
                    answer="We take data security very seriously. CFAChat employs industry-standard security practices to protect your data and ensure your privacy. To learn more, please refer to our Privacy Policy."
                  />
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

