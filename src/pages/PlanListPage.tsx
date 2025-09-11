import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { Compare } from '@mui/icons-material';
import { Plan, LoadingState } from '../types';
import { mockApi } from '../api/mockApi';
import PlanCard from '../components/PlanCard';
import FeaturesModal from '../components/FeaturesModal';

const PlanListPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleViewFeatures = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleSubscribe = (planId: string) => {
    navigate(`/checkout/${planId}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
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

  return (
    <Container>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant='h6' color='text.secondary' paragraph>
          Select the perfect subscription plan for your needs
        </Typography>
        <Button
          variant='outlined'
          startIcon={<Compare />}
          onClick={() => navigate('/compare')}
          size='large'
          sx={{ mt: 2 }}
        >
          Compare All Plans
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
          justifyItems: 'center',
        }}
      >
        {plans.map((plan) => (
          <Box key={plan.id} sx={{ width: '100%', maxWidth: 400 }}>
            <PlanCard
              plan={plan}
              onViewFeatures={handleViewFeatures}
              onSubscribe={handleSubscribe}
              isLoading={loading.isLoading}
            />
          </Box>
        ))}
      </Box>

      <FeaturesModal
        open={modalOpen}
        plan={selectedPlan}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
      />
    </Container>
  );
};

export default PlanListPage;
