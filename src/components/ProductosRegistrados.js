import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from './axiosInstance';

function ProductosRegistrados() {
  const [productos, setProductos] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [productoDelete, setProductoDelete] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSuccessDelete, setOpenSuccessDelete] = useState(false);
  const [openSuccessEdit, setOpenSuccessEdit] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axiosInstance
      .get('/producto')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  const handleDeleteClick = (producto) => {
    setProductoDelete(producto);
    setOpenDelete(true);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setProductoDelete(null);
  };

  const handleDeleteConfirm = () => {
    axiosInstance
      .delete(`/producto/${productoDelete.codigoBarra}`)
      .then(() => {
        fetchProductos();
        setOpenDelete(false);
        setProductoDelete(null);
        setOpenSuccessDelete(true); // Mostrar ventana de éxito de eliminación
      })
      .catch((error) => {
        setErrorMsg(
          error.response?.data || 'Error al eliminar producto. Puede que el producto esté relacionado con otros registros.'
        );
        setOpenDelete(false);
        setOpenError(true);
      });
  };

  const handleEditOpen = (producto) => {
    setProductoEdit({ ...producto });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setProductoEdit(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProductoEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = () => {
    axiosInstance
      .put(`/producto/${productoEdit.codigoBarra}`, productoEdit)
      .then(() => {
        setOpenEdit(false);      // Cierra el diálogo de edición
        setOpenSuccessEdit(true);    // Abre el diálogo de éxito de edición
        fetchProductos();        // Actualiza la lista
      })
      .catch((error) => {
        alert('Error al modificar producto');
        console.error(error);
      });
  };

  const handleErrorClose = () => {
    setOpenError(false);
    setErrorMsg('');
  };

  const handleSuccessDeleteClose = () => {
    setOpenSuccessDelete(false);
  };

  const handleSuccessEditClose = () => {
    setOpenSuccessEdit(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Productos Registrados</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código de Barra</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
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
                <TableCell>{producto.categoria?.nombreCategoria}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEditOpen(producto)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(producto)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {productoEdit && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Código de Barra"
                name="codigoBarra"
                value={productoEdit.codigoBarra}
                disabled
                fullWidth
              />
              <TextField
                label="Nombre"
                name="nombreProducto"
                value={productoEdit.nombreProducto}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Descripción"
                name="descripcion"
                value={productoEdit.descripcion}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Precio Unitario"
                name="precioUnitario"
                type="number"
                value={productoEdit.precioUnitario}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Stock Mínimo"
                name="stockMinimo"
                type="number"
                value={productoEdit.stockMinimo}
                onChange={handleEditChange}
                fullWidth
              />
              {/* Si quieres permitir editar la categoría, agrega aquí un Select */}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar el producto{' '}
            <b>{productoDelete?.nombreProducto}</b> (Código: {productoDelete?.codigoBarra})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de error al eliminar */}
      <Dialog
        open={openError}
        onClose={handleErrorClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Error al eliminar</DialogTitle>
        <DialogContent>
          <Typography color="error">
            {typeof errorMsg === 'object'
              ? errorMsg.mensaje || JSON.stringify(errorMsg)
              : errorMsg}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de éxito al eliminar */}
      <Dialog
        open={openSuccessDelete}
        onClose={handleSuccessDeleteClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Producto eliminado</DialogTitle>
        <DialogContent>
          <Typography color="success.main">
            El producto fue eliminado exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDeleteClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de éxito al editar */}
      <Dialog
        open={openSuccessEdit}
        onClose={handleSuccessEditClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Producto editado</DialogTitle>
        <DialogContent>
          <Typography color="success.main">
            El producto fue editado exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessEditClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProductosRegistrados;