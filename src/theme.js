import { createTheme } from '@mui/material/styles';
import { blue, purple } from '@mui/material/colors'; // Importa los colores base

const defaultTheme = createTheme({
  palette: {
    // Colores Primarios por defecto (Material Design Blue)
    primary: {
      main: blue[700], // #1976D2
      light: blue[400], // #5D99DA
      dark: blue[900],  // #0D47A1
      contrastText: '#fff',
    },
    // Colores Secundarios por defecto (Material Design Purple)
    secondary: {
      main: purple[500], // #9C27B0
      light: purple[300], // #BA68C8
      dark: purple[700],  // #7B1FA2
      contrastText: '#fff',
    },
    // ... otros colores como error, warning, info, success, etc. también tienen sus valores por defecto
  },
  // ... otras configuraciones del tema por defecto (tipografía, espaciado, etc.)
});

// Puedes acceder a estos valores:
// console.log(defaultTheme.palette.primary.main);   // #1976D2
// console.log(defaultTheme.palette.secondary.main); // #9C27B0

export default defaultTheme;