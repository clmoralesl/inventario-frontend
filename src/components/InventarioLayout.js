import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  Typography,
  Collapse,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import cajaPng from "../assets/1370329.png";
import arrow from "../assets/mov.png";
import tag from "../assets/tag.png";
import logo from "../assets/Logo2.png";
import cajaLote from "../assets/lotePNG.png";
import HomeIcon from "@mui/icons-material/Home";
import iconoProveedor from "../assets/IconoProveedores.webp";

const drawerWidth = 270;

function InventarioLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openLote, setOpenLote] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleLoteClick = () => {
    setOpenLote((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.body.classList.add("app-background");
    document.body.classList.remove("login-background");

    return () => {
      document.body.classList.remove("app-background");
    };
  }, []);

  return (
    <Box sx={{ display: "flex", ml: 3, mt: 2, mb: 2 }}>
      {/* Contenedor con margen para separar del borde */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: "relative",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRadius: 3,
              boxShadow: "none", // ya lo tiene el contenedor padre
              bgcolor: "transparent",
              position: "relative",
              left: 0,
              top: 0,
              height: "100%",
            },
          }}
        >
          <Toolbar>
            <img
              src={logo}
              alt="Icono Bar Lacteo"
              width={48}
              height={48}
              style={{ marginLeft: -20, marginRight: 12 }}
            />
            <Typography variant="h6" noWrap>
              Inventario Barlacteo
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/inventario"
                selected={isActive("/inventario")}
              >
                <HomeIcon sx={{ mr: 1 }} />
                <ListItemText primary="Inicio" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/inventario/categorias"
                selected={isActive("/inventario/categorias")}
              >
                <img
                  src={tag}
                  alt="Categorías"
                  width={24}
                  height={24}
                  style={{ marginRight: 8 }}
                />
                <ListItemText primary="Categorías" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/inventario/proveedores"
                selected={isActive("/inventario/proveedores")}
              >
                <img
                  src={iconoProveedor}
                  alt="Proveedores"
                  width={24}
                  height={24}
                  style={{ marginRight: 8 }}
                />
                <ListItemText primary="Proveedores" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleMenuClick}>
                <img
                  src={cajaPng}
                  alt="Productos"
                  width={24}
                  height={24}
                  style={{ marginRight: 8 }}
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
                    selected={isActive("/inventario/listado")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Listado de Productos" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/inventario/agregar"
                    selected={isActive("/inventario/agregar")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Registrar Producto" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/inventario/registrados"
                    selected={isActive("/inventario/registrados")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Productos Registrados" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/inventario/stock-bajo"
                    selected={isActive("/inventario/stock-bajo")}
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
                  style={{ marginRight: 8 }}
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
                    selected={isActive("/inventario/lotes")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Listar Lotes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/inventario/lotes/registrarLote"
                    selected={isActive("/inventario/lotes/registrarLote")}
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
                selected={isActive("/inventario/movimientos")}
              >
                <img
                  src={arrow}
                  alt="Movimientos"
                  width={24}
                  height={24}
                  style={{ marginRight: 5 }}
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
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pr: 1,
          pb: 3,
          pl: 0,
          ml: 3, // para separar del drawer que tiene margen
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default InventarioLayout;