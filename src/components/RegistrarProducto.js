import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, FormControl, Select, MenuItem, Stack } from '@mui/material';
import axiosInstance from './axiosInstance';

function RegistrarProducto() {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    codigoBarra: '',
    nombreProducto: '',
    descripcion: '',
    precioUnitario: '',
    stockMinimo: '',
    categoria: { idCategoria: '' },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axiosInstance
      .get('/categoria')
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idCategoria') {
      setFormData((prev) => ({
        ...prev,
        categoria: { idCategoria: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/producto/registrar', formData)
      .then(() => {
        setFormData({
          codigoBarra: '',
          nombreProducto: '',
          descripcion: '',
          precioUnitario: '',
          stockMinimo: '',
          categoria: { idCategoria: '' },
        });
        setErrors({});
        alert('Producto registrado correctamente');
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors(error.response.data);
        } else {
          console.error('Error al registrar producto:', error);
        }
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Registrar Producto</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, maxWidth: 600 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Código de Barra:</Typography>
            <TextField
              fullWidth
              name="codigoBarra"
              type="number"
              value={formData.codigoBarra}
              onChange={handleInputChange}
              error={!!errors.codigoBarra}
              helperText={errors.codigoBarra}
              size="small"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Nombre del Producto:</Typography>
            <TextField
              fullWidth
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleInputChange}
              error={!!errors.nombreProducto}
              helperText={errors.nombreProducto}
              size="small"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Descripción:</Typography>
            <TextField
              fullWidth
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              size="small"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Precio Unitario:</Typography>
            <TextField
              fullWidth
              name="precioUnitario"
              type="number"
              value={formData.precioUnitario}
              onChange={handleInputChange}
              error={!!errors.precioUnitario}
              helperText={errors.precioUnitario}
              size="small"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Stock Mínimo:</Typography>
            <TextField
              fullWidth
              name="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleInputChange}
              error={!!errors.stockMinimo}
              helperText={errors.stockMinimo}
              size="small"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ minWidth: 150 }}>Categoría:</Typography>
            <FormControl fullWidth error={!!errors.categoria} size="small">
              <Select
                labelId="categoria-label"
                name="idCategoria"
                value={formData.categoria.idCategoria}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Seleccione una categoría</em>
                </MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombreCategoria}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoria && (
                <Typography color="error" variant="caption">
                  {errors.categoria}
                </Typography>
              )}
            </FormControl>
          </Stack>
          <Box sx={{ textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary">
              Registrar Producto
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export default RegistrarProducto;