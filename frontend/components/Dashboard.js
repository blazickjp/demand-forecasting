import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import withAuthNavBar from './withAuthNavBar';

const Dashboard = ({ mainContentMargin }) => {
    return (
        <Box
            marginLeft={`${mainContentMargin}px`}
            paddingLeft={5}
            transition="margin 225ms cubic-bezier(0, 0, 0.2, 1)"
        >
            <Container maxWidth="md">
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Welcome to DiY.AI: Revolutionizing Small Business with AI and Machine Learning
                    </Typography>
                </Box>

                <Box mt={4}>
                    <Typography variant="body1" component="p" gutterBottom>
                        At DiY.AI, our mission is to empower small businesses around the world with the power of artificial intelligence and machine learning. With our forecasting and optimization solutions, small businesses with less than 200 employees can now compete and thrive in the market like never before.
                    </Typography>
                </Box>

                {/* Image: DiY.AI logo or a visual representing small businesses */}
                {/* <Box mt={4}>
          <img src="your-image-source" alt="DiY.AI logo or a visual representing small businesses" />
        </Box> */}

                <Box mt={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Forecasting and Optimization for Small Businesses
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Our forecasting and optimization tools harness the power of AI and machine learning to help you make data-driven decisions for your business. From sales and inventory forecasting to optimizing your supply chain, DiY.AI can help your small business achieve its full potential.
                    </Typography>
                </Box>

                {/* Image: A visual representing forecasting and optimization */}
                {/* <Box mt={4}>
          <img src="your-image-source" alt="A visual representing forecasting and optimization" />
        </Box> */}

                <Box mt={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Expanding to All Facets of AI and Machine Learning
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        At DiY.AI, we're continually working to expand our offerings and provide more tools and services to help small businesses succeed. Our vision is to become a one-stop-shop for AI and machine learning solutions, tailored specifically to the unique needs of small businesses.
                    </Typography>
                </Box>

                {/* Image: A visual representing the expansion of AI and machine learning */}
                {/* <Box mt={4}>
          <img src="your-image-source" alt="A visual representing the expansion of AI and machine learning" />
        </Box> */}

                <Box mt={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Supporting Brick and Mortar Businesses
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Our tools are designed with brick and mortar businesses in mind. By helping you optimize your operations and make data-driven decisions, we aim to level the playing field and ensure that your business can compete and succeed in today's ever-changing landscape.
                    </Typography>
                </Box>

                {/* Image: A visual representing brick and mortar businesses */}
                {/* <Box mt={4}>
          <img src="your-image-source" alt="A visual representing brick and mortar businesses" />
        </Box> */}
            </Container>
        </Box>
    );
};

export default withAuthNavBar(Dashboard);
