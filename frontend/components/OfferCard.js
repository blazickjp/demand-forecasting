import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const OfferCard = ({ image, title, description, additionalContent }) => {
    return (
        <Card sx={{ minWidth: 275, maxWidth: 345, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia component="img" height="140" image={image} alt={title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            {additionalContent && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 1 }}>
                    {additionalContent}
                </Box>
            )}
        </Card>
    );
};


export default OfferCard;
