import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green for herbal feel
      dark: '#388e3c'
    },
    secondary: {
      main: '#ff9800', // Orange for accents
    },
    background: {
      default: '#f4f6f8', // Light gray background for cleanliness
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#2e2e2e', // Dark gray text for readability
      secondary: '#757575', // Medium gray for secondary text
    },
    success: {
      main: '#66bb6a', // Lighter green for success messages
    },
    warning: {
      main: '#ffa726', // Lighter orange for warnings
    },
    error: {
      main: '#f44336', // Red for errors
    },
    info: {
      main: '#29b6f6', // Blue for informational messages
    },
  },
  typography: {
    fontFamily: 'Gill Sans MT ',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
        },
        containedPrimary: {
          backgroundColor: '#d2ebcd',
          color: '#Black',
          '&:hover': {
            backgroundColor: '#acc6aa',
            color: 'black',
          },
        },
        containedSecondary: {
          backgroundColor: '#ff9800',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#f57c00',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#4caf50', // Primary color for AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#2e2e2e',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '8px', // Rounded corners
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
          backgroundColor: '#ffffff',
          borderBottom: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f4f6f8',
        },
      },
    },
  },
});

export default theme;
