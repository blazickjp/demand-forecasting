import React from 'react';
import { Box, Card, CardContent, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PracticeQuestions = () => {
    // Hardcoded question for now
    const question = {
        "learning_objectives": [
            "Interpret interest rates as required rates of return, discount rates, or opportunity costs",
            "Explain an interest rate as the sum of a real risk-free rate and premiums that compensate investors for bearing distinct types of risk",
            "Calculate and interpret the future value (FV) and present value (PV) of a single sum of money, an ordinary annuity, an annuity due, a perpetuity (PV only), and a series of unequal cash flows",
            "Demonstrate the use of a time line in modeling and solving time value of money problems",
            "Calculate the solution for time value of money problems with different frequencies of compounding",
            "Calculate and interpret the effective annual rate, given the stated annual interest rate and the frequency of compounding"
        ],
        "learning_module_name": "Learning Module 1\tThe Time Value of Money",
        "parsed_question": {
            "id": "1",
            "question": "Based on the information in the above table, address the following:",
            "options": {
                "A": "Explain the difference between the interest rates on Investment 1 and Investment 2.",
                "B": "Estimate the default risk premium.",
                "C": "Calculate upper and lower limits for the interest rate on Investment 3, r3."
            },
            "data": {
                "table": {
                    "headers": [
                        "Investment",
                        "Maturity (in Years)",
                        "Liquidity",
                        "Default Risk",
                        "Interest Rate (%)"
                    ],
                    "rows": [
                        {
                            "Investment": "1",
                            "Maturity (in Years)": "2",
                            "Liquidity": "High",
                            "Default Risk": "Low",
                            "Interest Rate (%)": "2.0"
                        },
                        {
                            "Investment": "2",
                            "Maturity (in Years)": "2",
                            "Liquidity": "Low",
                            "Default Risk": "Low",
                            "Interest Rate (%)": "2.5"
                        },
                        {
                            "Investment": "3",
                            "Maturity (in Years)": "7",
                            "Liquidity": "Low",
                            "Default Risk": "Low",
                            "Interest Rate (%)": "r3"
                        },
                        {
                            "Investment": "4",
                            "Maturity (in Years)": "8",
                            "Liquidity": "High",
                            "Default Risk": "Low",
                            "Interest Rate (%)": "4.0"
                        },
                        {
                            "Investment": "5",
                            "Maturity (in Years)": "8",
                            "Liquidity": "Low",
                            "Default Risk": "High",
                            "Interest Rate (%)": "6.5"
                        }
                    ]
                }
            }
        }
    };

    const [selectedValue, setSelectedValue] = React.useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleSubmit = () => {
        // handle submit logic here
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="div" gutterBottom>
                {question.learning_module_name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
                <Card sx={{ width: '80%', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                    <CardContent>
                        <Box mt={2}>
                            <Typography variant="h6" color="text.primary">
                                {question?.parsed_question?.question}
                            </Typography>
                        </Box>
                        {question?.parsed_question?.data && question?.parsed_question?.data.table && (
                            <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TableContainer component={Paper} sx={{ width: '80%' }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {question?.parsed_question?.data?.table.headers.map((header) => (
                                                    <TableCell key={header}>{header}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {question?.parsed_question?.data?.table.rows.map((row) => (
                                                <TableRow key={row.Investment}>
                                                    {Object.values(row).map((cell, index) => (
                                                        <TableCell key={index}>{cell}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>                            </Table>
                                </TableContainer>
                            </Box>
                        )}
                        <Box pt={4}>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="quiz" name="quiz" value={selectedValue} onChange={handleChange}>
                                    {question?.parsed_question?.options && Object.entries(question?.parsed_question?.options).map(([key, value]) => (
                                        <FormControlLabel key={key} value={key} control={<Radio />} label={`${key}: ${value}`} />
                                    ))}
                                </RadioGroup>                    </FormControl>
                        </Box>
                        <Box mt={2}>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>

    );
}


export default PracticeQuestions;
