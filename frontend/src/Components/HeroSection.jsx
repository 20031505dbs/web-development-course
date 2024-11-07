import React from "react";
import { Box, Button } from "@mui/material";

function HeroSection() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url("/assets/background.jpg")`,
          height: "800px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="secondary" size="large" href="/">
          Shop Now
        </Button>
      </Box>
    </>
  );
}

export default HeroSection;
