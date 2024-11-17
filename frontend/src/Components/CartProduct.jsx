import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { ApiCall } from "../utils/ApiCall";
const CartProduct = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await ApiCall("cart", "GET", null, {
        user_id: JSON.parse(localStorage.getItem("user")).id,
      });
      if (response) {
        setCartItems(response);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      const user_id = JSON.parse(localStorage.getItem("user")).id;

           const response = await ApiCall("cart", "DELETE",  { user_id, product_id });
      if (response) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== product_id)
        );
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      <Box sx={{ my: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600, fontSize: 30 }}
        >
          Cart Products
        </Typography>
        <Grid container spacing={4}>
          {cartItems?.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/assets/${product?.product?.img}`}
                  alt={product?.product?.name}
                />
                <CardContent>
                  <Typography variant="h6">{product?.product?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product?.product?.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => removeFromCart(product.product_id)}
                  >
                    Remove from Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CartProduct;
