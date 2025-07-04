import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from './axiosInstance';
import { Typography, Paper } from '@mui/material';

// Formateador para pesos chilenos
const formatoCLP = (valor) =>
  valor?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

function GraficoVentasUltimos30Dias() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-ultimomes')
      .then((response) => {
        // Agrupa por fechaMovimiento y suma precioTotal por día
        const agrupado = {};
        if (Array.isArray(response.data)) {
          response.data.forEach(item => {
            const fecha = item.fechaMovimiento; // formato DD-MM-YYYY
            agrupado[fecha] = (agrupado[fecha] || 0) + (item.precioTotal || 0);
          });
        }
        // Convierte a array y ordena por fecha ascendente
        const datos = Object.entries(agrupado)
          .map(([fecha, total]) => ({ fecha, total }))
          .sort((a, b) => {
            // Convierte DD-MM-YYYY a YYYY-MM-DD para comparar fechas
            const [da, ma, ya] = a.fecha.split('-');
            const [db, mb, yb] = b.fecha.split('-');
            return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
          });
        setData(datos);
      })
      .catch((error) => console.error('Error al obtener ventas diarias:', error));
  }, []);

  // Tooltip personalizado para mostrar el precio formateado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2">
            Ventas: <b>{formatoCLP(payload[0].value)}</b>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Ventas diarias últimos 30 días
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ left: 40, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            tickFormatter={fecha => fecha.slice(0, 5)} // Muestra DD-MM
            minTickGap={5}
          />
          <YAxis
            dataKey="total"
            tickFormatter={formatoCLP}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Ventas"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default GraficoVentasUltimos30Dias;