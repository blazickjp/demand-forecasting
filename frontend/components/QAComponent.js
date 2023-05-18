import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const QAComponent = ({ user }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [dataset, setDataset] = useState('bayesian_data_analysis');

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleDatasetChange = (e) => {
        setDataset(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage(null); // Reset error message before making a new request
        try {
            const response = await fetch(
                "https://llm-backend-6gnrxcf25a-ue.a.run.app/llm_answer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question, user_id: user.uid, dataset }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }

            const result = await response.json();
            setAnswer(result.answer.answer);
        } catch (error) {
            setErrorMessage(error.message);
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <select id="dataset-select" onChange={handleDatasetChange}>
                <option value="bayesian_data_analysis">Bayesian Data Analysis</option>
            </select>
            {errorMessage && (
                <Box mt={4}>
                    <Typography variant="body1" component="p">
                        {errorMessage}
                    </Typography>
                </Box>
            )}

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
        </>
    );
};

export default QAComponent;
