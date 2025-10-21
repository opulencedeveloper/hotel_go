export interface HotelRegistrationFormData {
  firstName: string;
  lastName: string;
  hotelName: string;
  totalRooms: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  currency: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface HotelRegistrationFormErrors {
  firstName?: string;
  lastName?: string;
  hotelName?: string;
  totalRooms?: string;
  email?: string;
  country?: string;
  countryCode?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  currency?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

export interface CurrencyOption {
  value: string;
  label: string;
}

export interface EmailVerificationData {
  email: string;
  token: string;
}

export interface ResendVerificationData {
  email: string;
}