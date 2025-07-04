import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination,
  TextField, Box, FormControl, InputLabel, Select, MenuItem, Collapse, IconButton
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axiosInstance from './axiosInstance';

function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expanded, setExpanded] = useState(null); // Para controlar qué producto está expandido
  const [lotesPorProducto, setLotesPorProducto] = useState({}); // {codigoBarra: [lotes]}
  const rowsPerPage = 25;

  useEffect(() => {
    axiosInstance
      .get('/producto/listar')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        data.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener productos:', error));

    axiosInstance
      .get('/categoria')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);
      })
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  const handleExpandClick = (codigoBarra) => {
    if (expanded === codigoBarra) {
      setExpanded(null);
      return;
    }
    setExpanded(codigoBarra);
    if (!lotesPorProducto[codigoBarra]) {
      axiosInstance
        .get('/lote/listar')
        .then((response) => {
          const lotes = Array.isArray(response.data) ? response.data : [];
          // Filtra lotes por producto
          const lotesProducto = lotes.filter(
            (l) => l.producto && l.producto.codigoBarra === codigoBarra
          );
          setLotesPorProducto((prev) => ({
            ...prev,
            [codigoBarra]: lotesProducto,
          }));
        })
        .catch((error) => console.error('Error al obtener lotes:', error));
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedProductos = filteredProductos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Typography variant="h4" gutterBottom>Listado de Productos</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Categoría"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">Todas las Categorías</MenuItem>
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
              <TableCell />
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
                <React.Fragment key={producto.codBarra}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleExpandClick(producto.codBarra)}
                        aria-label="expand row"
                      >
                        {expanded === producto.codBarra ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
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
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expanded === producto.codBarra} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Lotes de este producto:
                          </Typography>
                          {lotesPorProducto[producto.codBarra] && lotesPorProducto[producto.codBarra].length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>N° Lote</TableCell>
                                  <TableCell>Stock Lote</TableCell>
                                  <TableCell>Fecha Vencimiento</TableCell>
                                  <TableCell>Ubicación</TableCell>
                                  <TableCell>Proveedor</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {lotesPorProducto[producto.codBarra].map((lote) => (
                                  <TableRow key={lote.idLote}>
                                    <TableCell>{lote.numeroLote}</TableCell>
                                    <TableCell>{lote.stockLote}</TableCell>
                                    <TableCell>{lote.fechaVencimiento}</TableCell>
                                    <TableCell>{lote.ubicacion?.descripcionUbicacion}</TableCell>
                                    <TableCell>{lote.proveedor?.nombreProveedor}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No hay lotes para este producto.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
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