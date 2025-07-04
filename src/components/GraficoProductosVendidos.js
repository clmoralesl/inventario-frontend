import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from './axiosInstance';
import { Typography, Box, Paper } from '@mui/material';

// Formateador para pesos chilenos
const formatoCLP = (valor) =>
  valor?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

function GraficoProductosVendidos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-ultimomes')
      .then((response) => {
        // Ordena por precioTotal descendente y toma los 5 primeros
        const top10 = [...response.data]
          .sort((a, b) => b.precioTotal - a.precioTotal)
          .slice(0, 10);
        setData(top10);
      })
      .catch((error) => console.error('Error al obtener datos de ventas:', error));
  }, []);

  // Tooltip personalizado para mostrar el precio formateado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2">
            Ingreso Total: <b>{formatoCLP(payload[0].value)}</b>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Más Vendidos por Ingreso Total en los últimos 30 días
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} 
        layout="vertical" 
        margin={{ left: 40, right: 40 }}
        barCategoryGap={25}
        barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="precioTotal"
            tickFormatter={formatoCLP}
          />
          <YAxis type="category" dataKey="nombreProducto" width={180} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="precioTotal" fill="#1976d2" name="Ingreso Total" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default GraficoProductosVendidos;