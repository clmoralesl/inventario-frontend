import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import axiosInstance from "./axiosInstance";

function ListadoLotes() {
  const [lotes, setLotes] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  useEffect(() => {
    axiosInstance
      .get("/lote/listar")
      .then((response) => {
        console.log("Lotes recibidos:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setLotes(data);
      })
      .catch((error) => console.error("Error al obtener lotes:", error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedLotes = lotes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Listado de Lotes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Lote</TableCell>
              <TableCell>Código de Barra</TableCell>
              <TableCell>Numero de Lote</TableCell>
              <TableCell>Stock Lote</TableCell>
              <TableCell>Fecha de Vencimiento</TableCell>
              <TableCell>ID Orden de Compra</TableCell>
              <TableCell>Nombre Proveedor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLotes.map((lote, index) => (
              <TableRow key={lote.idLote}>
                <TableCell>{lote.idLote}</TableCell>
                <TableCell>{lote.producto?.codigoBarra}</TableCell>
                <TableCell>{lote.numeroLote}</TableCell>
                <TableCell>{lote.stockLote}</TableCell>
                <TableCell>{lote.fechaVencimiento}</TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{lote.proveedor?.nombreProveedor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={lotes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </>
  );
}

export default ListadoLotes;
