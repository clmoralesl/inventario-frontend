import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axiosInstance from "./axiosInstance";

function GestionProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [proveedorActual, setProveedorActual] = useState({
        id: "",
        rutProveedor: "",
        dvProveedor: "",
        nombreProveedor: "",
        telefonoProveedor: "",
        emailProveedor: "",
        direccionProveedor: "",
    });

    const fetchProveedores = () => {
        axiosInstance
            .get("/proveedor")
            .then((res) => setProveedores(res.data))
            .catch((err) => console.error("Error al cargar proveedores:", err));
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const handleOpenDialog = (proveedor = null) => {
        if (proveedor) {
            setModoEdicion(true);
            setProveedorActual(proveedor);
        } else {
            setModoEdicion(false);
            setProveedorActual({
                id: "",
                rutProveedor: "",
                dvProveedor: "",
                nombreProveedor: "",
                telefonoProveedor: "",
                emailProveedor: "",
                direccionProveedor: "",
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorActual((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const method = modoEdicion ? axiosInstance.put : axiosInstance.post;
        const url = modoEdicion ? `/proveedor/${proveedorActual.id}` : "/proveedor";

        method(url, proveedorActual)
            .then(() => {
                fetchProveedores();
                handleCloseDialog();
            })
            .catch((err) =>
                alert("Error al guardar: " + err.response?.data || err.message)
            );
    };

    const handleDelete = (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;
        axiosInstance
            .delete(`/proveedor/${id}`)
            .then(() => fetchProveedores())
            .catch((err) =>
                alert("Error al eliminar: " + err.response?.data || err.message)
            );
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Proveedores
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
            >
                Agregar Proveedor
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>RUT</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proveedores.map((prov) => (
                            <TableRow key={prov.id}>
                                <TableCell>{prov.rutProveedor}-{prov.dvProveedor}</TableCell>
                                <TableCell>{prov.nombreProveedor}</TableCell>
                                <TableCell>{prov.telefonoProveedor}</TableCell>
                                <TableCell>{prov.emailProveedor}</TableCell>
                                <TableCell>{prov.direccionProveedor}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(prov)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(prov.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{modoEdicion ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        label="RUT"
                        name="rutProveedor"
                        value={proveedorActual.rutProveedor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="DV"
                        name="dvProveedor"
                        value={proveedorActual.dvProveedor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Nombre"
                        name="nombreProveedor"
                        value={proveedorActual.nombreProveedor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Teléfono"
                        name="telefonoProveedor"
                        value={proveedorActual.telefonoProveedor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email"
                        name="emailProveedor"
                        value={proveedorActual.emailProveedor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Dirección"
                        name="direccionProveedor"
                        value={proveedorActual.direccionProveedor}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {modoEdicion ? "Guardar cambios" : "Agregar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GestionProveedores;