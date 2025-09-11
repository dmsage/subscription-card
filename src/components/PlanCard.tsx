import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  onViewFeatures: (plan: Plan) => void;
  onSubscribe: (planId: string) => void;
  isLoading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onViewFeatures,
  onSubscribe,
  isLoading = false,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant='h5' component='h2' gutterBottom>
          {plan.name}{' '}
          {plan.popular && (
            <Chip
              label='Most Popular'
              color='primary'
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
            />
          )}
        </Typography>

        <Typography variant='body2' color='text.secondary' paragraph>
          {plan.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant='h4' component='span' color='primary'>
            ${plan.monthlyPrice}
          </Typography>
          <Typography variant='body2' component='span' color='text.secondary'>
            /month
          </Typography>
        </Box>

        <Typography variant='subtitle2' gutterBottom>
          Key Features:
        </Typography>
        <List dense>
          {plan.features.slice(0, 3).map((feature, index) => (
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
          {plan.features.length > 3 && (
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText
                primary={`+${plan.features.length - 3} more features`}
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

      <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
        <Button
          variant='outlined'
          fullWidth
          onClick={() => onViewFeatures(plan)}
          disabled={isLoading}
        >
          View All Features
        </Button>
        <Button
          variant='contained'
          fullWidth
          onClick={() => onSubscribe(plan.id)}
          disabled={isLoading}
          size='large'
        >
          Subscribe Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlanCard;
