// Form validation utility functions

export const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 50) return 'Name must be less than 50 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim()))
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  return '';
};

export const validateCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!cleaned) return 'Card number is required';
  if (!/^\d+$/.test(cleaned)) return 'Card number can only contain numbers';
  if (cleaned.length < 13 || cleaned.length > 19)
    return 'Card number must be between 13-19 digits';
  return '';
};

export const validateExpiryDate = (expiryDate: string): string => {
  if (!expiryDate) return 'Valid until date is required';

  // Remove any non-digit characters for processing
  const cleaned = expiryDate.replace(/\D/g, '');

  // Check if we have at least 4 digits
  if (cleaned.length < 4) return 'Format must be MMYY or MM/YY';
  if (cleaned.length > 4) return 'Format must be MMYY or MM/YY';

  // Extract month and year from the 4 digits
  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.substring(2, 4), 10);

  if (month < 1 || month > 12) return 'Month must be between 01-12';

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Date cannot be in the past';
  }

  return '';
};

// Helper function to format expiry date input
export const formatExpiryDate = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');

  // Limit to 4 digits
  const limited = cleaned.substring(0, 4);

  // Add slash after 2 digits if we have more than 2
  if (limited.length >= 3) {
    return `${limited.substring(0, 2)}/${limited.substring(2)}`;
  }

  return limited;
};

export const validateCVV = (cvv: string): string => {
  if (!cvv) return 'Security code is required';
  if (!/^\d+$/.test(cvv)) return 'Security code can only contain numbers';
  if (cvv.length < 3 || cvv.length > 4)
    return 'Security code must be 3-4 digits';
  return '';
};

export const validateAddress = (address: string, fieldName: string): string => {
  if (!address.trim()) return `${fieldName} is required`;
  if (address.trim().length < 2)
    return `${fieldName} must be at least 2 characters`;
  if (address.trim().length > 100)
    return `${fieldName} must be less than 100 characters`;
  return '';
};

export const validateZipCode = (zipCode: string): string => {
  if (!zipCode.trim()) return 'ZIP code is required';
  if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim()))
    return 'ZIP code must be in format 12345 or 12345-6789';
  return '';
};

export const validateState = (state: string): string => {
  if (!state.trim()) return 'State is required';
  if (state.trim().length < 2) return 'State must be at least 2 characters';
  if (state.trim().length > 20) return 'State must be less than 20 characters';
  return '';
};

// Email validation (for future use)
export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()))
    return 'Please enter a valid email address';
  return '';
};

// Phone validation (for future use)
export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return 'Phone number must be 10 digits';
  return '';
};

// Generic validation helper
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
};

// Length validation helper
export const validateLength = (
  value: string,
  fieldName: string,
  min: number,
  max: number
): string => {
  const trimmed = value.trim();
  if (trimmed.length < min)
    return `${fieldName} must be at least ${min} characters`;
  if (trimmed.length > max)
    return `${fieldName} must be less than ${max} characters`;
  return '';
};
