import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const QuestionNavbar = ({ onPrevious, onNext, currentIndex, totalQuestions, learningModules, onFilterChange }) => {
    const compareModules = (a, b) => {
        const aNum = parseInt(a.replace(/\D/g, ''));
        const bNum = parseInt(b.replace(/\D/g, ''));
        if (aNum < bNum) {
          return -1;
        }
        if (aNum > bNum) {
          return 1;
        }
        return 0;
      };
    return (
        <Box
            display="flex"
            justifyContent="flex-end" // Change here
            alignItems="center"
            my={2}
            px={2}
            width={"90%"}
        >
            <Box display="flex" justifyContent="center" alignItems="center" marginRight={30}>
                <Button
                    onClick={onPrevious}
                    startIcon={<ArrowBackIosIcon />}
                    variant="outlined"
                    color="inherit"
                >
                    Previous
                </Button>
                <Box mx={2}>
                    <Typography variant="body1">{`${currentIndex + 1} of ${totalQuestions}`}</Typography>
                </Box>
                <Button
                    onClick={onNext}
                    endIcon={<ArrowForwardIosIcon />}
                    variant="outlined"
                    color="inherit"
                >
                    Next
                </Button>
            </Box>
            <Box display="flex" width={"20%"}>
                <FormControl variant="outlined" sx={{ minWidth: 200, marginTop: 2 }}> {/* Change here */}
                    <InputLabel id="learning-module-label">Learning Module</InputLabel>
                    <Select
                        labelId="learning-module-label"
                        id="learning-module-select"
                        onChange={onFilterChange}
                        label="Learning Module"
                        sx={{ height: '70%' }} // Add this line to set the maxHeight
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left"
                            },
                            transformOrigin: {
                                vertical: "top",
                                horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}
                    >
                        {learningModules.sort(compareModules) && learningModules.map((module, index) => (
                            <MenuItem key={index} value={module} style={{ fontSize: '1rem', minHeight: '20px' }}>
                                {module.replace(/Learning Module \d+/, '')}
                            </MenuItem> 
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default QuestionNavbar;
