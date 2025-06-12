import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axiosInstance from './axiosInstance'; // Asegúrate de que la ruta sea correcta

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Nuevo estado para categorías
  const [formData, setFormData] = useState({
    codigoBarra: '',
    nombreProducto: '',
    descripcion: '',
    precioUnitario: '',
    stockMinimo: '',
    categoria: { idCategoria: '' },
  });
  const [errors, setErrors] = useState({});


  // Obtener lista de productos
  useEffect(() => {
    axiosInstance
      .get('/categoria')
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);
  useEffect(() => {
  axiosInstance
    .get('/producto')
    .then((response) => setProductos(response.data))
    .catch((error) => console.error('Error al obtener productos:', error));
}, []);
  // Manejar cambios en el formulario
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
  // Enviar formulario para registrar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/producto/registrar', formData)
      .then((response) => {
        setProductos([...productos, response.data]);
        setFormData({
          codigoBarra: '',
          nombreProducto: '',
          descripcion: '',
          precioUnitario: '',
          stockMinimo: '',
          categoria: { idCategoria: '' },
        });
        setErrors({});
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sistema de Inventario
      </Typography>

      {/* Formulario para registrar producto */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código de Barra"
              name="codigoBarra"
              type="number"
              value={formData.codigoBarra}
              onChange={handleInputChange}
              error={!!errors.codigoBarra}
              helperText={errors.codigoBarra}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Producto"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleInputChange}
              error={!!errors.nombreProducto}
              helperText={errors.nombreProducto}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Precio Unitario"
              name="precioUnitario"
              type="number"
              value={formData.precioUnitario}
              onChange={handleInputChange}
              error={!!errors.precioUnitario}
              helperText={errors.precioUnitario}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stock Mínimo"
              name="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleInputChange}
              error={!!errors.stockMinimo}
              helperText={errors.stockMinimo}
            />
          </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.categoria}>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                labelId="categoria-label"
                label="Categoría"
                name="idCategoria"
                value={formData.categoria.idCategoria}
                onChange={handleInputChange}
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
            </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Registrar Producto
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código de Barra</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.codigoBarra}>
                <TableCell>{producto.codigoBarra}</TableCell>
                <TableCell>{producto.nombreProducto}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>${producto.precioUnitario}</TableCell>
                <TableCell>{producto.stockMinimo}</TableCell>
                <TableCell>{producto.categoria.nombreCategoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Inventario;