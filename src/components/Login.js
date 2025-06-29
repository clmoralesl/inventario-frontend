import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CanvasBackground from "./CanvasBackground";
import logo from "../assets/Logo-Bar-Lacteo.png";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      setError("");
      navigate("/inventario");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <CanvasBackground />
      <Container maxWidth="sm" sx={{ mt: 12, position: "relative", zIndex: 1 }}>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
          mt={5} // espacio arriba
        >
          <img
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid white",
              boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)",
            }}
          />
        </Box>

        <Typography variant="h4" align="center" gutterBottom color="white">
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Login;