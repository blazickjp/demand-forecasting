import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Input, CircularProgress } from '@mui/material';
import withAuthNavBar from '../components/withAuthNavBar';

const QAPage = ({ mainContentMargin }) => {
    const [question, setQuestion] = useState('');
    const [file, setFile] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://us-central1-fresh-oath-383101.cloudfunctions.net/llm_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json();
            setAnswer(result.answer.answer);

        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
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
                    <Typography variant="h5" component="h2" gutterBottom>
                        Bayesian Data Analysis Study Aid
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Welcome to the Bayesian Data Analysis Study Aid! This application is designed to help you better understand the concepts presented in the "Bayesian Data Analysis 3rd Edition" textbook. By using the powerful GPT-3.5 AI model, you can ask questions related to the material covered in the book and receive accurate and detailed answers.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Simply type your question in the provided input field, and the AI will search the preloaded database to give you an answer based on the text. You can also upload a PDF file if you'd like to reference additional content (NOT YET IMPLIMENTED). This study aid aims to enhance your learning experience and deepen your understanding of Bayesian Data Analysis concepts.
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
                {/* <Box mt={4}>
                    <Typography variant="subtitle1" component="p">
                        Upload a PDF:
                    </Typography>
                    <Input type="file" accept=".pdf" onChange={handleFileChange} />
                </Box> */}
                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
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
