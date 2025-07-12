import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  TablePagination, TextField, Box, FormControl, InputLabel, Select, MenuItem, TableSortLabel
} from '@mui/material';
import axiosInstance from './axiosInstance';

function DetalleVentas() {
  const [ventas, setVentas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  // Ordenamiento
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('fechaMovimiento');

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-general')
      .then((response) => {
        setVentas(Array.isArray(response.data) ? response.data : []);
        const cats = Array.isArray(response.data)
          ? [...new Set(response.data.map(v => v.nombreCategoria))]
          : [];
        setCategorias(cats);
      })
      .catch((error) => console.error('Error al obtener detalle de ventas:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
    setPage(0);
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setPage(0);
  };

  // Ordenamiento
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtro
  const filteredVentas = ventas.filter((venta) => {
    const matchesNombre = venta.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoria = !selectedCategoria || venta.nombreCategoria === selectedCategoria;
    const matchesFecha = !fecha || venta.fechaMovimiento === fecha.split('-').reverse().join('-');
    return matchesNombre && matchesCategoria && matchesFecha;
  });

  // Ordenar
  function parseFecha(fechaStr) {
    // "dd-MM-yyyy" => Date
    const [dd, mm, yyyy] = fechaStr.split('-');
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  const comparator = (a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    if (orderBy === 'fechaMovimiento') {
      aValue = parseFecha(aValue);
      bValue = parseFecha(bValue);
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  };
  const sortedVentas = [...filteredVentas].sort(comparator);

  const paginatedVentas = sortedVentas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Columnas
  const columns = [
    { id: 'fechaMovimiento', label: 'Fecha' },
    { id: 'nombreProducto', label: 'Producto' },
    { id: 'nombreCategoria', label: 'Categoría' },
    { id: 'unidadesVendidas', label: 'Unidades Vendidas' },
    { id: 'precioUnitario', label: 'Precio Unitario' },
    { id: 'precioTotal', label: 'Precio Total' },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>Detalle de Ventas</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Buscar por producto"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 220, flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="categoria-label">Categoría</InputLabel>
          <Select
            labelId="categoria-label"
            value={selectedCategoria}
            label="Categoría"
            onChange={handleCategoriaChange}
          >
            <MenuItem value="">Todas las Categorías</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={handleFechaChange}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 170 }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} sortDirection={orderBy === col.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleRequestSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVentas.length > 0 ? (
              paginatedVentas.map((venta, idx) => (
                <TableRow key={venta.nombreProducto + venta.fechaMovimiento + idx}>
                  <TableCell>{venta.fechaMovimiento}</TableCell>
                  <TableCell>{venta.nombreProducto}</TableCell>
                  <TableCell>{venta.nombreCategoria}</TableCell>
                  <TableCell>{venta.unidadesVendidas}</TableCell>
                  <TableCell>${venta.precioUnitario}</TableCell>
                  <TableCell>${venta.precioTotal}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 3 }}>
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedVentas.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </TableContainer>
    </>
  );
}

export default DetalleVentas;