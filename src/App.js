import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline';   // Import CssBaseline

import Login from './components/Login';
import InventarioLayout from './components/InventarioLayout';
import ListadoProductos from './components/ListadoProductos';
import RegistrarProducto from './components/RegistrarProducto';
import Inicio from './components/Inicio';
import Movimientos from './components/Movimientos';
import ProductosRegistrados from './components/ProductosRegistrados';
import ListaProductosStockBajo from './components/ListaProductosStockBajo';
import ListadoLotes from './components/ListadoLotes';
import Categorias from './components/CategoriasRegistradas';

import theme from './theme'; // Import your custom theme

function App() {
  return (
    // 1. Wrap your entire application with ThemeProvider
    <ThemeProvider theme={theme}>
      {/* 2. Add CssBaseline for consistent styling across browsers */}
      <CssBaseline /> 
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/inventario/*"
            element={
              <PrivateRoute>
                <InventarioLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Inicio />} />
            <Route path="listado" element={<ListadoProductos />} />
            <Route path="agregar" element={<RegistrarProducto />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="registrados" element={<ProductosRegistrados />} />
            <Route path="stock-bajo" element={<ListaProductosStockBajo />} />
            <Route path="lotes" element={<ListadoLotes />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default App;