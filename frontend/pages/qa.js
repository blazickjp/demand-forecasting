import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    TextareaAutosize,
    Select, // Add this import
    MenuItem, // Add this import
} from '@mui/material';
import withAuthNavBar from '../components/withAuthNavBar';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { styled } from '@mui/system';


const Question = styled('div')({
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '8px',
    margin: '8px 0',
});

const Answer = styled('div')({
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    padding: '8px',
    margin: '8px 0',
});

const ConversationContainer = styled('div')({
    maxHeight: '500px',
    overflowY: 'scroll',
    marginBottom: '16px',
});


const fixedPosition = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    // background: 'white',
    padding: '16px',
    // borderTop: '1px solid rgba(0, 0, 0, 0.23)',
};

// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


// Use dynamic import to load the libraries
const importKatexAndShowdown = async () => {
    const [katexModule, showdownModule] = await Promise.all([
        import('katex'),
        import('showdown'),
    ]);

    return { katex: katexModule.default, showdown: showdownModule.default };
};



const QAPage = ({ mainContentMargin }) => {
    const [question, setQuestion] = useState('');
    const [file, setFile] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [dataset, setDataset] = useState('bayesian_data_analysis');
    const [errorMessage, setErrorMessage] = useState(null);
    const answerRef = useRef(null);
    const [conversationHistory, setConversationHistory] = useState([]);
    const userFirstName = user?.displayName?.split(' ')[0] || 'Human';



    useEffect(() => {
        if (answer && answerRef.current) {
            renderMarkdownWithLatex(answer, answerRef.current);
            // Prism.highlightAllUnder(answerRef.current);
        }
    }, [answer]);

    // Add this function inside the QAPage component
    const addToConversationHistory = (question, answer) => {
        setConversationHistory((prevHistory) => {
            const newHistory = [
                ...prevHistory,
                { type: 'question', content: question },
                { type: 'answer', content: answer },
            ];
            // Keep only the most recent 10 questions and answers (20 items)
            return newHistory.slice(-20);
        });
    };

    // Add this function inside the QAPage component
    const handleClearCache = async (type) => {
        if (type === 'memory') resetConversationHistory();

        try {
            // console.log(JSON.stringify({ cache_type: type, user_id: user.uid }))
            const response = await fetch('http://localhost:8888/clear_cache', {
                // const response = await fetch('https://llm-backend-dot-fresh-oath-383101.ue.r.appspot.com/clear_cache', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cache_type: type, user_id: user.uid }),
            });

            console.log(response);
        } catch (error) {
            console.error('Error clearing cache:', error.message);
        }
    };


    // Redirect to the login page if the user is not authenticated
    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    async function renderMarkdownWithLatex(markdownText, targetElement) {
        // Load the required libraries
        const { katex, showdown } = await importKatexAndShowdown();

        // Create a Showdown converter
        const converter = new showdown.Converter();

        // Convert Markdown to HTML
        const html = converter.makeHtml(markdownText);

        // Set the innerHTML of the target element
        targetElement.innerHTML = html;

        // Find all elements with the class 'katex'
        const katexElements = targetElement.querySelectorAll('.katex');

        // Render LaTeX using KaTeX
        katexElements.forEach((elem) => {
            const latex = elem.textContent || elem.innerText;
            katex.render(latex, elem);
        });
    }
    const resetConversationHistory = () => {
        setConversationHistory([]);
    };


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
        // console.log(JSON.stringify({ question, user_id: user.uid, dataset }))
        try {
            const response = await fetch(
                // 'https://llm-backend-dot-fresh-oath-383101.ue.r.appspot.com/llm_answer',
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
                throw new Error(errorData.error || `Request failed with status ${response.status}, ${response.body}`);
            }

            const result = await response.json();
            console.log(result);
            setAnswer(result.answer);
            setConversationHistory((prev) => [
                ...prev,
                { type: 'question', content: `${userFirstName}: ${question}` },
                { type: 'answer', content: `MindSproutAI: ${result.answer}` },
            ]);

            // Clear the input field
            // setQuestion('');
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
                <Box sx={{ minWidth: 120, mx: 1, my: 1 }}>
                    <Select
                        value={dataset}
                        onChange={handleDatasetChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select a dataset' }}
                    >
                        {/* <MenuItem value="bayesian_data_analysis">Bayesian Data Analysis</MenuItem>\ */}
                        <MenuItem value="kaplan_cfa_level_2_book_1">Kaplan CFA Book 1</MenuItem>
                        {/* <MenuItem value="NCLEX">Nursing Exam NCLEX</MenuItem> */}

                        {/* Add more MenuItem components for other datasets here */}
                    </Select>
                </Box>
                {/* Add this Box for the conversation stream */}
                <Box mt={4} maxWidth="md" pb={4}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Conversation History:
                    </Typography>
                    <ConversationContainer>
                        {conversationHistory.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.type === 'question' ? (
                                    <Question>{item.content}</Question>
                                ) : (
                                    <Answer>{item.content}</Answer>
                                )}
                            </React.Fragment>
                        ))}
                    </ConversationContainer>
                </Box>
                {errorMessage && (
                    <Box mt={4}>
                        <Typography variant="body1" component="p" color="error">
                            {errorMessage}
                        </Typography>
                    </Box>
                )}
                {/* Wrap the chat and input components */}
                <Box display="flex" flexDirection="column" flexGrow={10}>
                    <Box mt={4} display="flex" justifyContent="center" marginBottom={4} sx={{
                        position: 'fixed',
                        bottom: 40,
                        left: 0,
                        right: 0,
                        // background: 'white',
                        padding: '16px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.23)',
                    }}>
                        <TextareaAutosize
                            aria-label="Ask your question"
                            placeholder="Ask your question"
                            value={question}
                            onChange={handleQuestionChange}
                            style={{
                                width: '50%',
                                // padding: '4px 4px',
                                borderRadius: '4px',
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                            }}
                            minRows={3}
                        />
                    </Box>
                    <Box mt={4} display="flex" justifyContent="center" marginBottom={0} sx={fixedPosition}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleClearCache('memory')}
                            sx={{ mx: 1, my: 1 }}
                        >
                            Clear Memory Cache
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleClearCache('user')}
                            sx={{ mx: 1, my: 1 }}
                        >
                            Clear User Cache
                        </Button>
                        {/* Your other components */}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ mx: 1, my: 1 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit'}
                        </Button>
                    </Box>
                </Box>
            </Container >

        </Box >
    );
};

export default withAuthNavBar(QAPage);