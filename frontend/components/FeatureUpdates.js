// components/FeatureUpdates.js
import { Typography, List, ListItem, Box } from '@mui/material';

export default function FeatureUpdates() {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} marginTop={5}>
            <Typography variant="h6" gutterBottom>
                This whole site has been made by: GPT-4
            </Typography>
            {/* <List>
                <ListItem>
                    Added CFA study material questions
                </ListItem>
            </List>

            <Typography variant="h6" gutterBottom>
                Upcoming Features:
            </Typography>
            <List>
                <ListItem>
                    Submitting questions feature
                </ListItem>
                <ListItem>
                    Analytics on performance
                </ListItem>
            </List> */}
        </Box>
    );
}
