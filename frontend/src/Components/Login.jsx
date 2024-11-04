import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ApiCall } from "../utils/ApiCall";
import { AuthContext } from "../Components/AuthContext";
import { Toast } from "./common/Toast/Toast";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ApiCall("login", "POST", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === "success") {
        Toast(response.message);
        login(response.user);
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        Toast("Failed to login", "error");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      console.error("There was an error logging in!", error);
      Toast(error.error, "error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Sign In
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#3f51b5" }}>
                Register here
              </a>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
