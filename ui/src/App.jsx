import Routes from './routes/Routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthProvider from './provider/AuthProvider.jsx';
import React from 'react';
import { CssBaseline } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: "#674188"
    },
    secondary: {
      main: "#EAE8DC"
    }
  },

});

const App = () => {

  return (
    <ThemeProvider theme={theme}>
       <AuthProvider>
        <React.Fragment>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes/>
          </LocalizationProvider>
        </React.Fragment>
      </AuthProvider>
  </ThemeProvider>
  )
}

export default App
