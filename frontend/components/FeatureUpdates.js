// components/FeatureUpdates.js
import { Typography, Box, Checkbox } from '@mui/material';

export default function FeatureUpdates() {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginTop={5}>
            <Typography variant="h6" gutterBottom>
                This whole site has been made by: GPT-4
            </Typography>
            <Typography variant="h6" gutterBottom>
                Upcoming Features:
            </Typography>
            <Typography component="div">
                <Checkbox
                    checked
                    disabled
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
                <Typography variant="body1" component="span" sx={{ textDecoration: 'line-through' }}>
                    Submitting questions feature
                </Typography>
                <br />
                <Checkbox
                    checked
                    disabled
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
                <Typography variant="body1" component="span" sx={{ textDecoration: 'line-through' }}>
                    Analytics on performance
                </Typography>
                <br />
                <Checkbox
                    disabled
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
                <Typography variant="body1" component="span">
                    Integration with external APIs
                </Typography>
                <br />
                <Checkbox
                    disabled
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
                <Typography variant="body1" component="span">
                    Improved user interface
                </Typography>
            </Typography>
        </Box>
    );
}