import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeProvider } from '@mui/material';
import { Provider } from "react-redux";
import store, { persistor } from "./store.js";
import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    greenish: "#4CAF50",
    blackish: "#333333",
  },
});
const styledTheme = {
  colors: {
    greenish: theme.palette.greenish,
    blackish: theme.palette.blackish,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <MUIThemeProvider theme={theme}>
      <StyledThemeProvider theme={styledTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <ToastContainer position="top-center" autoClose={3000} />
          </PersistGate>
        </Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
