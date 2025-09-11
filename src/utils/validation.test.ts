import {
  validateName,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateAddress,
  validateZipCode,
  validateState,
  validateEmail,
  validatePhone,
  formatExpiryDate,
} from './validation';

describe('Validation Utils', () => {
  describe('validateName', () => {
    it('should validate valid names', () => {
      expect(validateName('John Doe')).toBe('');
      expect(validateName("O'Connor")).toBe('');
      expect(validateName('Jean-Pierre')).toBe('');
    });

    it('should reject empty names', () => {
      expect(validateName('')).toBe('Name is required');
      expect(validateName('   ')).toBe('Name is required');
    });

    it('should reject names that are too short', () => {
      expect(validateName('J')).toBe('Name must be at least 2 characters');
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(validateName(longName)).toBe(
        'Name must be less than 50 characters'
      );
    });

    it('should reject names with invalid characters', () => {
      expect(validateName('John123')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
      expect(validateName('John@Doe')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
    });
  });

  describe('validateCardNumber', () => {
    it('should validate valid card numbers', () => {
      expect(validateCardNumber('1234567890123456')).toBe('');
      expect(validateCardNumber('1234 5678 9012 3456')).toBe('');
    });

    it('should reject empty card numbers', () => {
      expect(validateCardNumber('')).toBe('Card number is required');
    });

    it('should reject non-numeric card numbers', () => {
      expect(validateCardNumber('abcd1234')).toBe(
        'Card number can only contain numbers'
      );
    });

    it('should reject card numbers with invalid length', () => {
      expect(validateCardNumber('123456789012')).toBe(
        'Card number must be between 13-19 digits'
      );
      expect(validateCardNumber('12345678901234567890')).toBe(
        'Card number must be between 13-19 digits'
      );
    });
  });

  describe('validateExpiryDate', () => {
    it('should validate valid future dates in MM/YY format', () => {
      const futureYear = (new Date().getFullYear() + 1) % 100;
      expect(
        validateExpiryDate(`12/${futureYear.toString().padStart(2, '0')}`)
      ).toBe('');
    });

    it('should validate valid future dates in MMYY format', () => {
      const futureYear = (new Date().getFullYear() + 1) % 100;
      expect(
        validateExpiryDate(`12${futureYear.toString().padStart(2, '0')}`)
      ).toBe('');
    });

    it('should reject empty dates', () => {
      expect(validateExpiryDate('')).toBe('Valid until date is required');
    });

    it('should reject invalid formats', () => {
      expect(validateExpiryDate('123')).toBe('Format must be MMYY or MM/YY');
      expect(validateExpiryDate('12345')).toBe('Format must be MMYY or MM/YY');
    });

    it('should reject invalid months', () => {
      expect(validateExpiryDate('1325')).toBe('Month must be between 01-12');
      expect(validateExpiryDate('0025')).toBe('Month must be between 01-12');
    });

    it('should reject past dates', () => {
      expect(validateExpiryDate('0120')).toBe('Date cannot be in the past');
      expect(validateExpiryDate('01/20')).toBe('Date cannot be in the past');
    });
  });

  describe('formatExpiryDate', () => {
    it('should format 4 digits with slash', () => {
      expect(formatExpiryDate('0329')).toBe('03/29');
      expect(formatExpiryDate('1225')).toBe('12/25');
    });

    it('should preserve partial input', () => {
      expect(formatExpiryDate('0')).toBe('0');
      expect(formatExpiryDate('03')).toBe('03');
    });

    it('should handle mixed input with non-digits', () => {
      expect(formatExpiryDate('03/29')).toBe('03/29');
      expect(formatExpiryDate('03-29')).toBe('03/29');
      expect(formatExpiryDate('03abc29')).toBe('03/29');
    });

    it('should limit to 4 digits', () => {
      expect(formatExpiryDate('032912')).toBe('03/29');
    });
  });

  describe('validateCVV', () => {
    it('should validate valid CVV codes', () => {
      expect(validateCVV('123')).toBe('');
      expect(validateCVV('1234')).toBe('');
    });

    it('should reject empty CVV', () => {
      expect(validateCVV('')).toBe('Security code is required');
    });

    it('should reject non-numeric CVV', () => {
      expect(validateCVV('abc')).toBe('Security code can only contain numbers');
    });

    it('should reject CVV with invalid length', () => {
      expect(validateCVV('12')).toBe('Security code must be 3-4 digits');
      expect(validateCVV('12345')).toBe('Security code must be 3-4 digits');
    });
  });

  describe('validateAddress', () => {
    it('should validate valid addresses', () => {
      expect(validateAddress('123 Main St', 'Street')).toBe('');
    });

    it('should reject empty addresses', () => {
      expect(validateAddress('', 'Street')).toBe('Street is required');
    });

    it('should reject addresses that are too short', () => {
      expect(validateAddress('A', 'Street')).toBe(
        'Street must be at least 2 characters'
      );
    });

    it('should reject addresses that are too long', () => {
      const longAddress = 'a'.repeat(101);
      expect(validateAddress(longAddress, 'Street')).toBe(
        'Street must be less than 100 characters'
      );
    });
  });

  describe('validateZipCode', () => {
    it('should validate valid ZIP codes', () => {
      expect(validateZipCode('12345')).toBe('');
      expect(validateZipCode('12345-6789')).toBe('');
    });

    it('should reject empty ZIP codes', () => {
      expect(validateZipCode('')).toBe('ZIP code is required');
    });

    it('should reject invalid ZIP code formats', () => {
      expect(validateZipCode('1234')).toBe(
        'ZIP code must be in format 12345 or 12345-6789'
      );
      expect(validateZipCode('abcde')).toBe(
        'ZIP code must be in format 12345 or 12345-6789'
      );
    });
  });

  describe('validateState', () => {
    it('should validate valid states', () => {
      expect(validateState('CA')).toBe('');
      expect(validateState('California')).toBe('');
    });

    it('should reject empty states', () => {
      expect(validateState('')).toBe('State is required');
    });

    it('should reject states that are too short', () => {
      expect(validateState('C')).toBe('State must be at least 2 characters');
    });

    it('should reject states that are too long', () => {
      const longState = 'a'.repeat(21);
      expect(validateState(longState)).toBe(
        'State must be less than 20 characters'
      );
    });
  });

  describe('validateEmail', () => {
    it('should validate valid emails', () => {
      expect(validateEmail('test@example.com')).toBe('');
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe('');
    });

    it('should reject empty emails', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(
        'Please enter a valid email address'
      );
      expect(validateEmail('@domain.com')).toBe(
        'Please enter a valid email address'
      );
    });
  });

  describe('validatePhone', () => {
    it('should validate valid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe('');
      expect(validatePhone('(123) 456-7890')).toBe('');
    });

    it('should reject empty phone numbers', () => {
      expect(validatePhone('')).toBe('Phone number is required');
    });

    it('should reject phone numbers with wrong length', () => {
      expect(validatePhone('123456789')).toBe('Phone number must be 10 digits');
      expect(validatePhone('12345678901')).toBe(
        'Phone number must be 10 digits'
      );
    });
  });
});
