import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axiosInstance from './axiosInstance';

function ListaProductosStockBajo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/producto/stock_bajo')
      .then((response) => {
        setProductos(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error al obtener productos con bajo stock:', error));
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Productos con Bajo Stock
      </Typography>
      <TableContainer>
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
            {productos.map((producto) => (
              <TableRow key={producto.codBarra}>
                <TableCell>{producto.codBarra}</TableCell>
                <TableCell>{producto.nombreProducto}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{producto.stockActual}</TableCell>
                <TableCell>{producto.stockMin}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
              </TableRow>
            ))}
            {productos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay productos con bajo stock.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ListaProductosStockBajo;