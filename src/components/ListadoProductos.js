import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination,
  TextField,
  Box,
  FormControl, // Importa FormControl
  InputLabel,  // Importa InputLabel
  Select,      // Importa Select
  MenuItem     // Importa MenuItem
} from '@mui/material';
import axiosInstance from './axiosInstance';

function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]); // Nuevo estado para las categorías
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Nuevo estado para la categoría seleccionada
  const rowsPerPage = 25;

  useEffect(() => {
    // Cargar productos
    axiosInstance
      .get('/producto/listar')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener productos:', error));

    // Cargar categorías
    axiosInstance
      .get('/categoria') 
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);
      })
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reiniciar la página a 0 cada vez que se modifica la búsqueda
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0); // Reiniciar la página a 0 cada vez que se modifica la categoría
  };

  // 1. Filtrar productos basándose en el searchQuery y selectedCategory
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Paginar los productos filtrados
  const paginatedProductos = filteredProductos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Typography variant="h4" gutterBottom>Listado de Productos</Typography>

      {/* Contenedor para la barra de búsqueda y el filtro de categoría */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}> {/* 'gap' para espacio entre elementos, 'flexWrap' para responsividad */}
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }} // Permite que el TextField crezca
        />

        <FormControl sx={{ minWidth: 200 }}> {/* Ancho mínimo para el Select */}
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Categoría"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">Todas las Categorías</MenuItem> {/* Opción para mostrar todas */}
            {categories.map((category) => (
              <MenuItem key={category.id || category.nombreCategoria} value={category.nombreCategoria}>
                {category.nombreCategoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código de Barra</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock Actual</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProductos.length > 0 ? (
              paginatedProductos.map((producto) => (
                <TableRow key={producto.codBarra}>
                  <TableCell>{producto.codBarra}</TableCell>
                  <TableCell>{producto.nombreProducto}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell
                    sx={
                      producto.stockActual < producto.stockMin
                        ? { color: 'error.main', fontWeight: 'bold' }
                        : {}
                    }
                  >
                    {producto.stockActual}
                  </TableCell>
                  <TableCell>{producto.stockMin}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredProductos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>
    </>
  );
}

export default ListadoProductos;