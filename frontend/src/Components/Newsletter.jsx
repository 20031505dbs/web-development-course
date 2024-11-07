import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function Newsletter() {
  return (
    <Box sx={{ my: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Stay Updated
      </Typography>
      <Box component="form" sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <TextField label="Enter your email" variant="outlined" />
        <Button variant="contained" color="primary">
          Subscribe
        </Button>
      </Box>
    </Box>
  );
}

export default Newsletter;
