import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';

const QuestionNavbar = ({ onPrevious, onNext }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={2}
            px={2}
        >
            <Button
                onClick={onPrevious}
                startIcon={<ArrowBackIosIcon />}
                variant="outlined"
                color="inherit"
            >
                Previous
            </Button>
            <Box mx={2}></Box>
            <Button
                onClick={onNext}
                endIcon={<ArrowForwardIosIcon />}
                variant="outlined"
                color="inherit"
            >
                Next
            </Button>
        </Box>
    );
};

export default QuestionNavbar;
