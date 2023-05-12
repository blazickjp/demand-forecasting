import React from 'react';
import { Container, Typography } from '@mui/material';
import withAuthNavBar from '../../components/withAuthNavBar';
import PracticeQuestion from '../../components/PracticeQuestion';  // Import the Questions component

function PracticeProblems() {
    return (
        <div>
            <Container maxWidth="lg">
                <Typography variant="h2" component="h1" gutterBottom>
                    CFA Practice Questions
                </Typography>
                {/* Here you can add the components that will display the questions and answers */}
                <PracticeQuestion />   {/* Render the Questions component */}
            </Container>
        </div>
    );
}

export default withAuthNavBar(PracticeProblems);
