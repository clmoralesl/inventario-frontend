import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, FormControl, Select, MenuItem, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  const [generalError, setGeneralError] = useState(""); // Añade este estado
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState([]); // <-- Nuevo estado

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
    setGeneralError("");
    setValidationErrors([]);
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
        // Manejo de error 500 con mensaje en error.response.data
        if (error.response && error.response.status === 500 && typeof error.response.data === "string") {
          setErrorDialogMsg(error.response.data);
          setOpenErrorDialog(true);
        } else if (error.response && error.response.status === 400) {
          setErrors(error.response.data);
          // Si es un objeto de errores de validación, lo mostramos en el Dialog
          if (typeof error.response.data === "object" && error.response.data !== null) {
            setValidationErrors(Object.values(error.response.data));
            setOpenErrorDialog(true);
          } else if (typeof error.response.data === "string") {
            setGeneralError(error.response.data);
          }
        } else if (error.response && error.response.data && error.response.data.message) {
          setGeneralError(error.response.data.message);
        } else {
          setGeneralError("Error inesperado al registrar producto.");
          console.error('Error al registrar producto:', error);
        }
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Registrar Producto</Typography>
      {generalError && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body1">{generalError}</Typography>
        </Box>
      )}
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

      {/* Dialog de error */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>Error al registrar producto</DialogTitle>
        <DialogContent>
          {validationErrors.length > 0 ? (
            <Box>
              {validationErrors.map((msg, idx) => (
                <Typography color="error" key={idx} sx={{ mb: 1 }}>
                  {msg}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography color="error">{errorDialogMsg}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="primary" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RegistrarProducto;