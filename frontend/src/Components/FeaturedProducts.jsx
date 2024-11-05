import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { ApiCall } from "../utils/ApiCall";
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    const getFeaturedProducts = async () => {
      const data = await fetchFeaturedProducts();
      setProducts(data);
    };
    getFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await ApiCall("products", "GET", null, {
        type: "featured",
      });
      return response;
    } catch (error) {
      console.log(error);
      console.error("Failed to fetch featured products:", error);
      return [];
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await ApiCall("cart", "POST", {
        product_id: product.id,
        quantity: parseInt(quantity), // Use the current value of quantity state
        user_id: JSON.parse(localStorage.getItem("user")).id,
      });
      if (response.status === 201) {
        alert("Item added to cart successfully!");
        const data = await fetchFeaturedProducts();
        setProducts(data);
      } else {
        alert("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    }
  };
  return (
    <Box sx={{ my: 1 }}>
      <Typography variant="h4" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`/assets/${product.img}`}
                alt={product.name}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="p">
                  <b>Stock</b>: {product.stock}
                </Typography>
                <Typography variant="p">
                  <b>Colors</b>: {"    "}
                  {product.colors}
                </Typography>
                <Typography variant="p">
                  {" "}
                  <b>Size:</b> {product.sizes}
                </Typography>
                <Typography variant="p">
                  <b>Price</b>: {product.price}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ my: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{ my: 2 }}
                  color="secondary"
                  href="/cart"
                >
                  Visit Cart
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FeaturedProducts;
