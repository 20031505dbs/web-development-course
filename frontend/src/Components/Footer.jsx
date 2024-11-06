import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "2rem",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link href="#" color="inherit" underline="hover">
              About Us
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Contact Us
            </Link>
            <Link href="#" color="inherit" underline="hover">
              FAQs
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Return Policy
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Terms & Conditions
            </Link>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Social Media
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {/* Add social media icons here */}
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contact Info
          </Typography>
          <Typography variant="body2">
            Address: 123 Ethnic St, Fashion City, Country
          </Typography>
          <Typography variant="body2">Phone: (123) 456-7890</Typography>
          <Typography variant="body2">Email: support@ethnicwear.com</Typography>
        </Box>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Payment Methods
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {/* Add payment method icons here */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
