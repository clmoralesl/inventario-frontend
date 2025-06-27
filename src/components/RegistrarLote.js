import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Stack,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import axiosInstance from './axiosInstance';

function RegistrarLote() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    codigoBarra: '',
    numeroLote: '',
    stockLote: '',
    fechaVencimiento: '',
    idProveedor: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axiosInstance
      .get('/producto')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al obtener productos:', err));

    axiosInstance
      .get('/proveedor')
      .then((res) => setProveedores(res.data))
      .catch((err) => console.error('Error al obtener proveedores:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      numeroLote: formData.numeroLote,
      stockLote: formData.stockLote,
      fechaVencimiento: formData.fechaVencimiento,
      producto: {
        codigoBarra: formData.codigoBarra,
      },
      proveedor: {
        idProveedor: formData.idProveedor,
      },
    };

    axiosInstance
      .post('/lote/registrar', payload)
      .then(() => {
        alert('Lote registrado correctamente');
        setFormData({
          codigoBarra: '',
          numeroLote: '',
          stockLote: '',
          fechaVencimiento: '',
          idProveedor: '',
        });
        setErrors({});
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors(error.response.data);
        } else {
          console.error('Error al registrar lote:', error);
        }
      });
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Registrar Lote</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <Stack spacing={2}>
          {/* Código de Barra */}
          <FormControl fullWidth size="small">
            <InputLabel>Código de Barra</InputLabel>
            <Select
              name="codigoBarra"
              value={formData.codigoBarra}
              label="Código de Barra"
              onChange={handleChange}
              error={!!errors.codigoBarra}
            >
              <MenuItem value="">
                <em>Seleccione un producto</em>
              </MenuItem>
              {productos.map((prod) => (
                <MenuItem key={prod.codigoBarra} value={prod.codigoBarra}>
                  {prod.codigoBarra} - {prod.nombreProducto}
                </MenuItem>
              ))}
            </Select>
            {errors.codigoBarra && (
              <Typography color="error" variant="caption">
                {errors.codigoBarra}
              </Typography>
            )}
          </FormControl>

          {/* Número de Lote */}
          <TextField
            fullWidth
            name="numeroLote"
            label="Número de Lote"
            value={formData.numeroLote}
            onChange={handleChange}
            error={!!errors.numeroLote}
            helperText={errors.numeroLote}
            size="small"
          />

          {/* Stock Lote */}
          <TextField
            fullWidth
            name="stockLote"
            label="Stock del Lote"
            type="number"
            value={formData.stockLote}
            onChange={handleChange}
            error={!!errors.stockLote}
            helperText={errors.stockLote}
            size="small"
          />

          {/* Fecha de Vencimiento */}
          <TextField
            fullWidth
            name="fechaVencimiento"
            label="Fecha de Vencimiento"
            type="date"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            error={!!errors.fechaVencimiento}
            helperText={errors.fechaVencimiento}
            InputLabelProps={{ shrink: true }}
            size="small"
          />

          {/* Proveedor */}
          <FormControl fullWidth size="small">
            <InputLabel>Proveedor</InputLabel>
            <Select
              name="idProveedor"
              value={formData.idProveedor}
              label="Proveedor"
              onChange={handleChange}
              error={!!errors.idProveedor}
            >
              <MenuItem value="">
                <em>Seleccione un proveedor</em>
              </MenuItem>
              {proveedores.map((prov) => (
                <MenuItem key={prov.idProveedor} value={prov.idProveedor}>
                  {prov.nombreProveedor}
                </MenuItem>
              ))}
            </Select>
            {errors.idProveedor && (
              <Typography color="error" variant="caption">
                {errors.idProveedor}
              </Typography>
            )}
          </FormControl>

          {/* Botón */}
          <Box sx={{ textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary">
              Registrar Lote
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export default RegistrarLote;