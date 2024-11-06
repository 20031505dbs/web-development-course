import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Typography } from "@mui/material";

const categories = ["Dresses", "Dupattas", "Tops", "Bottoms"];

function Categories() {
  const navigate = useNavigate();
  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h4" sm={{ textAlign: "center" }} gutterBottom>
        Shop by Category
      </Typography>
      <Grid container spacing={4}>
        {categories.map((category, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 6,
                m: 4,
                textAlign: "center",
                backgroundColor: "#3498db",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/categories/${category.toLowerCase()}`)}
            >
              {category}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Categories;
