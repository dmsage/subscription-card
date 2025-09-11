import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
  Container,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';
import { Plan, LoadingState } from '../types';
import { mockApi } from '../api/mockApi';

const ComparePlansPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading({ isLoading: true });
        const response = await mockApi.getPlans();

        if (response.success) {
          setPlans(response.data);
          setLoading({ isLoading: false });
        } else {
          setLoading({
            isLoading: false,
            error: response.message || 'Failed to fetch plans',
          });
        }
      } catch (error) {
        setLoading({
          isLoading: false,
          error: 'An error occurred while fetching plans',
        });
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    navigate(`/checkout/${planId}`);
  };

  // Get all unique features across all plans
  const getAllFeatures = () => {
    const allFeatures = new Set<string>();
    plans.forEach((plan) => {
      plan.features.forEach((feature) => allFeatures.add(feature));
    });
    return Array.from(allFeatures);
  };

  const hasFeature = (plan: Plan, feature: string) => {
    return plan.features.includes(feature);
  };

  if (loading.isLoading) {
    return (
      <Container>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='400px'
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (loading.error) {
    return (
      <Container>
        <Alert severity='error' sx={{ mt: 2 }}>
          {loading.error}
        </Alert>
      </Container>
    );
  }

  const allFeatures = getAllFeatures();

  return (
    <Container>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Compare Plans
        </Typography>
        <Typography variant='h6' color='text.secondary' paragraph>
          See what's included in each subscription plan
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Features
              </TableCell>
              {plans.map((plan) => (
                <TableCell
                  key={plan.id}
                  align='center'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    minWidth: 200,
                    position: 'relative',
                  }}
                >
                  <Box>
                    {plan.name}
                    {plan.popular && (
                      <Chip
                        label='Popular'
                        color='primary'
                        size='small'
                        sx={{ ml: 1, mb: 1 }}
                      />
                    )}
                    <Typography variant='h6' color='primary' sx={{ mt: 1 }}>
                      ${plan.monthlyPrice}/mo
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allFeatures.map((feature) => (
              <TableRow key={feature}>
                <TableCell sx={{ fontWeight: 500 }}>{feature}</TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.id}-${feature}`} align='center'>
                    {hasFeature(plan, feature) ? (
                      <CheckCircle color='primary' />
                    ) : (
                      <Close color='disabled' />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', pt: 3 }}>
                Subscribe
              </TableCell>
              {plans.map((plan) => (
                <TableCell
                  key={`${plan.id}-subscribe`}
                  align='center'
                  sx={{ pt: 3 }}
                >
                  <Button
                    variant='contained'
                    onClick={() => handleSubscribe(plan.id)}
                    size='large'
                    fullWidth
                  >
                    Choose {plan.name}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile-friendly cards view */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Typography variant='h5' gutterBottom sx={{ mt: 4, mb: 3 }}>
          Plan Details
        </Typography>
        {plans.map((plan) => (
          <Paper key={plan.id} sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>{plan.name}</Typography>
              {plan.popular && (
                <Chip label='Popular' color='primary' size='small' />
              )}
            </Box>
            <Typography variant='h6' color='primary' gutterBottom>
              ${plan.monthlyPrice}/month
            </Typography>
            <Typography variant='body2' color='text.secondary' paragraph>
              {plan.description}
            </Typography>
            <Typography variant='subtitle2' gutterBottom>
              Features:
            </Typography>
            <List dense>
              {plan.features.map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle color='primary' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant='contained'
              onClick={() => handleSubscribe(plan.id)}
              fullWidth
              sx={{ mt: 2 }}
            >
              Subscribe to {plan.name}
            </Button>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ComparePlansPage;

