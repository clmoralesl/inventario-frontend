import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import invenImg from '../assets/inven.JPG';
import logo from '../assets/Logo2.png';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      const { jwt } = response.data;
      localStorage.setItem('token', jwt); // Almacenar el token en localStorage
      setError('');
      navigate('/inventario'); // Redirigir al inventario
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minWidth: { xs: 320, md: 700 },
          minHeight: { xs: 400, md: 400 },
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Formulario */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.95)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src={logo} alt="Logo" style={{ width: 170, height: 170, objectFit: 'contain' }} />
          </Box>
          <Typography variant="h4" align="center" gutterBottom>
            Accede a tu cuenta
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
        </Box>
        {/* Imagen a la derecha */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
          }}
        >
          <img
            src={invenImg}
            alt="Inventario"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              maxHeight: 550,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;