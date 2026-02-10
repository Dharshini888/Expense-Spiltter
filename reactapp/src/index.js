
// src/index.js

import React from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App';

import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';



const container = document.getElementById('root');

const root = createRoot(container);



root.render(

      <React.StrictMode>

            <App />

              </React.StrictMode>

);



reportWebVitals();

// import React from 'react';

// import { createRoot } from 'react-dom/client';

// import App from './App';

// import CssBaseline from '@mui/material/CssBaseline';

// import { ThemeProvider, createTheme } from '@mui/material/styles';



// const theme = createTheme({

//     palette: {

//         mode: 'light',

//         primary: { main: '#1976d2' },

//         secondary: { main: '#9c27b0' }

//     },

//     components: {

//         MuiPaper: { defaultProps: { elevation: 2 } }

//     }

// });



// const root = createRoot(document.getElementById('root'));

// root.render(

//     <ThemeProvider theme={theme}>

//         <CssBaseline />

//         <App />

//     </ThemeProvider>
// );
