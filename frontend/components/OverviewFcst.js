import React from 'react';
import {
    Box,
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import withAuthNavBar from './withAuthNavBar';

const Overview = ({ mainContentMargin }) => {
    return (
        <Box
            marginLeft={`${mainContentMargin}px`}
            paddingLeft={5}
            transition="margin 225ms cubic-bezier(0, 0, 0.2, 1)"
        >
            <Container maxWidth="md">
                <Box mt={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Forecasting Overview
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        This page provides an overview of forecasting for small businesses and guides you through the process of generating forecasts on our platform. Our platform is designed to be user-friendly and requires no special technical assistance.
                    </Typography>
                </Box>

                {/* 1. Introduction */}
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        1. Introduction
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Forecasting is the process of predicting future trends or events based on historical data. Small businesses can benefit from forecasting to make informed decisions about sales, inventory, staffing, and other critical aspects of their operations. With our platform, generating accurate and actionable forecasts is easy, even for those without a technical background.
                    </Typography>
                </Box>

                {/* 2. Getting Started */}
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        2. Getting Started
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        To get started with generating forecasts, follow these simple steps:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText>
                                1. Prepare your data: Gather historical data relevant to the forecast, such as sales, inventory, or other key metrics.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                2. Upload your data: Format your data as a CSV file and upload it to our platform using the file upload form.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                3. Generate the forecast: Our platform will analyze your data and generate a forecast tailored to your business.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                4. Review the results: Examine the forecast results, make any necessary adjustments, and use the insights to make data-driven decisions.
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>

                {/* 3. Data Preparation */}
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        3. Data Preparation
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Preparing your data is a crucial step in the forecasting process. Ensure your data is clean, accurate, and well-structured before uploading it to our platform. Here are some best practices for data preparation:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText>
                                - Use a consistent date format (e.g., YYYY-MM-DD) throughout the CSV file.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Remove any duplicate or irrelevant entries.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Ensure that there are no missing values or gaps in the data.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Use descriptive column names for easy identification and understanding.
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>

                {/* 4. Uploading Data */}
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        4. Uploading Data
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Uploading your data to our platform is a straightforward process. Follow these steps to ensure a successful upload:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText>
                                - Save your data as a CSV file with a ".csv" extension.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Use the file upload form to select and upload your CSV file.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Indicate whether your CSV file has headers (i.e., column names) by checking the appropriate box.
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>

                {/* 5. Generating and Reviewing the Forecast */}
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        5. Generating and Reviewing the Forecast
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Once your data is uploaded, our platform will analyze it and generate a forecast tailored to your business. Keep in mind the following tips when reviewing the forecast results:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText>
                                - Examine the forecast data and compare it with your historical data to gauge the accuracy and relevance of the predictions.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Consider external factors that may impact your business, such as seasonal trends, economic changes, or industry-specific events, and adjust the forecast accordingly.
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemText>
                                - Use the forecast as a starting point for making data-driven decisions, but also rely on your expertise and knowledge of your business.
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>
            </Container>
        </Box>
    );
};

export default withAuthNavBar(Overview);

