import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from './axiosInstance';
import { Typography, Paper } from '@mui/material';

function GraficoProductosPorUnidades() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-ultimomes')
      .then((response) => {
        // Agrupa por nombreProducto y suma unidadesVendidas
        const agrupado = {};
        if (Array.isArray(response.data)) {
          response.data.forEach(item => {
            const nombre = item.nombreProducto;
            agrupado[nombre] = (agrupado[nombre] || 0) + (item.unidadesVendidas || 0);
          });
        }
        // Convierte a array de objetos
        const productos = Object.entries(agrupado).map(([nombreProducto, unidadesVendidas]) => ({
          nombreProducto,
          unidadesVendidas
        }));
        // Ordena por unidadesVendidas descendente y toma los 10 primeros
        const top10 = productos
          .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas)
          .slice(0, 10);
        setData(top10);
      })
      .catch((error) => console.error('Error al obtener datos de ventas:', error));
  }, []);

  // Tooltip personalizado para mostrar unidades
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2">
            Unidades Vendidas: <b>{payload[0].value}</b>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Más Vendidos por Unidades los últimos 30 días
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 40, right: 40 }}
          barCategoryGap={20}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="unidadesVendidas"
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="nombreProducto"
            width={220}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="unidadesVendidas" fill="#43a047" name="Unidades Vendidas" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default GraficoProductosPorUnidades;