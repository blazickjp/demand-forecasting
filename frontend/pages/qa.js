import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextareaAutosize,
} from '@mui/material';
import withAuthNavBar from '../components/withAuthNavBar';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

const QAPage = ({ mainContentMargin }) => {
    const [question, setQuestion] = useState('');
    const [file, setFile] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [dataset, setDataset] = useState('bayesian_data_analysis');
    const [errorMessage, setErrorMessage] = useState(null);

    // Redirect to the login page if the user is not authenticated
    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleDatasetChange = (e) => {
        setDataset(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage(null); // Reset error message before making a new request
        console.log(JSON.stringify({ question, user_id: user.uid, dataset }))
        try {
            const response = await fetch(
                // 'https://llm-backend-6gnrxcf25a-ue.a.run.app/llm_answer',
                'http://localhost:8888/llm_answer',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question, user_id: user.uid, dataset }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            setAnswer(result.answer);
        } catch (error) {
            setErrorMessage(error.message);
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
                        Study Aid
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Welcome to the Study Aid! This application is designed to help you better understand the concepts
                        presented in various study materials. By using the powerful GPT-3.5 AI model, you can ask questions related
                        to the material covered in the selected dataset and receive accurate and detailed answers.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Simply choose a dataset from the dropdown menu, type your question in the provided input field, and the AI
                        will search the preloaded database to give you an answer based on the text. You can also upload a PDF file if you'd
                        like to reference additional content (NOT YET IMPLEMENTED). This study aid aims to enhance your learning experience
                        and deepen your understanding of the concepts in the selected dataset.
                    </Typography>
                </Box>
                <Box mt={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="dataset-select">Select a dataset</InputLabel>
                        <Select
                            label="Select a dataset"
                            id="dataset-select"
                            value={dataset}
                            onChange={handleDatasetChange}
                        >
                            <MenuItem value="bayesian_data_analysis">Bayesian Data Analysis</MenuItem>
                            {/* Add more MenuItem components for additional datasets */}
                        </Select>
                    </FormControl>
                </Box>
                {errorMessage && (
                    <Box mt={4}>
                        <Typography variant="body1" component="p" color="error">
                            {errorMessage}
                        </Typography>
                    </Box>
                )}

                <Box mt={4}>
                    <TextareaAutosize
                        aria-label="Ask your question"
                        placeholder="Ask your question"
                        value={question}
                        onChange={handleQuestionChange}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '4px',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                        }}
                        minRows={3}
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
                    <Box mt={4} maxWidth="md" pb={12}>
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