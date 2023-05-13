import React from 'react';
import { Container, Typography } from '@mui/material';
import withAuthNavBar from '../../components/withAuthNavBar';
import PracticeQuestion from '../../components/PracticeQuestion';  // Import the Questions component\
import QuestionNavbar from '../../components/QuestionNavbar';

import { getFirestore, collection, getDocs } from 'firebase/firestore';

function PracticeProblems() {
    const [questions, setQuestions] = React.useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);


    React.useEffect(() => {
        const db = getFirestore();
        const getQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, 'questions'));
            const data = querySnapshot.docs.map(doc => doc.data());
            setQuestions(data);
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


    return (
        <div>
            <QuestionNavbar onPrevious={handlePrevious} onNext={handleNext} />
            <hr /> {/* This will render a horizontal line */}
            <Container maxWidth="lg">
                {/* Here you can add the components that will display the questions and answers */}
                <PracticeQuestion question={questions[currentQuestionIndex]} />   {/* Render the Questions component */}
            </Container>
        </div>
    );
}

export default withAuthNavBar(PracticeProblems);
