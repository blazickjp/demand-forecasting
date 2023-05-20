// components/FeatureUpdates.js
import { Typography, Box, Checkbox } from '@mui/material';

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

  ];

export default function FeatureUpdates() {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginTop={5}>
            <Typography variant="h4" gutterBottom>
                This whole site has been made by: GPT-4
            </Typography>
            <Typography variant="h4" gutterBottom>
                Upcoming Features:
            </Typography>
            <Box>
                {features.map((feature, index) => (
                    <div key={index}>
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
                    <Typography
                        variant="body1"
                        component="span"
                        sx={{
                            textDecoration: feature.disabled ? 'line-through' : 'none',
                        }}
                    >
                        {feature.label}
                    </Typography>
                    <br />
                    </div>
                ))}
            </Box>
        </Box>
    );
}