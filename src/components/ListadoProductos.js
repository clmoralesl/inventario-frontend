import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination
} from '@mui/material';
import axiosInstance from './axiosInstance';

function ListadoProductos() {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  useEffect(() => {
    axiosInstance
      .get('/producto/listar')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener productos:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedProductos = productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Typography variant="h4" gutterBottom>Listado de Productos</Typography>
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
            {paginatedProductos.map((producto) => (
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
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={productos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </>
  );
}

export default ListadoProductos;