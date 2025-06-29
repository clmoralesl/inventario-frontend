import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Stack,
    FormControl,
    Select,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import axiosInstance from "./axiosInstance";

function RegistrarLote() {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [formData, setFormData] = useState({
        codigoBarra: "",
        numeroLote: "",
        stockLote: "",
        fechaVencimiento: "",
        idProveedor: "",
    });
    const [errors, setErrors] = useState({});
    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        axiosInstance
            .get("/producto")
            .then((res) => setProductos(res.data))
            .catch((err) => console.error("Error al obtener productos:", err));

        axiosInstance
            .get("/proveedor")
            .then((res) => setProveedores(res.data))
            .catch((err) => console.error("Error al obtener proveedores:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación frontend
        const newErrors = {};
        if (!formData.codigoBarra) newErrors.codigoBarra = "Debe seleccionar un producto";
        if (!formData.numeroLote) newErrors.numeroLote = "El número de lote es obligatorio";
        if (!formData.stockLote) newErrors.stockLote = "El stock es obligatorio";
        if (!formData.fechaVencimiento)
            newErrors.fechaVencimiento = "La fecha de vencimiento es obligatoria";
        if (!formData.idProveedor) newErrors.idProveedor = "Debe seleccionar un proveedor";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // Limpia errores si todo está OK

        const payload = {
            numeroLote: formData.numeroLote,
            stockLote: formData.stockLote,
            fechaVencimiento: formData.fechaVencimiento,
            producto: {
                codigoBarra: formData.codigoBarra,
            },
            proveedor: {
                id: parseInt(formData.idProveedor),
            },
        };

        axiosInstance
            .post("/lote/registrar", payload)
            .then(() => {
                setOpenSuccess(true);
                setFormData({
                    codigoBarra: "",
                    numeroLote: "",
                    stockLote: "",
                    fechaVencimiento: "",
                    idProveedor: "",
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    setErrors(error.response.data);
                } else {
                    console.error("Error al registrar lote:", error);
                }
            });
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
    };

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Registrar Lote
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    position: "relative", // Para posicionar el botón abajo a la derecha
                    paddingBottom: "72px", // Espacio para que el botón no tape inputs
                }}
            >
                <Stack spacing={2}>
                    {/* Código de Barra */}
                    <FormControl fullWidth size="small" error={!!errors.codigoBarra}>
                        <InputLabel>Código de Barra</InputLabel>
                        <Select
                            name="codigoBarra"
                            value={formData.codigoBarra}
                            label="Código de Barra"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Seleccione un producto</em>
                            </MenuItem>
                            {productos.map((prod) => (
                                <MenuItem key={prod.codigoBarra} value={prod.codigoBarra}>
                                    {prod.codigoBarra} - {prod.nombreProducto}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.codigoBarra && (
                            <Typography color="error" variant="caption">
                                {errors.codigoBarra}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Número de Lote */}
                    <TextField
                        fullWidth
                        name="numeroLote"
                        label="Número de Lote"
                        value={formData.numeroLote}
                        onChange={handleChange}
                        error={!!errors.numeroLote}
                        helperText={errors.numeroLote}
                        size="small"
                    />

                    {/* Stock Lote */}
                    <TextField
                        fullWidth
                        name="stockLote"
                        label="Stock del Lote"
                        type="number"
                        value={formData.stockLote}
                        onChange={handleChange}
                        error={!!errors.stockLote}
                        helperText={errors.stockLote}
                        size="small"
                    />

                    {/* Fecha de Vencimiento */}
                    <TextField
                        fullWidth
                        name="fechaVencimiento"
                        label="Fecha de Vencimiento (dd-mm-yyyy)"
                        placeholder="Ej: 25-12-2025"
                        type="text"
                        value={formData.fechaVencimiento}
                        onChange={handleChange}
                        error={!!errors.fechaVencimiento}
                        helperText={
                            errors.fechaVencimiento || "Ingrese la fecha en formato dd-mm-yyyy"
                        }
                        size="small"
                    />

                    {/* Proveedor */}
                    <FormControl fullWidth size="small" error={!!errors.idProveedor}>
                        <InputLabel>Proveedor</InputLabel>
                        <Select
                            name="idProveedor"
                            value={formData.idProveedor}
                            label="Proveedor"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Seleccione un proveedor</em>
                            </MenuItem>
                            {proveedores.length === 0 ? (
                                <MenuItem disabled>No hay proveedores disponibles</MenuItem>
                            ) : (
                                proveedores.map((prov, index) => (
                                    <MenuItem key={prov.id || index} value={String(prov.id)}>
                                        {prov.nombreProveedor || `Proveedor ${index + 1}`}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        {errors.idProveedor && (
                            <Typography color="error" variant="caption">
                                {errors.idProveedor}
                            </Typography>
                        )}
                    </FormControl>
                </Stack>

                {/* Botón en la esquina inferior derecha */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <Button type="submit" variant="contained" color="primary">
                        Registrar Lote
                    </Button>
                </Box>
            </Box>

            {/* Diálogo de éxito */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess} maxWidth="xs" fullWidth>
                <DialogTitle>Lote Registrado</DialogTitle>
                <DialogContent>
                    <Typography color="success.main">El lote fue registrado exitosamente.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default RegistrarLote;