import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, Paper, Box } from '@mui/material'; // <-- Corrige aquí
import axiosInstance from './axiosInstance';

const COLORS = ['#e53935', '#43a047'];

function GraficoPorcentajeStockBajo() {
  const [porcentaje, setPorcentaje] = useState(0);
  const [total, setTotal] = useState(0);
  const [bajo, setBajo] = useState(0);

  useEffect(() => {
    // Obtener productos bajo stock
    let bajoStock = 0;
    let totalProductos = 0;

    axiosInstance.get('/producto/stock_bajo')
      .then((respBajo) => {
        bajoStock = Array.isArray(respBajo.data) ? respBajo.data.length : 0;
        setBajo(bajoStock);

        // Obtener total de productos
        axiosInstance.get('/producto/listar')
          .then((respTotal) => {
            totalProductos = Array.isArray(respTotal.data) ? respTotal.data.length : 0;
            setTotal(totalProductos);

            if (totalProductos > 0) {
              setPorcentaje(Math.round((bajoStock / totalProductos) * 100));
            } else {
              setPorcentaje(0);
            }
          });
      });
  }, []);

  const data = [
    { name: 'Bajo Stock', value: bajo },
    { name: 'Stock Suficiente', value: total - bajo }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        % de Productos Bajo Stock
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} productos`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Typography align="center" sx={{ mt: 2 }}>
        {porcentaje}% de los productos están bajo stock mínimo
      </Typography>
    </Paper>
  );
}

export default GraficoPorcentajeStockBajo;