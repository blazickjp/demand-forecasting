import React, { useState } from 'react';
import FileUploadForm from './FileUploadForm';
import {
    Typography,
    Box,
    Container,
    Card,
    CardContent,
    Link,
    Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import withAuthNavBar from './withAuthNavBar';

const Generate = ({ mainContentMargin }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState(null);

    const handleFileUpload = (uploadedData, headers) => {
        setData(uploadedData);
        setHeaders(headers);
    };

    const columns = headers
        ? headers.map((header, index) => ({
            field: index,
            headerName: header,
            flex: 1,
        }))
        : [];

    const rows = data.slice(1).map((row, index) => ({
        id: index,
        ...row,
    }));

    return (
        <Box marginLeft={`${mainContentMargin}px`} ransition="cubic-bezier(0, 0, 0.2, 1)">
            <Container maxWidth="lg">
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generate Forecast
                    </Typography>
                </Box>
                <Typography variant="body1" component="p" gutterBottom>
                    Upload your data file to start generating a forecast.
                </Typography>
                <Typography variant="body2" component="p" gutterBottom>
                    Please upload a CSV file with headers. The file should be well-formatted and include the necessary columns for the forecast.
                </Typography>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Box mt={4}>
                            <Card elevation={3} sx={{ borderRadius: '8px' }}>
                                <CardContent sx={{ padding: '24px' }}>
                                    <FileUploadForm onFileUpload={handleFileUpload} />
                                </CardContent>
                            </Card>
                            <Typography variant="body2" component="p" gutterBottom>
                                <Link href="/help" target="_blank">
                                    Learn more about the forecasting process and data requirements.
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                    {data.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Box mt={4}>
                                <Card elevation={3} sx={{ borderRadius: '8px' }}>
                                    <CardContent sx={{ padding: '24px' }}>
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            Data Preview
                                        </Typography>
                                        <Box mt={2} style={{ width: '100%', height: 400 }}>
                                            <DataGrid
                                                rows={rows}
                                                columns={columns}
                                                pageSize={10}
                                                disableSelectionOnClick
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default withAuthNavBar(Generate);
