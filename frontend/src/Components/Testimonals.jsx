import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const testimonials = [
  { name: 'John Doe', feedback: 'Great quality and fast delivery!' },
  { name: 'Jane Smith', feedback: 'Loved the collection, will shop again!' }
];

function Testimonials() {
  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h4" gutterBottom>
        What Our Customers Say
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {testimonials.map((testimonial, index) => (
          <Paper key={index} sx={{ p: 2, width: 300 }}>
            <Typography variant="body1">"{testimonial.feedback}"</Typography>
            <Typography variant="subtitle2" align="right">
              - {testimonial.name}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default Testimonials;
