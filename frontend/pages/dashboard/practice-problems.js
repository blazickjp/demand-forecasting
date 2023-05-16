import React from 'react';
import { Container, Typography } from '@mui/material';
import withAuthNavBar from '../../components/withAuthNavBar';
import PracticeQuestion from '../../components/PracticeQuestion';  // Import the Questions component\
import QuestionNavbar from '../../components/QuestionNavbar';
import { Box } from '@mui/material';


import { getFirestore, collection, getDocs } from 'firebase/firestore';

function PracticeProblems() {
    const [allQuestions, setAllQuestions] = React.useState([]);  // Holds all questions
    const [questions, setQuestions] = React.useState([]);  // Holds filtered questions
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [learningModules, setLearningModules] = React.useState([]);
    const [selectedModule, setSelectedModule] = React.useState(null);  // Initialize as null


    React.useEffect(() => {
        const db = getFirestore();
        const getQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, 'questions'));
            const data = querySnapshot.docs.map(doc => doc.data());
            setAllQuestions(data);  // Set all questions
            setQuestions(data);  // Also set to filtered questions initially

            const modules = [...new Set(data.map(question => question.learning_module_name))];
            setLearningModules(modules);
        };

        getQuestions();
    }, []);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFilterChange = (event) => {
        setSelectedModule(event.target.value);
    };

    React.useEffect(() => {
        const filteredQuestions = selectedModule
            ? allQuestions.filter(q => q.learning_module_name === selectedModule)
            : allQuestions;

        setQuestions(filteredQuestions);
        setCurrentQuestionIndex(0);  // Reset current question index when module changes
    }, [selectedModule, allQuestions]);


    return (
        <div>
            <QuestionNavbar
                onPrevious={handlePrevious}
                onNext={handleNext}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                learningModules={learningModules}
                onFilterChange={handleFilterChange}
            />            <hr /> {/* This will render a horizontal line */}
            <Container maxWidth="lg">
                <Box pt={8}> {/* Add padding-top */}
                    {/* Here you can add the components that will display the questions and answers */}
                    {questions.length > 0 && <PracticeQuestion question={questions[currentQuestionIndex]} />} {/* Render the Questions component only if there are questions */}
                </Box>
            </Container>
        </div >
    );
}

export default withAuthNavBar(PracticeProblems);
