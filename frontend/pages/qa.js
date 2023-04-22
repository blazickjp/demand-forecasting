// pages/qa.js
import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import withAuthNavBar from '../components/withAuthNavBar';

const QAPage = ({ mainContentMargin }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSubmit = async () => {
        // Call your LLM backend API to get the answer
        const response = await fetch('/api/llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (response.ok) {
            const result = await response.json();
            setAnswer(result.answer);
        }
    };

    return (
        <Box marginLeft={`${mainContentMargin}px`} paddingLeft={5} transition="margin 225ms cubic-bezier(0, 0, 0.2, 1)">
            <Container maxWidth="md">
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Q&A
                    </Typography>
                </Box>
                <Box mt={4}>
                    <TextField
                        label="Ask your question"
                        value={question}
                        onChange={handleQuestionChange}
                        fullWidth
                        variant="outlined"
                    />
                </Box>
                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
                {answer && (
                    <Box mt={4}>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Answer:
                        </Typography>
                        <Typography variant="body1" component="p">
                            {answer}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default withAuthNavBar(QAPage);
