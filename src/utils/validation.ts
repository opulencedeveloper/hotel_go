// Validation utilities for forms and data

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: any, rules: ValidationRule, fieldName: string): string | null => {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${fieldName} is required`;
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters long`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be no more than ${rules.maxLength} characters long`;
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `${fieldName} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${fieldName} must be no more than ${rules.max}`;
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return `${fieldName} format is invalid`;
  }

  // Email validation
  if (rules.email && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
  }

  // Phone validation
  if (rules.phone && typeof value === 'string') {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return `${fieldName} must be a valid phone number`;
    }
  }

  // Date validation
  if (rules.date && typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = data[fieldName];
    const error = validateField(value, fieldRules, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  password: { 
    required: true, 
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  name: { required: true, minLength: 2, maxLength: 50 },
  text: { required: true, minLength: 1, maxLength: 255 },
  longText: { required: true, minLength: 1, maxLength: 1000 },
  number: { required: true, min: 0 },
  positiveNumber: { required: true, min: 1 },
  date: { required: true, date: true },
  futureDate: { 
    required: true, 
    date: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today ? 'Date must be in the future' : null;
    }
  },
  pastDate: { 
    required: true, 
    date: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today ? 'Date must be in the past' : null;
    }
  }
};

// Hotel-specific validation rules
export const hotelValidationRules = {
  guest: {
    firstName: commonRules.name,
    lastName: commonRules.name,
    email: commonRules.email,
    phone: commonRules.phone,
    nationality: commonRules.required,
    idNumber: { required: true, minLength: 5, maxLength: 20 }
  },
  reservation: {
    guestId: commonRules.required,
    roomId: commonRules.required,
    checkIn: commonRules.futureDate,
    checkOut: { 
      required: true, 
      date: true,
      custom: (value: string, formData: any) => {
        if (formData.checkIn && value <= formData.checkIn) {
          return 'Check-out date must be after check-in date';
        }
        return null;
      }
    },
    adults: commonRules.positiveNumber,
    children: { min: 0 },
    totalAmount: { min: 0 },
    paidAmount: { min: 0 }
  },
  room: {
    roomNumber: { required: true, minLength: 1, maxLength: 10 },
    floor: { required: true, min: 1, max: 100 },
    roomTypeId: commonRules.required,
    propertyId: commonRules.required,
    rate: { min: 0 }
  },
  staff: {
    firstName: commonRules.name,
    lastName: commonRules.name,
    email: commonRules.email,
    phone: commonRules.phone,
    role: commonRules.required,
    department: commonRules.required,
    salary: { min: 0 },
    hireDate: commonRules.pastDate
  }
};

// Form validation hook
import { useState, useEffect } from 'react';

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  rules: Record<keyof T, ValidationRule>
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (fieldName?: keyof T) => {
    if (fieldName) {
      // Validate single field
      const fieldRules = rules[fieldName];
      const value = data[fieldName];
      const error = validateField(value, fieldRules, fieldName as string);
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    } else {
      // Validate entire form
      const result = validateForm(data, rules);
      setErrors(result.errors);
      return result.isValid;
    }
  };

  const setFieldValue = (fieldName: keyof T, value: any) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName as string]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const setFieldTouched = (fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName: keyof T) => {
    setFieldTouched(fieldName);
    validate(fieldName);
  };

  const handleChange = (fieldName: keyof T, value: any) => {
    setFieldValue(fieldName, value);
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    data,
    errors,
    touched,
    isValid,
    validate,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    reset
  };
};

// Async validation utilities
export const validateEmailExists = async (email: string): Promise<boolean> => {
  // This would typically make an API call to check if email exists
  // For now, return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: assume email doesn't exist if it's not in a predefined list
      const existingEmails = ['admin@hotelgo.com', 'manager@hotelgo.com'];
      resolve(!existingEmails.includes(email));
    }, 1000);
  });
};

export const validateRoomAvailability = async (
  roomId: string, 
  checkIn: string, 
  checkOut: string
): Promise<boolean> => {
  // This would typically make an API call to check room availability
  // For now, return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: assume room is available
      resolve(true);
    }, 500);
  });
};

// Debounced validation
export const useDebouncedValidation = (
  value: any,
  validationFn: (value: any) => Promise<string | null>,
  delay: number = 500
) => {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(async () => {
      try {
        const validationError = await validationFn(value);
        setError(validationError);
      } catch (err) {
        setError('Validation failed');
      } finally {
        setIsValidating(false);
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      setIsValidating(false);
    };
  }, [value, validationFn, delay]);

  return { error, isValidating };
};
