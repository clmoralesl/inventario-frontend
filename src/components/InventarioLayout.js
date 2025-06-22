import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
  Button,
  Divider,
  ListItemButton,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import cajaPng from '../assets/1370329.png';
import arrow from '../assets/mov.png';
import cajaLote from '../assets/lotePNG.png';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 230;

function InventarioLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openLote, setOpenLote] = React.useState(true);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleLoteClick = () => {
    setOpenLote((prev) => !prev);
  };

  // Helper para saber si la ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Inventario Barlacteo
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {/* Botón para ir a Inicio */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/inventario"
              selected={isActive('/inventario')}
            >
              <HomeIcon sx={{ mr: 1 }} />
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleMenuClick}>
              <img
                src={cajaPng}
                alt="Productos"
                width={24}
                height={24}
                style={{ marginRight: 8, verticalAlign: 'middle' }}
              />
              <ListItemText primary="Productos" />
              {openMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/listado"
                  selected={isActive('/inventario/listado')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Listado de Productos" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/agregar"
                  selected={isActive('/inventario/agregar')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Registrar Producto" /> {/* Cambiado aquí */}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/registrados"
                  selected={isActive('/inventario/registrados')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Productos Registrados" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/stock-bajo"
                  selected={isActive('/inventario/stock-bajo')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Productos con bajo stock" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>


          <ListItem disablePadding>
            <ListItemButton onClick={handleLoteClick}>
              <img
                src={cajaLote}
                alt="Lotes"
                width={24}
                height={24}
                style={{ marginRight: 8, verticalAlign: 'middle' }}
              />
              <ListItemText primary="Lotes" />
              {openLote ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openLote} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/lotes"
                  selected={isActive('/inventario/lotes')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Listar Lotes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/inventario/lotes/agregar"
                  selected={isActive('/inventario/lotes/agregar')}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Agregar Lote" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/inventario/movimientos"
              selected={isActive('/inventario/movimientos')}
            >
              <img
                src={arrow}
                alt="Movimientos"
                width={24}
                height={24}
                style={{ marginRight: 5, verticalAlign: 'middle' }}
              />
              <ListItemText primary="Movimientos" />
              
            </ListItemButton>      
          </ListItem>




          
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pr: 1,
          pb: 3,
          pl: 0,
          marginLeft: 5,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default InventarioLayout;