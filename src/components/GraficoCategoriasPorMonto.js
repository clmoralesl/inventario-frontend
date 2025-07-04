import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from './axiosInstance';
import { Typography, Paper, Box } from '@mui/material';

// Colores para las categorías
const COLORS = ['#1976d2', '#43a047', '#fbc02d', '#e64a19', '#8e24aa', '#00838f', '#c62828'];

function GraficoCategoriasPorMonto() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-ultimomes')
      .then((response) => {
        // Agrupa por categoría y suma el precioTotal
        const agrupado = {};
        response.data.forEach(item => {
          const cat = item.nombreCategoria || 'Sin Categoría';
          agrupado[cat] = (agrupado[cat] || 0) + (item.precioTotal || 0);
        });
        // Convierte a array y ordena por monto descendente
        const arr = Object.entries(agrupado)
          .map(([nombreCategoria, monto]) => ({ nombreCategoria, monto }))
          .sort((a, b) => b.monto - a.monto);
        setData(arr);
      })
      .catch((error) => console.error('Error al obtener datos de ventas:', error));
  }, []);

  // Formateador para pesos chilenos
  const formatoCLP = (valor) =>
    valor?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { nombreCategoria, monto } = payload[0].payload;
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2">{nombreCategoria}</Typography>
          <Typography variant="body2">
            Monto total: <b>{formatoCLP(monto)}</b>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Categorías Más Populares por Monto de Venta en los últimos 30 días
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="monto"
              nameKey="nombreCategoria"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ nombreCategoria }) => nombreCategoria}
            >
              {data.map((entry, index) => (
                <Cell key={entry.nombreCategoria} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default GraficoCategoriasPorMonto;