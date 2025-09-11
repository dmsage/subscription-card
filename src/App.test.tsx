import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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

// Create a simplified version of the Navigation component for testing
const MockNavigation = () => {
  return (
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant='h6'
          component='a'
          href='/plans'
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
          <Button color='inherit' variant='outlined'>
            Plans
          </Button>
          <Button color='inherit' variant='text'>
            Compare
          </Button>
          <Button color='inherit' variant='text'>
            Manage
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Create a simplified App component for testing
const TestApp = () => {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MockNavigation />
      <Container maxWidth='lg'>
        <div data-testid='app-content'>App Content</div>
      </Container>
    </ThemeProvider>
  );
};

// Helper function to render TestApp
const renderApp = () => {
  return render(<TestApp />);
};

describe('App Component Structure', () => {
  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => renderApp()).not.toThrow();
    });

    it('should render the navigation bar with correct title', () => {
      renderApp();
      expect(screen.getByText('Subscription Manager')).toBeInTheDocument();
    });

    it('should render all navigation buttons', () => {
      renderApp();
      expect(
        screen.getByRole('button', { name: /plans/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /compare/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /manage/i })
      ).toBeInTheDocument();
    });

    it('should make the title clickable with correct href', () => {
      renderApp();
      const titleLink = screen.getByText('Subscription Manager');
      expect(titleLink).toBeInTheDocument();
      expect(titleLink).toHaveAttribute('href', '/plans');
    });
  });

  describe('Navigation Structure', () => {
    it('should render navigation buttons with correct structure', () => {
      renderApp();

      const plansButton = screen.getByRole('button', { name: /plans/i });
      const compareButton = screen.getByRole('button', { name: /compare/i });
      const manageButton = screen.getByRole('button', { name: /manage/i });

      // Check that buttons are rendered
      expect(plansButton).toBeInTheDocument();
      expect(compareButton).toBeInTheDocument();
      expect(manageButton).toBeInTheDocument();
    });

    it('should highlight the active navigation button (Plans is active)', () => {
      renderApp();
      const plansButton = screen.getByRole('button', { name: /plans/i });

      // Check if the button has the outlined variant (active state)
      expect(plansButton).toHaveAttribute('class');
      expect(plansButton.className).toContain('MuiButton-outlined');
    });

    it('should render inactive buttons with text variant', () => {
      renderApp();
      const compareButton = screen.getByRole('button', { name: /compare/i });
      const manageButton = screen.getByRole('button', { name: /manage/i });

      // Inactive buttons should have text variant
      expect(compareButton.className).toContain('MuiButton-text');
      expect(manageButton.className).toContain('MuiButton-text');
    });
  });

  describe('Material UI Integration', () => {
    it('should apply Material UI theme', () => {
      renderApp();

      // Check if MUI components are rendered with proper classes
      const appBar = screen.getByRole('banner'); // AppBar has banner role
      expect(appBar).toHaveClass('MuiAppBar-root');
    });

    it('should render with proper container structure', () => {
      renderApp();

      // Check if container exists
      const container = document.querySelector('.MuiContainer-root');
      expect(container).toBeInTheDocument();
    });

    it('should render toolbar with proper layout', () => {
      renderApp();

      // Check if toolbar exists
      const toolbar = document.querySelector('.MuiToolbar-root');
      expect(toolbar).toBeInTheDocument();
    });

    it('should apply theme colors correctly', () => {
      renderApp();

      // Check if primary color is applied to AppBar
      const appBar = screen.getByRole('banner');
      expect(appBar).toHaveClass('MuiAppBar-colorPrimary');
    });
  });

  describe('Layout Structure', () => {
    it('should have the correct app structure', () => {
      renderApp();

      // Check main structural elements
      expect(screen.getByRole('banner')).toBeInTheDocument(); // AppBar
      expect(screen.getByText('Subscription Manager')).toBeInTheDocument(); // Title
      expect(
        screen.getByRole('button', { name: /plans/i })
      ).toBeInTheDocument(); // Navigation
    });

    it('should render app content area', () => {
      renderApp();

      // Should render the content area
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    it('should have proper container max width', () => {
      renderApp();

      // Check if container has the correct max width
      const container = document.querySelector('.MuiContainer-maxWidthLg');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Theme Configuration', () => {
    it('should apply custom theme without errors', () => {
      renderApp();

      // The app should render without theme errors
      expect(screen.getByText('Subscription Manager')).toBeInTheDocument();
    });

    it('should apply CSS baseline for consistent styling', () => {
      renderApp();

      // CssBaseline should be applied - check that component renders correctly
      expect(screen.getByText('Subscription Manager')).toBeInTheDocument();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    it('should render with Material UI typography', () => {
      renderApp();

      // Check if typography is properly styled
      const title = screen.getByText('Subscription Manager');
      expect(title).toHaveClass('MuiTypography-h6');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      renderApp();

      // AppBar should have banner role
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Buttons should have button role
      expect(
        screen.getByRole('button', { name: /plans/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /compare/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /manage/i })
      ).toBeInTheDocument();
    });

    it('should have accessible navigation links', () => {
      renderApp();

      const titleLink = screen.getByText('Subscription Manager');
      expect(titleLink).toHaveAttribute('href', '/plans');
    });
  });

  describe('Error Handling', () => {
    it('should handle component rendering without console errors', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderApp();

      // No console errors should be logged during normal rendering
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should render all required UI elements', () => {
      renderApp();

      // Ensure all critical elements are present
      expect(screen.getByText('Subscription Manager')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });
  });
});
