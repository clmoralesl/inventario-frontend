import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, TablePagination
} from '@mui/material';
import axiosInstance from './axiosInstance';

const columns = [
  { id: 'idMovimiento', label: 'ID' },
  { id: 'fechaMovimiento', label: 'Fecha' },
  { id: 'tipoMovimiento', label: 'Tipo', getValue: mov => mov.tipoMovimiento?.descripcionTipoMovimiento },
  { id: 'producto', label: 'Producto', getValue: mov => mov.producto?.nombreProducto },
  { id: 'unidades', label: 'Unidades' },
  { id: 'lote', label: 'Lote', getValue: mov => mov.lote?.numeroLote },
  { id: 'proveedor', label: 'Proveedor', getValue: mov => mov.lote?.proveedor?.nombreProveedor },
  { id: 'idUsuario', label: 'ID Usuario' },
];

function descendingComparator(a, b, orderBy, getValue) {
  const aValue = getValue ? getValue(a) : a[orderBy];
  const bValue = getValue ? getValue(b) : b[orderBy];
  if (bValue === undefined || bValue === null) return -1;
  if (aValue === undefined || aValue === null) return 1;
  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
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

  useEffect(() => {
    axiosInstance.get('/movimiento')
      .then((response) => {
        setMovimientos(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error al obtener movimientos:', error));
  }, []);

  const handleRequestSort = (property, getValue) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortedMovimientos = [...movimientos].sort(
    getComparator(order, orderBy, columns.find(col => col.id === orderBy)?.getValue)
  );

  const paginatedMovimientos = sortedMovimientos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>Lista de Movimientos</Typography>
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
            {paginatedMovimientos.map((mov) => (
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
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedMovimientos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25]}
        />
      </TableContainer>
    </>
  );
}

export default Movimientos;