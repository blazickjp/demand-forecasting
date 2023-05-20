import React from 'react';
import { Box, Card, CardContent, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CardHeader, Divider } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { color } from '@mui/system';
import { alpha } from '@mui/system';


function PracticeQuestions({ question }) {
    const [selectedValue, setSelectedValue] = React.useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    // const [anchorEl, setAnchorEl] = React.useState(null);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        // handle submit logic here
    }

    if (!question) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* <Typography variant="h4" component="div" gutterBottom>
                {question.learning_module_name}
            </Typography> */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
                <Card sx={{ width: '80%', mb: 3, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Tooltip title="Click to view learning objectives associated with this question">
                                    <Button variant="outlined" onClick={handleOpen} sx={{ fontSize: '.5em' }}>
                                        Learning Objectives
                                    </Button>
                                </Tooltip>
                                <Dialog onClose={handleClose} open={open}>
                                    <DialogTitle>Learning Objectives</DialogTitle>
                                    <DialogContent>
                                        <ol >
                                            {question.predicted_objectives.map((objective, index) => (
                                                <li key={index} style={{ fontSize: '.9rem' }}>
                                                    <Typography style={{ fontSize: '.9rem' }} key={index}>{objective}</Typography>
                                                </li>

                                            ))}
                                        </ol>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Tooltip title={<React.Fragment><strong>Learning Module: </strong>{question.learning_module_name.replace(/Learning Module \d+/, '')}</React.Fragment>}>
                                    <Button variant="outlined" sx={{ fontSize: '.5em' }}>
                                        Learning Module
                                    </Button>
                                </Tooltip>
                            </Box>
                            <CardHeader title={question?.parsed_question?.question} titleTypographyProps={{ variant: 'body1' }} />
                        </Box>
                        <Box mt={2}>
                            <Divider />
                        </Box>
                        <Box mt={2}>

                        </Box>
                        {question?.parsed_question?.data && question?.parsed_question?.data.table && (
                            <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TableContainer component={Paper} style={{ maxWidth: '80%', overflowX: 'auto', border: '1px solid black' }}>
                                    <Table sx={{ minWidth: 450, '& .MuiTableCell-root': { borderBottom: '1px solid #e0e0e0' } }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {question?.parsed_question?.data?.table.headers.map((header) => (
                                                    <TableCell
                                                        key={header}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.8),
                                                            borderBottom: '2px solid #a0a0a0',
                                                            color: 'white'
                                                        }}                                                    >
                                                        {header}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {question?.parsed_question?.data?.table.rows.map((row, index) => (
                                                <TableRow key={index}>
                                                    {question?.parsed_question?.data?.table.headers.map((header, headerIndex) => (
                                                        <TableCell key={headerIndex} align={typeof row[header] === 'number' ? 'right' : 'left'}>{row[header]}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                        <Box pt={4}>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="quiz" name="quiz" value={selectedValue} onChange={handleChange}>
                                    {question?.parsed_question?.options && Object.entries(question?.parsed_question?.options).map(([key, value]) => (
                                        <FormControlLabel
                                            key={key}
                                            value={key}
                                            control={
                                                <Radio
                                                    style={{ paddingRight: "25px" }} /> // Aligns the Radio button to the top of the text
                                            }
                                            label={`${key}: ${value}`}
                                            style={{ margin: '15px 0' }}  // Add custom margin here
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box mt={2} mr={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box >

    );
}


export default PracticeQuestions;
