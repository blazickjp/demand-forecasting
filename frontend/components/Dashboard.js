import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import withAuthNavBar from './withAuthNavBar';
import FeatureUpdates from './FeatureUpdates';


const Dashboard = ({ mainContentMargin }) => {
    return (
        <Box>
            <FeatureUpdates />
        </Box>
    );
};

export default withAuthNavBar(Dashboard);
