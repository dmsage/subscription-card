import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  AccountBox,
  CreditCard,
  CalendarToday,
} from '@mui/icons-material';
import { Subscription, LoadingState } from '../types';
import { mockApi } from '../api/mockApi';

const PlanManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading({ isLoading: true });
        const response = await mockApi.getUserSubscriptions();

        if (response.success) {
          setSubscriptions(response.data);
          setLoading({ isLoading: false });
        } else {
          setLoading({
            isLoading: false,
            error: response.message || 'Failed to fetch subscriptions',
          });
        }
      } catch (error) {
        setLoading({
          isLoading: false,
          error: 'An error occurred while fetching subscriptions',
        });
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCancelClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedSubscription) return;

    try {
      setCancellingId(selectedSubscription.id);
      const response = await mockApi.cancelSubscription(
        selectedSubscription.id
      );

      if (response.success) {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === selectedSubscription.id
              ? {
                  ...sub,
                  status: 'cancelled',
                  endDate: new Date().toISOString(),
                }
              : sub
          )
        );
        setShowCancelDialog(false);
        setSelectedSubscription(null);
      } else {
        alert(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      alert('An error occurred while cancelling subscription');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelDialogClose = () => {
    setShowCancelDialog(false);
    setSelectedSubscription(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      case 'pending':
        return <Warning />;
      default:
        return undefined;
    }
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

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'active'
  );
  const inactiveSubscriptions = subscriptions.filter(
    (sub) => sub.status !== 'active'
  );

  return (
    <Container>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Manage Subscriptions
        </Typography>
        <Typography variant='h6' color='text.secondary' paragraph>
          View and manage your active subscriptions
        </Typography>
      </Box>

      {subscriptions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <AccountBox sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant='h5' gutterBottom>
            No Subscriptions Found
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            You don't have any active subscriptions yet.
          </Typography>
          <Button
            variant='contained'
            onClick={() => navigate('/plans')}
            size='large'
          >
            Browse Plans
          </Button>
        </Paper>
      ) : (
        <>
          {/* Active Subscriptions */}
          {activeSubscriptions.length > 0 && (
            <>
              <Typography variant='h4' gutterBottom sx={{ mb: 3 }}>
                Active Subscriptions
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                  mb: 4,
                }}
              >
                {activeSubscriptions.map((subscription) => (
                  <Card
                    key={subscription.id}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant='h6' component='h3'>
                          {subscription.plan.name}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(subscription.status)}
                          label={
                            subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)
                          }
                          color={getStatusColor(subscription.status) as any}
                          size='small'
                        />
                      </Box>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        paragraph
                      >
                        {subscription.plan.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant='h5'
                          component='span'
                          color='primary'
                        >
                          ${subscription.plan.monthlyPrice}
                        </Typography>
                        <Typography
                          variant='body2'
                          component='span'
                          color='text.secondary'
                        >
                          /month
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 16,
                            mr: 1,
                            color: 'text.secondary',
                          }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          Started: {formatDate(subscription.startDate)}
                        </Typography>
                      </Box>

                      <Typography variant='subtitle2' sx={{ mt: 2, mb: 1 }}>
                        Features:
                      </Typography>
                      <List dense>
                        {subscription.plan.features
                          .slice(0, 3)
                          .map((feature, index) => (
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
                        {subscription.plan.features.length > 3 && (
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={`+${
                                subscription.plan.features.length - 3
                              } more features`}
                              primaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={() => handleCancelClick(subscription)}
                        disabled={cancellingId === subscription.id}
                        startIcon={
                          cancellingId === subscription.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Cancel />
                          )
                        }
                        fullWidth
                      >
                        {cancellingId === subscription.id
                          ? 'Cancelling...'
                          : 'Cancel Subscription'}
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </>
          )}

          {/* Inactive Subscriptions */}
          {inactiveSubscriptions.length > 0 && (
            <>
              <Typography variant='h4' gutterBottom sx={{ mb: 3, mt: 4 }}>
                Subscription History
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {inactiveSubscriptions.map((subscription) => (
                  <Card
                    key={subscription.id}
                    sx={{ height: '100%', opacity: 0.7 }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant='h6' component='h3'>
                          {subscription.plan.name}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(subscription.status)}
                          label={
                            subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)
                          }
                          color={getStatusColor(subscription.status) as any}
                          size='small'
                        />
                      </Box>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        paragraph
                      >
                        {subscription.plan.description}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 16,
                            mr: 1,
                            color: 'text.secondary',
                          }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(subscription.startDate)} -{' '}
                          {subscription.endDate
                            ? formatDate(subscription.endDate)
                            : 'Present'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant='contained'
              onClick={() => navigate('/plans')}
              size='large'
              startIcon={<CreditCard />}
            >
              Browse More Plans
            </Button>
          </Box>
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} maxWidth='sm' fullWidth>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography variant='body1' paragraph>
            Are you sure you want to cancel your{' '}
            <strong>{selectedSubscription?.plan.name}</strong> subscription?
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Your subscription will remain active until the end of your current
            billing period. You will lose access to all premium features after
            cancellation.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} variant='outlined'>
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant='contained'
            color='error'
            disabled={!!cancellingId}
            startIcon={cancellingId ? <CircularProgress size={16} /> : null}
          >
            {cancellingId ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlanManagementPage;
