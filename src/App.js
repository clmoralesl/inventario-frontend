import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import InventarioLayout from './components/InventarioLayout';
import ListadoProductos from './components/ListadoProductos';
import RegistrarProducto from './components/RegistrarProducto'; // Cambiado el import
import Inicio from './components/Inicio'; 
import Movimientos from './components/Movimientos';
import ProductosRegistrados from './components/ProductosRegistrados'; 
import ListaProductosStockBajo from './components/ListaProductosStockBajo';
import ListadoLotes from './components/ListadoLotes';


function App() {
  return (
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
          <Route index element={<Inicio />} /> {/* Página de inicio */}
          <Route path="listado" element={<ListadoProductos />} />
          <Route path="agregar" element={<RegistrarProducto />} /> {/* Cambiado aquí */}
          <Route path="movimientos" element={<Movimientos />} />
          <Route path="registrados" element={<ProductosRegistrados />} /> 
          <Route path="stock-bajo" element={<ListaProductosStockBajo />} />
          <Route path="lotes" element={<ListadoLotes />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default App;