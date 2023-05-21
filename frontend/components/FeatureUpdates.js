// components/FeatureUpdates.js
import { Typography, Box, Checkbox, Container } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


const features = [
    {
        label: 'Extract EOC Questions from CFAI Study Guide and Render in UI',
        checked: true,
        disabled: true,
    },
    {
        label: 'Predict Learning Objective for each EOC Question',
        checked: true,
        disabled: true,
    },
    {
        label: 'Use LLM to generate answer for each EOC Question',
        checked: false,
        disabled: false,
    },
    {
        label: 'Generate Flash Cards for key topic',
        checked: false,
        disabled: false,
        deescription: 'Use BabyAGI to analyze the CFA curriculum and automatically generate flashcards, or other study materials'
    },
    {
        label: 'Track progress and performance for each Question',
        checked: false,
        disabled: false,
    },
    {
        label: 'Chatbot to answer questions and teach topics while practicing problems',
        checked: false,
        disabled: false,
    },
    {
        label: 'Use LLM to determine why person missed a question',
        checked: false,
        disabled: false,
    },
    {
        label: 'Personalized Study Plans',
        checked: false,
        disabled: false,
        description: 'Leverage AI to create customized study plans for users based on their strengths, weaknesses, and learning style. The AI could monitor user progress and dynamically adjust the study plan as needed'
    },
    {
        label: 'Practice Questions Generator',
        checked: false,
        disabled: false,
        description: 'Develop an AI system that can generate practice questions based on the CFA curriculum. It could create new questions on the fly or rephrase existing ones to provide a diverse range of practice materials'
    },

];

export default function FeatureUpdates() {
    return (
        <Container maxWidth="md">
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginTop={5}>
                <Typography variant="h4" gutterBottom>
                    This whole site has been made by: GPT-4
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Upcoming Features:
                </Typography>
                <List>
                    {features.map((feature, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Checkbox
                                checked={feature.checked}
                                disabled={feature.disabled}
                                sx={{
                                    '&.Mui-checked': {
                                        color: 'green',
                                    },
                                    '&.Mui-disabled': {
                                        color: 'success',
                                    },

                                }}
                                color="success"
                            />
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body1"
                                        component="span"
                                        sx={{
                                            textDecoration: feature.disabled ? 'line-through' : 'none'
                                        }}
                                    >
                                        {feature.label}
                                    </Typography>
                                }
                                secondary={
                                    feature.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                pl: 2,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    )
                                }
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}

                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container >
    );
}