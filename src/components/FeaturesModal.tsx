import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';
import { Plan } from '../types';

interface FeaturesModalProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({
  open,
  plan,
  onClose,
  onSubscribe,
}) => {
  if (!plan) return null;

  const handleSubscribe = () => {
    onSubscribe(plan.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant='h5' component='div'>
              {plan.name}
            </Typography>
            <Typography variant='h6' color='primary' sx={{ mt: 1 }}>
              ${plan.monthlyPrice}/month
            </Typography>
          </Box>
          <IconButton onClick={onClose} size='small'>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant='body1' color='text.secondary' paragraph>
          {plan.description}
        </Typography>

        <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
          All Features Included:
        </Typography>

        <List>
          {plan.features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color='primary' fontSize='small' />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant='outlined'>
          Close
        </Button>
        <Button
          onClick={handleSubscribe}
          variant='contained'
          size='large'
          sx={{ ml: 2 }}
        >
          Subscribe to {plan.name}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeaturesModal;
