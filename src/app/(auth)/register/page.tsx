'use client';

import Link from "next/link";
import { Building2, Eye, EyeOff, Hotel, User, MapPin, Phone, Mail, Lock, Globe, CreditCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { countries, currencyOptions } from "@/resources/auth";
import { useHttp } from "@/hooks/useHttp";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { HotelRegistrationFormData, HotelRegistrationFormErrors } from "@/types/auth";
import { toast } from "sonner";



export default function RegisterPage() {
  const router = useRouter();
  const { isLoading, sendHttpRequest: registerHotelReq } = useHttp();
  const [formData, setFormData] = useState<HotelRegistrationFormData>({
    firstName: '',
    lastName: '',
    hotelName: '',
    email: '',
    country: '',
    countryCode: '+1',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    currency: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<HotelRegistrationFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createNewAccountSucRes = (res: any) => {
    console.log("create new account response callback hook:", res);
    toast.success('Registration successful! Please check your email to verify your account.');
    // Redirect to email verification page
    router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
  };


  const validateForm = (): boolean => {
    const newErrors: HotelRegistrationFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }


    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.countryCode) {
      newErrors.countryCode = 'Country code is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerHotel = (formData: HotelRegistrationFormData) => {
    registerHotelReq({
      successRes: createNewAccountSucRes,
      requestConfig: {
        url: "/auth/register",
        method: "POST",
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          hotelName: formData.hotelName,
          email: formData.email,
          country: formData.country,
          phone: `${formData.countryCode}${formData.phone}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          currency: formData.currency,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms
        },
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof HotelRegistrationFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (validateForm()) {
      console.log('Form validation passed, sending request...');
      registerHotel(formData);
    } else {
      // Get all error messages
      const errorMessages = Object.values(errors).filter(error => error);
      if (errorMessages.length > 0) {
        if (errorMessages.length === 1) {
          toast.error(`Validation Error: ${errorMessages[0]}`);
        } else {
          toast.error(`Please fix ${errorMessages.length} validation errors`);
          // Show detailed errors in console for debugging
          console.log('Validation errors:', errorMessages);
        }
      } else {
        toast.error('Please fill in all required fields');
      }
      console.log('Form validation failed:', errors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white">
              HotelGo
            </h1>
            <p className="mt-2 text-xl text-blue-100">
              Register Your Hotel
            </p>
            <p className="mt-2 text-sm text-blue-200">
              Join thousands of hotels already using our platform
            </p>
          </div>

          {/* Main Registration Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Your Hotel Account
              </h2>
              <p className="text-blue-100">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.firstName ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-300">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.lastName ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Hotel Information Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <Building2 className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Hotel Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="hotel-name"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Hotel Name
                    </label>
                    <input
                      id="hotel-name"
                      name="hotelName"
                      type="text"
                      value={formData.hotelName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.hotelName ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      placeholder="Enter your hotel name"
                    />
                    {errors.hotelName && (
                      <p className="mt-1 text-sm text-red-300">{errors.hotelName}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Contact Information Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.email ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-300">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="flex rounded-lg overflow-hidden">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className={`w-24 flex-shrink-0 px-3 py-3 bg-white/10 border ${
                          errors.countryCode ? 'border-red-400' : 'border-white/20'
                        } text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.phoneCode} className="bg-slate-800 text-white">
                            {country.flag} {country.phoneCode}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`flex-1 px-4 py-3 bg-white/10 border ${
                          errors.phone ? 'border-red-400' : 'border-white/20'
                        } border-l-0 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.countryCode && (
                      <p className="mt-1 text-sm text-red-300">{errors.countryCode}</p>
                    )}
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-300">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Location Information Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Location Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.country ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                    >
                      <option value="" className="bg-slate-800 text-white">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name} className="bg-slate-800 text-white">
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-300">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.address ? 'border-red-400' : 'border-white/20'
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                      placeholder="Enter your hotel address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-300">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-blue-100 mb-2"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.city ? 'border-red-400' : 'border-white/20'
                        } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-300">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-blue-100 mb-2"
                      >
                        State/Province
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.state ? 'border-red-400' : 'border-white/20'
                        } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Enter state/province"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-300">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-blue-100 mb-2"
                      >
                        Postal Code
                      </label>
                      <input
                        id="postal-code"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.postalCode ? 'border-red-400' : 'border-white/20'
                        } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Enter postal code"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-300">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Business Settings Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Business Settings</h3>
                </div>
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-blue-100 mb-2"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.currency ? 'border-red-400' : 'border-white/20'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                  >
                    <option value="" className="bg-slate-800 text-white">Select your currency</option>
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value} className="bg-slate-800 text-white">
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  {errors.currency && (
                    <p className="mt-1 text-sm text-red-300">{errors.currency}</p>
                  )}
                </div>
              </div>
              {/* Security Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                          errors.password ? 'border-red-400' : 'border-white/20'
                        } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-300">{errors.password}</p>
                    )}
                    <p className="mt-2 text-xs text-blue-200">
                      Password must be at least 6 characters with uppercase, lowercase, and number
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-blue-100 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                          errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                        } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={`h-5 w-5 text-yellow-300 focus:ring-yellow-300 border-white/20 rounded mt-1 bg-white/10 ${
                      errors.agreeToTerms ? 'border-red-400' : ''
                    }`}
                  />
                  <div className="ml-3">
                    <label
                      htmlFor="agree-terms"
                      className="text-sm text-blue-100"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-300">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner title="Creating Account..." />
                      {/* <span className="ml-2">Creating Account...</span> */}
                    </>
                  ) : (
                    <>
                      <Hotel className="h-5 w-5 mr-2" />
                      Create Hotel Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
