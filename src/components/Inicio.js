import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GraficoProductosVendidos from './GraficoProductosVendidos'; 
import GraficoProductosPorUnidades from './GraficoProductosPorUnidades'
import GraficoCategoriasPorMonto from './GraficoCategoriasPorMonto';
import GraficoPorcentajeStockBajo from './GraficoPorcentajeStockBajo';
import GraficoVentasUltimos30Dias from './GraficoVentasUltimos30Dias';
import axiosInstance from './axiosInstance';
import cashIcon from '../assets/income.png';
import stockOutIcon from '../assets/0stock.png';
import lowStock from '../assets/moneylost.png';

// Widget que muestra el ingreso total del día
function WidgetIngresoDia() {
  const [ingreso, setIngreso] = useState(null);

  useEffect(() => {
    axiosInstance.get('/movimiento/ventas/detalle-dia')
      .then((response) => {
        const total = Array.isArray(response.data)
          ? response.data.reduce((acc, prod) => acc + (prod.precioTotal || 0), 0)
          : 0;
        setIngreso(total);
      })
      .catch(() => setIngreso(0));
  }, []);

  return (
    <Paper sx={{ 
      p: 2, 
      display: 'flex',
      alignItems: 'center', 
      background: '#1976d2', // azul vibrante
      color: '#fff', 
      textAlign: 'center', 
      width: 350, 
      height: 120,        
      borderRadius: 2,
      cursor: 'default'
    }}>
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <img
          src={cashIcon}
          alt="Ingreso día"
          style={{ width: 60, height: 60, filter: 'invert(1)' }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Ingresos del Día
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
          {ingreso !== null
            ? ingreso.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })
            : 'Cargando...'}
        </Typography>
      </Box>
    </Paper>
  );
}

// Widget que muestra la cantidad de productos sin stock
function WidgetProductosSinStock() {
  const [cantidad, setCantidad] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/producto/stock_bajo')
      .then((response) => {
        const productosSinStock = Array.isArray(response.data)
          ? response.data.filter(prod => prod.stockActual === 0)
          : [];
        setCantidad(productosSinStock.length);
      })
      .catch(() => setCantidad(0));
  }, []);

  return (
    <Paper
      onClick={() => navigate('/inventario/stock-bajo')}
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        background: '#ff1744', // rojo vibrante
        color: '#fff', 
        textAlign: 'center', 
        width: 350, 
        height: 120, 
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 6,
          opacity: 0.92,
        }
      }}
      elevation={3}
    >
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <img src={stockOutIcon} alt="Sin stock" style={{ width: 60, height: 60, filter: 'invert(1)' }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Productos sin stock
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
          {cantidad !== null ? cantidad : 'Cargando...'}
        </Typography>
      </Box>
    </Paper>
  );
}

function WidgetTop10PopularesBajoStock() {
  const [popularesBajoStock, setPopularesBajoStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener movimientos del último mes y productos con stock bajo
    Promise.all([
      axiosInstance.get('/movimiento/ventas/detalle-ultimomes'),
      axiosInstance.get('/producto/stock_bajo')
    ])
      .then(([movResp, stockResp]) => {
        // Agrupar por producto y sumar unidades vendidas
        const agrupado = {};
        if (Array.isArray(movResp.data)) {
          movResp.data.forEach(item => {
            const nombre = item.nombreProducto;
            agrupado[nombre] = (agrupado[nombre] || 0) + (item.unidadesVendidas || 0);
          });
        }
        // Top 10 productos más vendidos por unidades
        const top10 = Object.entries(agrupado)
          .map(([nombreProducto, unidadesVendidas]) => ({ nombreProducto, unidadesVendidas }))
          .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas)
          .slice(0, 10);

        // Verifica si alguno de los top 10 está en stock bajo
        const productosStockBajo = Array.isArray(stockResp.data) ? stockResp.data : [];
        const nombresStockBajo = new Set(productosStockBajo.map(p => p.nombreProducto.trim()));

        // Cuenta cuántos del top 10 están en stock bajo
        const cantidadPopularesBajoStock = top10.filter(p => nombresStockBajo.has(p.nombreProducto.trim())).length;

        setPopularesBajoStock(cantidadPopularesBajoStock);
        setLoading(false);
      })
      .catch(() => {
        setPopularesBajoStock(0);
        setLoading(false);
      });
  }, []);

  return (
    <Paper
      onClick={() => navigate('/inventario/stock-bajo')}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        background: '#ff9800', // naranja para destacar
        color: '#fff',
        textAlign: 'center',
        width: 350,
        height: 120,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 6,
          opacity: 0.92,
        }
      }}
      elevation={3}
    >
      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <img src={lowStock} alt="Populares bajo stock" style={{ width: 60, height: 60, filter: 'invert(1)' }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Productos Populares con Bajo Stock
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
          {loading ? <CircularProgress size={28} color="inherit" /> : popularesBajoStock}
        </Typography>
      </Box>
    </Paper>
  );
}

function Inicio() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Bienvenido al Inventario Barlacteo
      </Typography>
      <Box sx={{ height: 50 }} />
      <Box sx={{ display: 'flex', gap: 5, maxWidth: 1200, mx: 'auto', width: '100%', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <WidgetIngresoDia />
        </Box>
        <Box sx={{ flex: 1 }}>
          <WidgetProductosSinStock />
        </Box>
        <Box sx={{ flex: 1 }}>
          <WidgetTop10PopularesBajoStock />
        </Box>
      </Box>
      <Paper elevation={4} sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontSize: '3rem' }}>
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
            <GraficoVentasUltimos30Dias />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Inicio;