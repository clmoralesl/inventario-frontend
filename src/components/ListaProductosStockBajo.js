import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import axiosInstance from './axiosInstance';

function ListaProductosStockBajo() {
  const [productos, setProductos] = useState([]);
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    // Obtener productos con bajo stock
    axiosInstance
      .get('/producto/stock_bajo')
      .then((response) => {
        const productosOrdenados = Array.isArray(response.data)
          ? [...response.data].sort((a, b) => a.stockActual - b.stockActual)
          : [];
        setProductos(productosOrdenados);
      })
      .catch((error) => console.error('Error al obtener productos con bajo stock:', error));

    // Obtener top 10 productos populares por unidades vendidas
    axiosInstance
      .get('/movimiento/ventas/detalle-ultimomes')
      .then((response) => {
        // Agrupa por nombreProducto y suma unidadesVendidas
        const agrupado = {};
        if (Array.isArray(response.data)) {
          response.data.forEach(item => {
            const nombre = item.nombreProducto;
            agrupado[nombre] = (agrupado[nombre] || 0) + (item.unidadesVendidas || 0);
          });
        }
        // Top 10 productos más vendidos por unidades
        const top10Arr = Object.entries(agrupado)
          .map(([nombreProducto, unidadesVendidas]) => ({ nombreProducto, unidadesVendidas }))
          .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas)
          .slice(0, 10)
          .map(p => p.nombreProducto.trim());
        setTop10(top10Arr);
      })
      .catch((error) => console.error('Error al obtener top 10 productos populares:', error));
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Productos con Bajo Stock
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <b>*</b> Indica productos que están en el <b>Top 10 de productos populares</b> (más vendidos) en los últimos 30 días.
        </Typography>
      </Box>
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
            {productos.map((producto) => {
              const esTop10 = top10.includes(producto.nombreProducto.trim());
              return (
                <TableRow key={producto.codBarra}>
                  <TableCell>{producto.codBarra}</TableCell>
                  <TableCell>
                    {esTop10 ? (
                      <b>
                        * {producto.nombreProducto}
                      </b>
                    ) : (
                      producto.nombreProducto
                    )}
                  </TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{producto.stockActual}</TableCell>
                  <TableCell>{producto.stockMin}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                </TableRow>
              );
            })}
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