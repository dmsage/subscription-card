import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Pages
import PlanListPage from './pages/PlanListPage';
import ComparePlansPage from './pages/ComparePlansPage';
import CheckoutPage from './pages/CheckoutPage';
import PlanManagementPage from './pages/PlanManagementPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant='h6'
          component={Link}
          to='/plans'
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              opacity: 0.8,
              cursor: 'pointer',
            },
          }}
        >
          Subscription Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color='inherit'
            component={Link}
            to='/plans'
            variant={location.pathname === '/plans' ? 'outlined' : 'text'}
          >
            Plans
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/compare'
            variant={location.pathname === '/compare' ? 'outlined' : 'text'}
          >
            Compare
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/manage'
            variant={location.pathname === '/manage' ? 'outlined' : 'text'}
          >
            Manage
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth='lg'>
          <Routes>
            <Route path='/' element={<Navigate to='/plans' replace />} />
            <Route path='/plans' element={<PlanListPage />} />
            <Route path='/compare' element={<ComparePlansPage />} />
            <Route path='/checkout/:planId' element={<CheckoutPage />} />
            <Route path='/manage' element={<PlanManagementPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
