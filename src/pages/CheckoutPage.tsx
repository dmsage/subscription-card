import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { CheckCircle, CreditCard, Lock } from '@mui/icons-material';
import { Plan, CheckoutData, LoadingState } from '../types';
import { mockApi } from '../api/mockApi';
import {
  validateName,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateAddress,
  validateZipCode,
  validateState,
  formatExpiryDate,
} from '../utils/validation';

const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [formData, setFormData] = useState<CheckoutData>({
    planId: planId || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) {
        setLoading({ isLoading: false, error: 'No plan selected' });
        return;
      }

      try {
        setLoading({ isLoading: true });
        const response = await mockApi.getPlanById(planId);

        if (response.success && response.data) {
          setPlan(response.data);
          setLoading({ isLoading: false });
        } else {
          setLoading({
            isLoading: false,
            error: response.message || 'Plan not found',
          });
        }
      } catch (error) {
        setLoading({
          isLoading: false,
          error: 'An error occurred while fetching plan details',
        });
      }
    };

    fetchPlan();
  }, [planId]);

  const handleInputChange = (field: string, value: string) => {
    // Format expiry date input automatically
    if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    }

    // Update form data
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Real-time validation
    let error = '';
    switch (field) {
      case 'cardholderName':
        error = validateName(value);
        break;
      case 'cardNumber':
        error = validateCardNumber(value);
        break;
      case 'expiryDate':
        error = validateExpiryDate(value);
        break;
      case 'cvv':
        error = validateCVV(value);
        break;
      case 'billingAddress.street':
        error = validateAddress(value, 'Street address');
        setValidationErrors((prev) => ({ ...prev, street: error }));
        return;
      case 'billingAddress.city':
        error = validateAddress(value, 'City');
        setValidationErrors((prev) => ({ ...prev, city: error }));
        return;
      case 'billingAddress.state':
        error = validateState(value);
        setValidationErrors((prev) => ({ ...prev, state: error }));
        return;
      case 'billingAddress.zipCode':
        error = validateZipCode(value);
        setValidationErrors((prev) => ({ ...prev, zipCode: error }));
        return;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plan) return;

    // Validate all fields before submission
    const errors = {
      cardholderName: validateName(formData.cardholderName),
      cardNumber: validateCardNumber(formData.cardNumber),
      expiryDate: validateExpiryDate(formData.expiryDate),
      cvv: validateCVV(formData.cvv),
      street: validateAddress(formData.billingAddress.street, 'Street address'),
      city: validateAddress(formData.billingAddress.city, 'City'),
      state: validateState(formData.billingAddress.state),
      zipCode: validateZipCode(formData.billingAddress.zipCode),
    };

    setValidationErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (hasErrors) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await mockApi.subscribeToPlan(formData);

      if (response.success) {
        setShowSuccess(true);
      } else {
        alert(response.message || 'Subscription failed');
      }
    } catch (error) {
      alert('An error occurred during subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/manage');
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

  if (loading.error || !plan) {
    return (
      <Container>
        <Alert severity='error' sx={{ mt: 2 }}>
          {loading.error || 'Plan not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => navigate('/plans')} variant='contained'>
            Back to Plans
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography
        variant='h3'
        component='h1'
        gutterBottom
        sx={{ mb: 4, textAlign: 'center' }}
      >
        Checkout
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* Plan Summary */}
        <Box sx={{ flex: { md: '0 0 33%' } }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Order Summary
              </Typography>
              <Typography variant='h5' color='primary' gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant='body2' color='text.secondary' paragraph>
                {plan.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant='subtitle2' gutterBottom>
                Features included:
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

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h6'>Total:</Typography>
                <Typography variant='h5' color='primary'>
                  ${plan.monthlyPrice}/month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Checkout Form */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CreditCard sx={{ mr: 1 }} />
              <Typography variant='h6'>Payment Information</Typography>
              <Lock sx={{ ml: 'auto', color: 'success.main' }} />
            </Box>

            <Alert severity='info' sx={{ mb: 3 }}>
              This is a demo checkout form. No real payment processing occurs.
            </Alert>

            <form onSubmit={handleSubmit} autoComplete='off'>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label='Full Name'
                  value={formData.cardholderName}
                  onChange={(e) =>
                    handleInputChange('cardholderName', e.target.value)
                  }
                  placeholder='Full Name'
                  error={!!validationErrors.cardholderName}
                  helperText={validationErrors.cardholderName}
                  required
                />

                <TextField
                  fullWidth
                  label='Card. Number'
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange('cardNumber', e.target.value)
                  }
                  placeholder='1234 5678 9012 3456'
                  error={!!validationErrors.cardNumber}
                  helperText={validationErrors.cardNumber}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label='Valid Until (MM/YY)'
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange('expiryDate', e.target.value)
                    }
                    placeholder='MM/YY'
                    error={!!validationErrors.expiryDate}
                    helperText={validationErrors.expiryDate}
                    inputProps={{ maxLength: 5 }}
                    required
                  />
                  <TextField
                    fullWidth
                    label='Security Code (CVV)'
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder='123'
                    error={!!validationErrors.cvv}
                    helperText={validationErrors.cvv}
                    required
                  />
                </Box>

                <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>
                  Billing Address
                </Typography>

                <TextField
                  fullWidth
                  label='Street Address'
                  value={formData.billingAddress.street}
                  onChange={(e) =>
                    handleInputChange('billingAddress.street', e.target.value)
                  }
                  error={!!validationErrors.street}
                  helperText={validationErrors.street}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label='City'
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      handleInputChange('billingAddress.city', e.target.value)
                    }
                    error={!!validationErrors.city}
                    helperText={validationErrors.city}
                    required
                  />
                  <TextField
                    label='State'
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      handleInputChange('billingAddress.state', e.target.value)
                    }
                    error={!!validationErrors.state}
                    helperText={validationErrors.state}
                    required
                    sx={{ width: '120px' }}
                  />
                  <TextField
                    label='ZIP Code'
                    value={formData.billingAddress.zipCode}
                    onChange={(e) =>
                      handleInputChange(
                        'billingAddress.zipCode',
                        e.target.value
                      )
                    }
                    error={!!validationErrors.zipCode}
                    helperText={validationErrors.zipCode}
                    required
                    sx={{ width: '120px' }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: 3,
                  }}
                >
                  <Button
                    variant='outlined'
                    onClick={() => navigate('/plans')}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    disabled={submitting}
                    startIcon={
                      submitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {submitting
                      ? 'Processing...'
                      : `Subscribe for $${plan.monthlyPrice}/month`}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog open={showSuccess} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant='h5'>Subscription Successful!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant='body1' paragraph>
            Welcome to {plan.name}! Your subscription is now active.
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            You can manage your subscription anytime from your account
            dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleSuccessClose} variant='contained' size='large'>
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckoutPage;
