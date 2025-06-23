import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import GraficoProductosVendidos from './GraficoProductosVendidos'; 
import GraficoProductosPorUnidades from './GraficoProductosPorUnidades'
import GraficoCategoriasPorMonto from './GraficoCategoriasPorMonto';
import GraficoPorcentajeStockBajo from './GraficoPorcentajeStockBajo';

function Inicio() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Bienvenido al Inventario Barlacteo
      </Typography>
      <Paper elevation={4} sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom  sx={{ fontSize: '3rem' }}>
          Métricas del último mes
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <GraficoProductosVendidos />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <GraficoProductosPorUnidades />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <GraficoCategoriasPorMonto />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <GraficoPorcentajeStockBajo />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Inicio;