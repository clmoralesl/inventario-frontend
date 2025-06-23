import React, { useEffect, useState, useMemo } from 'react'; // Importar useMemo
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack,
  TableSortLabel,
  TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from './axiosInstance';

function CategoriasRegistradas() {
  const [allCategorias, setAllCategorias] = useState([]); // Almacenar TODAS las categorías
  const [openEdit, setOpenEdit] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [categoriaDelete, setCategoriaDelete] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSuccessDelete, setOpenSuccessDelete] = useState(false);
  const [openSuccessEdit, setOpenSuccessEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [openSuccessAdd, setOpenSuccessAdd] = useState(false);

  // --- Estados para paginación y ordenamiento en el frontend ---
  const [page, setPage] = useState(0); // Página actual (0-indexed)
  const [rowsPerPage, setRowsPerPage] = useState(20); // Filas por página
  const [order, setOrder] = useState('asc'); // Dirección de ordenamiento ('asc' o 'desc')
  const [orderBy, setOrderBy] = useState('idCategoria'); // Columna por la que ordenar

  useEffect(() => {
    // Al cargar el componente, o después de una adición/edición/eliminación,
    // simplemente traemos TODAS las categorías.
    fetchCategorias();
  }, []); // El array de dependencias está vacío, solo se ejecuta una vez al montar

  const fetchCategorias = () => {
    // Aquí no enviamos parámetros de paginación/ordenamiento
    axiosInstance
      .get('/categoria')
      .then((response) => {
        // Asumimos que response.data es un array directamente con todas las categorías
        const data = Array.isArray(response.data) ? response.data : [];
        setAllCategorias(data); // Guardamos todas las categorías
        setPage(0); // Reiniciar la página a 0 cada vez que se obtienen nuevos datos
      })
      .catch((error) => console.error('Error al obtener categorías:', error));
  };

  // --- Funciones de Paginación y Ordenamiento en el Frontend ---

  // Helper para comparar valores para el ordenamiento
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // useMemo para ordenar y paginar las categorías de manera eficiente
  const sortedAndPaginatedCategorias = useMemo(() => {
    // 1. Crear una copia de las categorías para no mutar el estado original
    const stableSortCategorias = [...allCategorias];

    // 2. Ordenar las categorías
    stableSortCategorias.sort(getComparator(order, orderBy));

    // 3. Aplicar paginación
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return stableSortCategorias.slice(startIndex, endIndex);
  }, [allCategorias, order, orderBy, page, rowsPerPage]); // Dependencias del useMemo

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volver a la primera página cuando cambian las filas por página
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Definición de las celdas de encabezado con sus propiedades de ordenamiento
  const headCells = [
    { id: 'idCategoria', numeric: true, disablePadding: false, label: 'ID Categoría', align: 'left' },
    { id: 'nombreCategoria', numeric: false, disablePadding: false, label: 'Nombre de Categoría' },
    { id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones' },
  ];

  // --- Funciones de Diálogo (Eliminar, Editar, Añadir, Error, Éxito) - Ligeras modificaciones para actualizar `allCategorias` ---
  const handleDeleteClick = (categoria) => {
    setCategoriaDelete(categoria);
    setOpenDelete(true);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setCategoriaDelete(null);
  };

  const handleDeleteConfirm = () => {
    axiosInstance
      .delete(`/categoria/${categoriaDelete.idCategoria}`)
      .then(() => {
        setOpenDelete(false);
        setCategoriaDelete(null);
        setOpenSuccessDelete(true);
        fetchCategorias(); // Volver a obtener TODAS las categorías actualizadas
      })
      .catch((error) => {
        setErrorMsg(
          error.response?.data || 'Error al eliminar categoría. Puede que la categoría esté relacionada con productos.'
        );
        setOpenDelete(false);
        setOpenError(true);
      });
  };

  const handleEditOpen = (categoria) => {
    setCategoriaEdit({ ...categoria });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCategoriaEdit(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCategoriaEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = () => {
    axiosInstance
      .put(`/categoria/${categoriaEdit.idCategoria}?nuevoNombre=${categoriaEdit.nombreCategoria}`)
      .then(() => {
        setOpenEdit(false);
        setOpenSuccessEdit(true);
        fetchCategorias(); // Volver a obtener TODAS las categorías actualizadas
      })
      .catch((error) => {
        setErrorMsg(error.response?.data || 'Error al modificar categoría.');
        setOpenError(true);
        console.error(error);
      });
  };

  const handleAddOpen = () => {
    setNewCategoryName('');
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleAddChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddSave = () => {
    if (!newCategoryName.trim()) {
      setErrorMsg('El nombre de la categoría no puede estar vacío.');
      setOpenError(true);
      return;
    }

    axiosInstance
      .post(`/categoria/registrar?nombreCategoria=${newCategoryName}`)
      .then(() => {
        setOpenAdd(false);
        setOpenSuccessAdd(true);
        fetchCategorias(); // Volver a obtener TODAS las categorías actualizadas
      })
      .catch((error) => {
        setErrorMsg(error.response?.data || 'Error al registrar categoría. El nombre podría ya existir.');
        setOpenError(true);
        console.error(error);
      });
  };

  // --- Funciones para cerrar diálogos de estado ---
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

  const handleSuccessAddClose = () => {
    setOpenSuccessAdd(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Categorías Registradas</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddOpen}
        sx={{ mb: 2 }}
      >
        Registrar Nueva Categoría
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.id !== 'acciones' ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedCategorias.length === 0 && allCategorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">Cargando categorías...</TableCell>
              </TableRow>
            ) : sortedAndPaginatedCategorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">No hay categorías que coincidan con la búsqueda o paginación actual.</TableCell>
              </TableRow>
            ) : (
              sortedAndPaginatedCategorias.map((categoria) => (
                <TableRow key={categoria.idCategoria}>
                  <TableCell align="left" >{categoria.idCategoria}</TableCell>
                  <TableCell align="left">{categoria.nombreCategoria}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditOpen(categoria)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(categoria)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={allCategorias.length} // Usa el total de categorías cargadas en el frontend
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Diálogos (sin cambios en su estructura o funcionalidad de base) */}
      <Dialog
        open={openAdd}
        onClose={handleAddClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Registrar Nueva Categoría</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de Categoría"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancelar</Button>
          <Button onClick={handleAddSave} variant="contained" color="primary">
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Categoría</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {categoriaEdit && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="ID Categoría"
                name="idCategoria"
                value={categoriaEdit.idCategoria}
                disabled
                fullWidth
              />
              <TextField
                label="Nombre de Categoría"
                name="nombreCategoria"
                value={categoriaEdit.nombreCategoria}
                onChange={handleEditChange}
                fullWidth
              />
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

      <Dialog
        open={openDelete}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar la categoría{' '}
            <b>{categoriaDelete?.nombreCategoria}</b> (ID: {categoriaDelete?.idCategoria})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openError}
        onClose={handleErrorClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Error</DialogTitle>
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

      <Dialog
        open={openSuccessDelete}
        onClose={handleSuccessDeleteClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Categoría eliminada</DialogTitle>
        <DialogContent>
          <Typography color="success.main">
            La categoría fue eliminada exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDeleteClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessEdit}
        onClose={handleSuccessEditClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Categoría editada</DialogTitle>
        <DialogContent>
          <Typography color="success.main">
            La categoría fue editada exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessEditClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessAdd}
        onClose={handleSuccessAddClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Categoría Registrada</DialogTitle>
        <DialogContent>
          <Typography color="success.main">
            La nueva categoría fue registrada exitosamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessAddClose} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CategoriasRegistradas;