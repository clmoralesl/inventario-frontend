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

    const [erroresCampos, setErroresCampos] = useState({});

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

    const [openSuccessAdd, setOpenSuccessAdd] = useState(false);
    const [openSuccessEdit, setOpenSuccessEdit] = useState(false);

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
        setErroresCampos({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedorActual((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const errores = {};

        if (!proveedorActual.rutProveedor) errores.rutProveedor = "Este campo es obligatorio";
        if (!proveedorActual.dvProveedor) errores.dvProveedor = "Este campo es obligatorio";
        if (!proveedorActual.nombreProveedor) errores.nombreProveedor = "Este campo es obligatorio";
        if (!proveedorActual.telefonoProveedor) errores.telefonoProveedor = "Este campo es obligatorio";
        if (!proveedorActual.emailProveedor) errores.emailProveedor = "Este campo es obligatorio";
        if (!proveedorActual.direccionProveedor) errores.direccionProveedor = "Este campo es obligatorio";

        if (Object.keys(errores).length > 0) {
            setErroresCampos(errores);
            return;
        }

        setErroresCampos({});

        const method = modoEdicion ? axiosInstance.put : axiosInstance.post;
        const url = modoEdicion ? `/proveedor/${proveedorActual.id}` : "/proveedor";

        method(url, proveedorActual)
            .then(() => {
                fetchProveedores();
                handleCloseDialog();
                modoEdicion ? setOpenSuccessEdit(true) : setOpenSuccessAdd(true);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleOpenConfirmDelete = (proveedor) => {
        setProveedorAEliminar(proveedor);
        setOpenConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        axiosInstance
            .delete(`/proveedor/${proveedorAEliminar.id}`)
            .then(() => {
                fetchProveedores();
                setOpenConfirmDelete(false);
                setProveedorAEliminar(null);
            })
            .catch((err) => {
                console.error(err);
                setOpenConfirmDelete(false);
                setProveedorAEliminar(null);
            });
    };

    const handleCancelDelete = () => {
        setOpenConfirmDelete(false);
        setProveedorAEliminar(null);
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
                                <TableCell>
                                    {prov.rutProveedor}-{prov.dvProveedor}
                                </TableCell>
                                <TableCell>{prov.nombreProveedor}</TableCell>
                                <TableCell>{prov.telefonoProveedor}</TableCell>
                                <TableCell>{prov.emailProveedor}</TableCell>
                                <TableCell>{prov.direccionProveedor}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpenDialog(prov)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleOpenConfirmDelete(prov)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {modoEdicion ? "Editar Proveedor" : "Agregar Proveedor"}
                </DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        label="RUT"
                        name="rutProveedor"
                        value={proveedorActual.rutProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.rutProveedor}
                        helperText={erroresCampos.rutProveedor}
                    />
                    <TextField
                        label="DV"
                        name="dvProveedor"
                        value={proveedorActual.dvProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.dvProveedor}
                        helperText={erroresCampos.dvProveedor}
                    />
                    <TextField
                        label="Nombre"
                        name="nombreProveedor"
                        value={proveedorActual.nombreProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.nombreProveedor}
                        helperText={erroresCampos.nombreProveedor}
                    />
                    <TextField
                        label="Teléfono"
                        name="telefonoProveedor"
                        value={proveedorActual.telefonoProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.telefonoProveedor}
                        helperText={erroresCampos.telefonoProveedor}
                    />
                    <TextField
                        label="Email"
                        name="emailProveedor"
                        value={proveedorActual.emailProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.emailProveedor}
                        helperText={erroresCampos.emailProveedor}
                    />
                    <TextField
                        label="Dirección"
                        name="direccionProveedor"
                        value={proveedorActual.direccionProveedor}
                        onChange={handleChange}
                        error={!!erroresCampos.direccionProveedor}
                        helperText={erroresCampos.direccionProveedor}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {modoEdicion ? "Guardar cambios" : "Agregar"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmDelete} onClose={handleCancelDelete}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar el proveedor {" "}
                        <strong>{proveedorAEliminar?.nombreProveedor}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openSuccessAdd}
                onClose={() => setOpenSuccessAdd(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Proveedor agregado</DialogTitle>
                <DialogContent>
                    <Typography color="success.main">
                        El proveedor fue registrado exitosamente.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenSuccessAdd(false)}
                        variant="contained"
                        color="primary"
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openSuccessEdit}
                onClose={() => setOpenSuccessEdit(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Proveedor actualizado</DialogTitle>
                <DialogContent>
                    <Typography color="success.main">
                        El proveedor fue actualizado exitosamente.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenSuccessEdit(false)}
                        variant="contained"
                        color="primary"
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GestionProveedores;