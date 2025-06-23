import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  TableSortLabel, TablePagination, TextField, Box, FormControl, InputLabel, Select, MenuItem,
  Checkbox, ListItemText
} from '@mui/material';
import axiosInstance from './axiosInstance';

// Función auxiliar para acceder a valores anidados de forma segura
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Parsear fecha "dd-MM-yyyy HH:mm:ss" a "yyyy-MM-dd"
const parseFecha = (fechaTexto) => {
  if (!fechaTexto) return '';
  const [fecha] = fechaTexto.split(' ');
  const [dia, mes, anio] = fecha.split('-');
  return `${anio}-${mes}-${dia}`;
};

const columns = [
  { id: 'idMovimiento', label: 'ID' },
  { id: 'fechaMovimiento', label: 'Fecha' },
  { id: 'tipoMovimiento', label: 'Tipo', getValue: mov => mov.tipoMovimiento?.descripcionTipoMovimiento, filterKey: 'tipoMovimiento.descripcionTipoMovimiento' },
  { id: 'producto', label: 'Producto', getValue: mov => mov.producto?.nombreProducto, filterKey: 'producto.nombreProducto' },
  { id: 'unidades', label: 'Unidades' },
  { id: 'lote', label: 'Lote', getValue: mov => mov.lote?.numeroLote },
  { id: 'proveedor', label: 'Proveedor', getValue: mov => mov.lote?.proveedor?.nombreProveedor, filterKey: 'lote.proveedor.nombreProveedor' },
  { id: 'idUsuario', label: 'ID Usuario' },
];

function descendingComparator(a, b, orderBy, getValue) {
  const aValue = getValue ? getValue(a) : a[orderBy];
  const bValue = getValue ? getValue(b) : b[orderBy];
  if (bValue === undefined || bValue === null) return -1;
  if (aValue === undefined || aValue === null) return 1;
  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
  }
  return bValue < aValue ? -1 : (bValue > aValue ? 1 : 0);
}

function getComparator(order, orderBy, getValue) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, getValue)
    : (a, b) => -descendingComparator(a, b, orderBy, getValue);
}

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('idMovimiento');
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  const [searchQuery, setSearchQuery] = useState('');
  const [tipoMovimientosList, setTipoMovimientosList] = useState([]);
  const [selectedTipoMovimientos, setSelectedTipoMovimientos] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);
  const [selectedProveedores, setSelectedProveedores] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    axiosInstance.get('/movimiento')
      .then((response) => {
        setMovimientos(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error al obtener movimientos:', error));

    axiosInstance.get('/tipo-movimiento')
      .then((response) => {
        setTipoMovimientosList(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error al obtener tipos de movimiento:', error));

    axiosInstance.get('/proveedor')
      .then((response) => {
        setProveedoresList(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error al obtener proveedores:', error));
  }, []);

  const handleRequestSort = (property, getValue) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleTipoMovimientoChange = (event) => {
    const { value } = event.target;
    setSelectedTipoMovimientos(typeof value === 'string' ? value.split(',') : value);
    setPage(0);
  };

  const handleProveedorChange = (event) => {
    const { value } = event.target;
    setSelectedProveedores(typeof value === 'string' ? value.split(',') : value);
    setPage(0);
  };

  const filteredMovimientos = movimientos.filter((mov) => {
    const productName = getNestedValue(mov, 'producto.nombreProducto') || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());

    const movementType = getNestedValue(mov, 'tipoMovimiento.descripcionTipoMovimiento') || '';
    const matchesTipoMovimiento = selectedTipoMovimientos.length === 0 || selectedTipoMovimientos.includes(movementType);

    const supplierName = getNestedValue(mov, 'lote.proveedor.nombreProveedor') || '';
    const matchesProveedor = selectedProveedores.length === 0 || selectedProveedores.includes(supplierName);

    const fecha = parseFecha(mov.fechaMovimiento);
    const matchesFechaInicio = !fechaInicio || fecha >= fechaInicio;
    const matchesFechaFin = !fechaFin || fecha <= fechaFin;

    return matchesSearch && matchesTipoMovimiento && matchesProveedor && matchesFechaInicio && matchesFechaFin;
  });

  const sortedMovimientos = [...filteredMovimientos].sort(
    getComparator(order, orderBy, columns.find(col => col.id === orderBy)?.getValue)
  );

  const paginatedMovimientos = sortedMovimientos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>Lista de Movimientos</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Buscar por Producto"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />

        <FormControl sx={{ width: 250 }}>
          <InputLabel id="tipo-movimiento-label">Tipo de Movimiento</InputLabel>
          <Select
            labelId="tipo-movimiento-label"
            multiple
            value={selectedTipoMovimientos}
            onChange={handleTipoMovimientoChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {tipoMovimientosList.map((type) => (
              <MenuItem key={type.id || type.descripcionTipoMovimiento} value={type.descripcionTipoMovimiento}>
                <Checkbox checked={selectedTipoMovimientos.includes(type.descripcionTipoMovimiento)} />
                <ListItemText primary={type.descripcionTipoMovimiento} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 250 }}>
          <InputLabel id="proveedor-label">Proveedor</InputLabel>
          <Select
            labelId="proveedor-label"
            multiple
            value={selectedProveedores}
            onChange={handleProveedorChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {proveedoresList.map((proveedor) => (
              <MenuItem key={proveedor.id || proveedor.nombreProveedor} value={proveedor.nombreProveedor}>
                <Checkbox checked={selectedProveedores.includes(proveedor.nombreProveedor)} />
                <ListItemText primary={proveedor.nombreProveedor} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtros de fechas */}
        <TextField
          label="Desde"
          type="date"
          value={fechaInicio}
          onChange={(e) => {
            setFechaInicio(e.target.value);
            setPage(0);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160 }}
        />

        <TextField
          label="Hasta"
          type="date"
          value={fechaFin}
          onChange={(e) => {
            setFechaFin(e.target.value);
            setPage(0);
          }}           
          InputLabelProps={{ shrink: true }}
          sx={{ width: 160 }}
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
                    onClick={() => handleRequestSort(col.id, col.getValue)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMovimientos.length > 0 ? (
              paginatedMovimientos.map((mov) => (
                <TableRow key={mov.idMovimiento}>
                  <TableCell>{mov.idMovimiento}</TableCell>
                  <TableCell>{mov.fechaMovimiento}</TableCell>
                  <TableCell>{mov.tipoMovimiento?.descripcionTipoMovimiento}</TableCell>
                  <TableCell>{mov.producto?.nombreProducto}</TableCell>
                  <TableCell>{mov.unidades}</TableCell>
                  <TableCell>{mov.lote?.numeroLote}</TableCell>
                  <TableCell>{mov.lote?.proveedor?.nombreProveedor}</TableCell>
                  <TableCell>{mov.idUsuario}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 3 }}>
                  No se encontraron movimientos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredMovimientos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </TableContainer>
    </>
  );
}

export default Movimientos;
