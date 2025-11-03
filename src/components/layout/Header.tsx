"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import TimeDisplay from "./TimeDisplay";
import { mockProperties, mockDashboardStats } from "@/data/mockData";
import { getRoleDisplayName } from "@/lib/auth";
import { formatPrice } from "@/helper";
import FeatureGuard from "@/components/auth/FeatureGuard";
import {
  Home,
  Calendar,
  Bed,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  DollarSign,
  TrendingUp,
  Shield,
  Database,
  ChefHat,
  Wrench,
  FileText,
  Package,
  Building,
  Building2,
  ChevronDown,
  Wifi,
  Star,
  WifiOff,
  Clock,
  Globe,
  CreditCard,
  UserCheck,
  ClipboardList,
  Calculator,
  Heart,
  Truck,
  PieChart,
  Download,
  Lock,
  Archive,
  CheckCircle,
  Save,
  Layers,
  Tag,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { RootState } from "@/store";
import { StayType, UserRole } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { countries, currencyOptions } from "@/resources/auth";
import { toast } from "sonner";
import { useHttp } from "@/hooks/useHttp";
import {
  RoomSliceParams,
  RoomTypeSliceParams,
} from "@/types/room-management/room-management";
import { roomActions } from "@/store/redux/room-slice";
import { RoomStatus } from "@/types/room-management/enum";
import { PaymentMethod } from "@/lib/server/stay/enum";
import { paymentMethodList } from "@/resources";
import { stayActions } from "@/store/redux/stay-slice";
import { hotelActions } from "@/store/redux/hotel-slice";
import { analyticsActions } from "@/store/redux/analytics-slice";
import { dashboardSummaryActions } from "@/store/redux/dashboard-summary-slice";
import { facilityActions } from "@/store/redux/facility-slice";
import { hotelServicesActions } from "@/store/redux/hotel-services-slice";
import { houseKeepingActions } from "@/store/redux/house-keeping-slice";
import { inventoryActions } from "@/store/redux/inventory-slice";
import { menuActions } from "@/store/redux/menu-slice";
import { orderActions } from "@/store/redux/order-slice";
import { scheduledServicesActions } from "@/store/redux/scheduled-services-slice";
import { staffActions } from "@/store/redux/staff-slice";

interface LayoutProps {
  children: React.ReactNode;
}

// Icon mapping for navigation items
const iconMap: Record<string, any> = {
  Home,
  Calendar,
  Bed,
  UserCheck,
  Star,
  Building,
  CreditCard,
  ShoppingCart,
  ChefHat,
  Wrench,
  Users,
  TrendingUp,
  Calculator,
  Heart,
  Truck,
  PieChart,
  Download,
  Lock,
  Archive,
  Settings,
};

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [propertySelectorOpen, setPropertySelectorOpen] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [stayType, setStayType] = useState<StayType>(StayType.RESERVED);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  // Refs for date and time inputs
  const dateInputRef = useRef<HTMLInputElement>(null);
  const checkOutDateRef = useRef<HTMLInputElement>(null);
  // Reservation date refs
  const reservationCheckInRef = useRef<HTMLInputElement>(null);
  const reservationCheckOutRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.user);
  const hotel = useSelector((state: RootState) => state.hotel);
  const room = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch();
  // HTTP hook for fetching rooms
  const {
    isLoading: isLoadingRooms,
    sendHttpRequest: fetchRoomsReq,
    error: fetchRoomsError,
  } = useHttp();

  // HTTP hook for reservations
  const {
    isLoading: isCreatingReservation,
    sendHttpRequest: createReservationRequest,
    error: reservationError,
  } = useHttp();

  // HTTP hook for adding property
  const {
    isLoading: isAddingProperty,
    sendHttpRequest: addPropertyRequest,
    error: addPropertyError,
  } = useHttp();

  // HTTP hook for switching hotel
  const {
    isLoading: isSwitchingHotel,
    sendHttpRequest: switchHotelRequest,
    error: switchHotelError,
  } = useHttp();

  // Helper function to validate capacity
  const validateCapacity = (adults: number, children: number): string => {
    if (!reservationForm.roomType) return "";

    const selectedRoom = hotelRooms?.find(
      (room) => room.roomNumber === reservationForm.roomType
    );

    if (selectedRoom?.roomTypeId?.capacity) {
      const totalGuests = adults + children;
      if (totalGuests > selectedRoom.roomTypeId.capacity) {
        return `Total guests (${totalGuests}) exceeds room capacity (${selectedRoom.roomTypeId.capacity})`;
      }
    }
    return "";
  };

  // Validation functions
  const validateField = (
    fieldName: string,
    value: string,
    currentAdults?: number,
    currentChildren?: number
  ): string => {
    switch (fieldName) {
      case "roomNumber":
        if (!value) return "Room number is required";
        return "";
      case "guestName":
        if (!value) return "Guest name is required";
        if (value.length < 2) return "Guest name must be at least 2 characters";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^[0-9\s\-()]{7,15}$/.test(value))
          return "Please enter a valid phone number";
        return "";
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";
      case "address":
        if (!value) return "Address is required";
        if (value.length < 5) return "Address must be at least 5 characters";
        return "";
      case "paymentMethod":
        if (!value) return "Payment method is required";
        return "";
      case "checkInDate":
        if (!value) return "Check-in date is required";
        return "";
      case "checkOutDate": {
        if (!value) return "Check-out date is required";
        if (checkInForm.checkInDate) {
          const outDate = new Date(value);
          const inDate = new Date(checkInForm.checkInDate);
          outDate.setHours(0, 0, 0, 0);
          inDate.setHours(0, 0, 0, 0);
          if (outDate <= inDate)
            return "Check-out date must be after check-in date";
        }
        return "";
      }
      case "roomType":
        if (!value) return "Room selection is required";
        return "";
      case "checkIn": {
        if (!value) return "Check-in date is required";
        const selected = new Date(value);
        const today = new Date();
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // Check if check-in date is in the past
        if (selected < today) return "Check-in date cannot be in the past";

        // For WALK_IN: check-in date must be today
        if (stayType === StayType.WALK_IN) {
          if (selected.getTime() !== today.getTime()) {
            return "Walk-in check-in date must be today. Please use Bookings or Reservations for future dates.";
          }
        } else {
          // For RESERVED and BOOKED: check-in date cannot be today
          if (selected.getTime() === today.getTime()) {
            return "Check-in date cannot be today. Please use Walk-in instead for same-day check-in.";
          }
        }

        return "";
      }
      case "checkOut": {
        if (!value) return "Check-out date is required";
        if (reservationForm.checkIn) {
          const outDate = new Date(value);
          const inDate = new Date(reservationForm.checkIn);
          outDate.setHours(0, 0, 0, 0);
          inDate.setHours(0, 0, 0, 0);
          if (outDate <= inDate)
            return "Check-out date must be after check-in date";
        }
        return "";
      }
      case "adults": {
        // Only validate if value is provided and not empty
        if (value === "" || value === null || value === undefined) return "";

        const adultsNum = parseInt(value);
        if (isNaN(adultsNum) || adultsNum < 1)
          return "At least 1 adult is required";
        if (adultsNum > 10) return "Maximum 10 adults allowed";

        // Check capacity constraint using current values
        const adultsCount = adultsNum;
        const childrenCount =
          currentChildren !== undefined
            ? currentChildren
            : reservationForm.children || 0;
        const capacityError = validateCapacity(adultsCount, childrenCount);
        if (capacityError) return capacityError;

        return "";
      }
      case "children": {
        if (value && parseInt(value) < 0)
          return "Children count cannot be negative";
        if (value && parseInt(value) > 10) return "Maximum 10 children allowed";

        // Check capacity constraint using current values
        const adultsCount =
          currentAdults !== undefined
            ? currentAdults
            : reservationForm.adults || 1;
        const childrenCount = parseInt(value) || 0;
        const capacityError = validateCapacity(adultsCount, childrenCount);
        if (capacityError) return capacityError;

        return "";
      }
      case "paymentDate":
        if (!value) return "Payment date is required for reservations";
        const paymentDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        paymentDate.setHours(0, 0, 0, 0);

        // Check if payment date is in the past
        if (paymentDate < today) {
          return "Payment date cannot be in the past.";
        }

        // Check if payment date is today
        if (paymentDate.getTime() === today.getTime()) {
          return "Payment date cannot be today. Please book a room instead for immediate payment.";
        }

        // Check if payment date is before check-in date
        if (reservationForm.checkIn) {
          const checkInDate = new Date(reservationForm.checkIn);
          checkInDate.setHours(0, 0, 0, 0);
          if (paymentDate >= checkInDate) {
            return "Payment date must be before the check-in date.";
          }
        }

        return "";
      case "adults":
        if (!value || parseInt(value) < 1)
          return "At least 1 adult is required";
        if (parseInt(value) > 10) return "Maximum 10 adults allowed";
        return "";
      default:
        return "";
    }
  };

  // Reservation form validation
  const validateReservationForm = (): boolean => {
    const errors = {
      guestName: validateField("guestName", reservationForm.guestName),
      phone: validateField("phone", reservationForm.phone),
      email: validateField("email", reservationForm.email),
      address: validateField("address", reservationForm.address),
      roomType: validateField("roomType", reservationForm.roomType),
      checkIn: validateField("checkIn", reservationForm.checkIn),
      checkOut: validateField("checkOut", reservationForm.checkOut),
      adults: validateField("adults", reservationForm.adults.toString()),
      children: validateField("children", reservationForm.children.toString()),
      paymentDate:
        stayType === StayType.RESERVED
          ? validateField("paymentDate", reservationForm.paymentDate)
          : "",
      paymentMethod: validateField(
        "paymentMethod",
        reservationForm.paymentMethod
      ),
    };

    setReservationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const isAdmin = user?.userRole === UserRole.SuperAdmin;

  const [reservationForm, setReservationForm] = useState({
    guestName: "",
    email: "",
    countryCode: "+1",
    phone: "",
    address: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    roomType: "",
    specialRequests: "",
    paymentDate: "",
    paymentMethod: "",
  });

  const [checkInForm, setCheckInForm] = useState({
    roomNumber: "",
    guestName: "",
    countryCode: "+1",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "",
    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
  });

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    roomType: "",
    paymentMethod: "",
    specialRequests: "",
  });

  // Add Property form state
  const [propertyForm, setPropertyForm] = useState({
    hotelName: "",
    country: "",
    countryCode: "+1",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    currency: "",
    agreeToTerms: false,
  });

  // Property form validation errors
  const [propertyErrors, setPropertyErrors] = useState({
    hotelName: "",
    country: "",
    countryCode: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    currency: "",
    agreeToTerms: "",
  });

  // Reservation form validation errors
  const [reservationErrors, setReservationErrors] = useState({
    guestName: "",
    phone: "",
    email: "",
    address: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
    paymentDate: "",
    paymentMethod: "",
  });

  // Memoize expensive calculations to prevent infinite re-renders
  const selectedHotelId = useMemo(
    () => hotel.selectedHotelId,
    [hotel.selectedHotelId]
  );
  const selectedHotel = useMemo(
    () => hotel?.hotels?.find((h) => h._id === selectedHotelId),
    [hotel.hotels, selectedHotelId]
  );
  const selectedHotelName = useMemo(
    () => selectedHotel?.hotelName || "No hotel selected",
    [selectedHotel?.hotelName]
  );
  const currency = useMemo(
    () => selectedHotel?.currency || "USD",
    [selectedHotel?.currency]
  );

  // Memoize room calculations
  const { hotelRooms, totalRooms, occupiedRooms, occupancyPercentage } =
    useMemo(() => {
      const rooms = room.hotelRooms;
      const total = rooms.length;
      const occupied = rooms.filter((r) => r.roomStatus === "occupied").length;
      const percentage = total > 0 ? (occupied / total) * 100 : 0;

      return {
        hotelRooms: rooms,
        totalRooms: total,
        occupiedRooms: occupied,
        occupancyPercentage: percentage,
      };
    }, [room.hotelRooms]);

  // Function to fetch rooms - memoized to prevent recreation
  const handleFetchRooms = useMemo(
    () => () => {
      if (selectedHotelId) {
        fetchRoomsReq({
          requestConfig: {
            url: "/hotel/room-info",
            method: "GET",
          },
          successRes: (res) => {
            const resData = res?.data?.data;

            const fetchedRoomTypes = resData?.hotelRoomTypes;
            const fetchedRooms = resData?.hotelRooms;

            dispatch(roomActions.setRoomTypes(fetchedRoomTypes));
            dispatch(roomActions.setRooms(fetchedRooms));
          },
        });
      }
    },
    [selectedHotelId, fetchRoomsReq, dispatch]
  );

  // Form submission handlers
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReservationForm()) {
      return;
    }

    // Find the selected room
    const selectedRoom = hotelRooms?.find(
      (room) => room.roomNumber === reservationForm.roomType
    );
    if (!selectedRoom) {
      setReservationErrors({
        ...reservationErrors,
        roomType: "Selected room not found",
      });
      return;
    }

    // Prepare the request data
    const reservationData = {
      guestName: reservationForm.guestName,
      emailAddress: reservationForm.email || undefined,
      phoneNumber: `${reservationForm.countryCode}${reservationForm.phone}`,
      address: reservationForm.address,
      roomId: selectedRoom._id,
      checkInDate: reservationForm.checkIn,
      checkOutDate: reservationForm.checkOut,
      adults: reservationForm.adults,
      type: stayType,
      ...(stayType === StayType.RESERVED && {
        paymentDate: reservationForm.paymentDate,
      }),
      children: reservationForm.children,
      specialRequests: reservationForm.specialRequests || undefined,
      paymentMethod: reservationForm.paymentMethod,
    };

    // Make the HTTP request
    createReservationRequest({
      requestConfig: {
        url: "/hotel/create-stay",
        method: "POST",
        body: reservationData,
        successMessage: "Created successfully!",
      },
      successRes: (res) => {
        const stay = res?.data?.data?.stay;

        dispatch(stayActions.addStay(stay));

        // Only update room status to occupied if check-in is today
        // const today = new Date();
        // const checkInDate = new Date(reservationForm.checkIn);
        // const isCheckInToday = checkInDate.toDateString() === today.toDateString();

        if (stayType === StayType.WALK_IN) {
          dispatch(
            roomActions.updateRoomStatus({
              roomId: selectedRoom._id,
              status: RoomStatus.Occupied,
            })
          );
        }

        // if (stayType === StayType.WALK_IN) {
        //   dispatch(
        //     roomActions.updateRoomStatus({
        //       roomId: selectedRoom._id,
        //       status: RoomStatus.Occupied,
        //     })
        //   );
        // }

        // Clear all reservation form state
        setReservationForm({
          guestName: "",
          email: "",
          countryCode: "+1",
          phone: "",
          address: "",
          checkIn: "",
          checkOut: "",
          adults: 2,
          children: 0,
          roomType: "",
          specialRequests: "",
          paymentDate: "",
          paymentMethod: "",
        });
        // Clear all reservation errors
        setReservationErrors({
          guestName: "",
          phone: "",
          email: "",
          address: "",
          roomType: "",
          checkIn: "",
          checkOut: "",
          adults: "",
          children: "",
          paymentDate: "",
          paymentMethod: "",
        });
        // Reset stay type to default
        setStayType(StayType.RESERVED);
        // Close modal
        setShowReservationModal(false);
      },
    });
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear walk-in form state
    setWalkInForm({
      guestName: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
      children: 0,
      roomType: "",
      paymentMethod: "",
      specialRequests: "",
    });
    // Close modal
    setShowWalkInModal(false);
  };

  // Handler for switching hotels
  const handleSwitchHotel = (hotelId: string) => {
    // Close the property selector dropdown
    setPropertySelectorOpen(false);

    // Don't switch if already selected
    if (hotelId === selectedHotelId) {
      return;
    }


    // Make the HTTP request to switch hotel
    switchHotelRequest({
      requestConfig: {
        url: "/hotel/switch-hotel",
        method: "POST",
        params: {
          hotelId: hotelId,
        },
        successMessage: "Hotel switched successfully!",
      },
      successRes: (res) => {
        // Update Redux state to select the new hotel
        dispatch(hotelActions.selectHotel(hotelId));
        dispatch(analyticsActions.reset());
        dispatch(dashboardSummaryActions.resetDashboardData());
        dispatch(facilityActions.reset());
        dispatch(hotelServicesActions.reset());
       // dispatch(hotelActions.reset());
        dispatch(houseKeepingActions.reset());
        dispatch(inventoryActions.reset());
        dispatch(menuActions.reset());
        dispatch(orderActions.reset());
        dispatch(roomActions.reset());
        dispatch(scheduledServicesActions.reset());
        dispatch(staffActions.reset());
        dispatch(stayActions.reset());

        // Optionally refresh rooms for the new hotel
        // handleFetchRooms();
      },
    });
  };

  // Property form validation
  const validatePropertyField = (
    fieldName: string,
    value: string | boolean
  ): string => {
    switch (fieldName) {
      case "hotelName":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Hotel name is required";
        return "";
      case "country":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Country is required";
        return "";
      case "countryCode":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Country code is required";
        return "";
      case "phone":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Phone number is required";
        if (
          typeof value === "string" &&
          !/^\d{7,15}$/.test(value.replace(/\s/g, ""))
        ) {
          return "Please enter a valid phone number (7-15 digits)";
        }
        return "";
      case "address":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Address is required";
        return "";
      case "city":
        if (!value || (typeof value === "string" && !value.trim()))
          return "City is required";
        return "";
      case "state":
        if (!value || (typeof value === "string" && !value.trim()))
          return "State/Province is required";
        return "";
      case "postalCode":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Postal code is required";
        return "";
      case "currency":
        if (!value || (typeof value === "string" && !value.trim()))
          return "Currency is required";
        return "";
      case "agreeToTerms":
        if (!value) return "You must agree to the terms and conditions";
        return "";
      default:
        return "";
    }
  };

  const validatePropertyForm = (): boolean => {
    const errors = {
      hotelName: validatePropertyField("hotelName", propertyForm.hotelName),
      country: validatePropertyField("country", propertyForm.country),
      countryCode: validatePropertyField(
        "countryCode",
        propertyForm.countryCode
      ),
      phone: validatePropertyField("phone", propertyForm.phone),
      address: validatePropertyField("address", propertyForm.address),
      city: validatePropertyField("city", propertyForm.city),
      state: validatePropertyField("state", propertyForm.state),
      postalCode: validatePropertyField("postalCode", propertyForm.postalCode),
      currency: validatePropertyField("currency", propertyForm.currency),
      agreeToTerms: validatePropertyField(
        "agreeToTerms",
        propertyForm.agreeToTerms
      ),
    };

    setPropertyErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePropertyForm()) {
      const errorMessages = Object.values(propertyErrors).filter(
        (error) => error
      );
      if (errorMessages.length > 0) {
        toast.error(`Please fix ${errorMessages.length} validation error(s)`);
      }
      return;
    }

    // Prepare the request data - matching exact payload structure
    const propertyData = {
      hotelName: propertyForm.hotelName,
      country: propertyForm.country,
      state: propertyForm.state,
      city: propertyForm.city,
      phone: `${propertyForm.countryCode}${propertyForm.phone}`,
      address: propertyForm.address,
      currency: propertyForm.currency,
      agreeToTerms: propertyForm.agreeToTerms,
      postalCode: propertyForm.postalCode,
    };

    // Make the HTTP request using useHttp hook
    addPropertyRequest({
      requestConfig: {
        url: "/hotel/add-hotel",
        method: "POST",
        body: propertyData,
        successMessage: "Property added successfully!",
      },
      successRes: (res) => {
        const newHotel = res?.data?.data?.newHotel;

        if (newHotel) {
          dispatch(hotelActions.addHotel(newHotel));
          toast.success("Property added successfully!");
        } else {
          toast.success("Property added successfully!");
        }

        // Clear form
        setPropertyForm({
          hotelName: "",
          country: "",
          countryCode: "+1",
          phone: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          currency: "",
          agreeToTerms: false,
        });
        // Clear errors
        setPropertyErrors({
          hotelName: "",
          country: "",
          countryCode: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          currency: "",
          agreeToTerms: "",
        });
        // Close modal
        setShowAddPropertyModal(false);
        setPropertySelectorOpen(false);
      },
    });
  };

  // Mock data for property selector and context ribbon
  const currentProperty = mockProperties[0];
  const stats = mockDashboardStats;

  // Keyboard shortcuts for front-desk operations
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAdmin || !user) return; // Skip shortcuts for admin users or when not logged in

      // Only trigger shortcuts when not typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "F1":
          event.preventDefault();
          window.location.href = "/reservations?action=new";
          break;
        case "F2":
          event.preventDefault();
          window.location.href = "/front-desk?action=checkin";
          break;
        case "Escape":
          // Close any open modals/dropdowns
          setPropertySelectorOpen(false);
          setSidebarOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, user, setSidebarOpen]);

  console.log("HEADER");
  return (
    <header>
      {
        <div className="bg-primary-600 text-white py-2 px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-0">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">
                  {selectedHotelName}
                </span>
              </div>
              <TimeDisplay />
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>{selectedHotel!.currency}</span>
              </div>
              {/* <div className="hidden lg:flex items-center space-x-2">
                <Bed className="w-4 h-4" />
                <span>{stats.occupancy.today}% Occupancy</span>
              </div> */}
            </div>
            <div className="flex items-center space-x-2">
              {stats.online_status ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="hidden sm:inline">Online</span>
                  <span className="sm:hidden">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Offline Mode</span>
                  <span className="sm:hidden">Offline</span>
                </>
              )}
              {stats.pending_sync_items > 0 && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  {stats.pending_sync_items}
                </span>
              )}
            </div>
          </div>
        </div>
      }

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-secondary-200">
        {/* First row - Main navigation and title */}
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 lg:hidden flex-shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-4 lg:ml-0 min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-secondary-900 truncate">
                {isAdmin ? "Admin Dashboard" : "Hotel Management"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notifications */}
            {/* <button className="p-2 text-secondary-400 hover:text-secondary-600 relative flex-shrink-0">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                3
              </span>
            </button> */}

            {/* User profile */}
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user
                    ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
                    : "U"}
                </span>
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs text-secondary-500 truncate">
                  {user ? getRoleDisplayName(user.userRole!) : "Guest"}
                </p>
                {user && (
                  <p className="text-xs text-primary-600 font-medium truncate">
                    {/* DEPT PLACEHOLDER */}
                    {/* {user.department} */}
                  </p>
                )}
              </div>
              <button
                // onClick={logout}
                className="p-2 text-secondary-400 hover:text-secondary-600 flex-shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second row - Property selector, quick actions, and mobile search */}
        {true && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-12 px-4 py-2 sm:py-0 bg-secondary-50 border-t border-secondary-100 gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Property Selector */}
              <FeatureGuard permission="hotels.switch">
                <div className="relative min-w-0 flex-1 sm:flex-none">
                  <button
                    onClick={() => setPropertySelectorOpen(!propertySelectorOpen)}
                    disabled={isSwitchingHotel}
                    className={`flex items-center space-x-2 px-3 py-2 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 w-full sm:w-auto min-w-0 ${
                      isSwitchingHotel ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSwitchingHotel ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 flex-shrink-0"></div>
                    ) : (
                      <Building className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-secondary-700 truncate">
                      {selectedHotelName}
                    </span>
                    {isSwitchingHotel ? (
                      <span className="text-xs text-secondary-500 flex-shrink-0">
                        Switching...
                      </span>
                    ) : (
                      <ChevronDown className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                    )}
                  </button>

                  {propertySelectorOpen && (
                    <div className="absolute top-full left-0 mt-1 w-80 max-w-[calc(100vw-2rem)] bg-white border border-secondary-200 rounded-lg shadow-lg z-50">
                      <div className="p-3">
                        <div className="text-xs font-medium text-secondary-500 uppercase tracking-wide mb-3">
                          Switch Property
                        </div>
                        {hotel.hotels.map((property) => (
                          <button
                            key={property._id}
                            disabled={isSwitchingHotel}
                            onClick={() => handleSwitchHotel(property._id)}
                            className={`w-full text-left px-3 py-3 rounded-md border border-transparent transition-colors ${
                              property._id === selectedHotelId
                                ? "bg-primary-50 border-primary-200"
                                : "hover:bg-secondary-50 hover:border-secondary-200"
                            } ${
                              isSwitchingHotel
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-secondary-900 line-clamp-1">
                                  {property.hotelName}
                                  {property._id === selectedHotelId && (
                                    <span className="ml-2 text-xs text-primary-600">
                                      (Current)
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-secondary-500 line-clamp-1">
                                  {property.address}
                                </div>
                              </div>
                              {/* <div className="text-right flex-shrink-0 ml-2">
                                {isSwitchingHotel &&
                                property._id !== selectedHotelId ? (
                                  <div className="flex items-center justify-end">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-sm font-medium text-secondary-900">
                                      {occupancyPercentage}%
                                    </div>
                                    <div className="text-xs text-secondary-500">
                                      Occupancy
                                    </div>
                                  </>
                                )}
                              </div> */}
                            </div>
                          </button>
                        ))}
                        <FeatureGuard permission="hotels.add">
                          <div className="mt-3 pt-3 border-t border-secondary-200">
                            <button
                              onClick={() => {
                                setPropertySelectorOpen(false);
                                setShowAddPropertyModal(true);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                            >
                              + Add New Property
                            </button>
                          </div>
                        </FeatureGuard>
                      </div>
                    </div>
                  )}
                </div>
              </FeatureGuard>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Quick Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
                <FeatureGuard permission="stays.create_reservation">
                  <button
                    onClick={() => {
                      setStayType(StayType.RESERVED);
                      setShowReservationModal(true);
                      // Re-validate check-in date when stay type changes
                      if (reservationForm.checkIn) {
                        const checkInError = validateField(
                          "checkIn",
                          reservationForm.checkIn
                        );
                        setReservationErrors((prev) => ({
                          ...prev,
                          checkIn: checkInError,
                        }));
                      }
                    }}
                    className="px-2 sm:px-3 py-1 bg-primary-600 text-white text-xs sm:text-sm rounded-md hover:bg-primary-700 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    + Reservation
                  </button>
                </FeatureGuard>
                <FeatureGuard permission="stays.create_booking">
                  <button
                    onClick={() => {
                      setStayType(StayType.BOOKED);
                      setShowReservationModal(true);
                      // Re-validate check-in date when stay type changes
                      if (reservationForm.checkIn) {
                        const checkInError = validateField(
                          "checkIn",
                          reservationForm.checkIn
                        );
                        setReservationErrors((prev) => ({
                          ...prev,
                          checkIn: checkInError,
                        }));
                      }
                    }}
                    className="px-2 sm:px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded-md hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    + Book
                  </button>
                </FeatureGuard>
                <FeatureGuard permission="stays.create_walkin">
                  <button
                    onClick={() => {
                      setStayType(StayType.WALK_IN);
                      setShowReservationModal(true);
                      // Set check-in date to today for WALK_IN
                      const today = new Date().toISOString().split("T")[0];
                      setReservationForm((prev) => ({
                        ...prev,
                        checkIn: today,
                      }));
                      // Clear any existing check-in errors
                      setReservationErrors((prev) => ({
                        ...prev,
                        checkIn: "",
                      }));
                    }}
                    className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    + Walk-in
                  </button>
                </FeatureGuard>
              </div>

              {/* Keyboard Shortcuts Help */}
              <button
                className="p-2 text-secondary-400 hover:text-secondary-600 hidden lg:block flex-shrink-0"
                title="Keyboard Shortcuts: F1=New Reservation, F2=Check-in, Esc=Close"
              >
                <span className="text-xs font-mono">F1 F2</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showReservationModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0"
          style={{
            margin: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                {stayType === StayType.RESERVED
                  ? "New Reservation"
                  : stayType === StayType.BOOKED
                  ? "New Booking"
                  : "Walk-in"}
              </h2>
              <button
                onClick={() => {
                  // Clear all reservation form state
                  setReservationForm({
                    guestName: "",
                    email: "",
                    countryCode: "+1",
                    phone: "",
                    address: "",
                    checkIn: "",
                    checkOut: "",
                    adults: 2,
                    children: 0,
                    roomType: "",
                    specialRequests: "",
                    paymentDate: "",
                    paymentMethod: "",
                  });
                  // Clear all reservation errors
                  setReservationErrors({
                    guestName: "",
                    phone: "",
                    email: "",
                    address: "",
                    roomType: "",
                    checkIn: "",
                    checkOut: "",
                    adults: "",
                    children: "",
                    paymentDate: "",
                    paymentMethod: "",
                  });
                  // Reset stay type to default
                  setStayType(StayType.RESERVED);
                  // Close modal
                  setShowReservationModal(false);
                }}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    value={reservationForm.guestName}
                    onChange={(e) => {
                      setReservationForm({
                        ...reservationForm,
                        guestName: e.target.value,
                      });
                      const error = validateField("guestName", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        guestName: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validateField("guestName", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        guestName: error,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.guestName
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                    placeholder="Enter guest name"
                  />
                  {reservationErrors.guestName && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.guestName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={reservationForm.email}
                    onChange={(e) => {
                      setReservationForm({
                        ...reservationForm,
                        email: e.target.value,
                      });
                      const error = validateField("email", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        email: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validateField("email", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        email: error,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.email
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                    placeholder="guest@email.com"
                  />
                  {reservationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone *
                  </label>
                  <div className="flex rounded-lg overflow-hidden">
                    <select
                      value={reservationForm.countryCode}
                      onChange={(e) => {
                        setReservationForm({
                          ...reservationForm,
                          countryCode: e.target.value,
                        });
                      }}
                      className={`w-24 flex-shrink-0 px-3 py-2 border ${
                        reservationErrors.phone
                          ? "border-red-500"
                          : "border-secondary-300"
                      } text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white`}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.phoneCode}>
                          {country.flag} {country.phoneCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={reservationForm.phone}
                      onChange={(e) => {
                        setReservationForm({
                          ...reservationForm,
                          phone: e.target.value,
                        });
                        const error = validateField("phone", e.target.value);
                        setReservationErrors({
                          ...reservationErrors,
                          phone: error,
                        });
                      }}
                      onBlur={(e) => {
                        const error = validateField("phone", e.target.value);
                        setReservationErrors({
                          ...reservationErrors,
                          phone: error,
                        });
                      }}
                      className={`flex-1 px-3 py-2 border ${
                        reservationErrors.phone
                          ? "border-red-500"
                          : "border-secondary-300"
                      } border-l-0 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="123-4567"
                    />
                  </div>
                  {reservationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={reservationForm.address}
                    onChange={(e) => {
                      setReservationForm({
                        ...reservationForm,
                        address: e.target.value,
                      });
                      const error = validateField("address", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        address: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validateField("address", e.target.value);
                      setReservationErrors({
                        ...reservationErrors,
                        address: error,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.address
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                    placeholder="Enter guest address"
                  />
                  {reservationErrors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Room *
                  </label>
                  {hotelRooms && hotelRooms.length > 0 ? (
                    <select
                      value={reservationForm.roomType}
                      onChange={(e) => {
                        setReservationForm({
                          ...reservationForm,
                          roomType: e.target.value,
                        });
                        const roomTypeError = validateField(
                          "roomType",
                          e.target.value
                        );
                        // Also validate capacity when room changes
                        const adultsError = validateField(
                          "adults",
                          reservationForm.adults.toString(),
                          reservationForm.adults,
                          reservationForm.children
                        );
                        const childrenError = validateField(
                          "children",
                          reservationForm.children.toString(),
                          reservationForm.adults,
                          reservationForm.children
                        );
                        setReservationErrors({
                          ...reservationErrors,
                          roomType: roomTypeError,
                          adults: adultsError,
                          children: childrenError,
                        });
                      }}
                      onBlur={(e) => {
                        const roomTypeError = validateField(
                          "roomType",
                          e.target.value
                        );
                        // Also validate capacity when room changes
                        const adultsError = validateField(
                          "adults",
                          reservationForm.adults.toString(),
                          reservationForm.adults,
                          reservationForm.children
                        );
                        const childrenError = validateField(
                          "children",
                          reservationForm.children.toString(),
                          reservationForm.adults,
                          reservationForm.children
                        );
                        setReservationErrors({
                          ...reservationErrors,
                          roomType: roomTypeError,
                          adults: adultsError,
                          children: childrenError,
                        });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        reservationErrors.roomType
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                    >
                      <option value="">Select available room</option>
                      {hotelRooms?.filter(
                        (room) => room.roomStatus === RoomStatus.Available
                      ).length > 0 ? (
                        hotelRooms
                          ?.filter((room) => room.roomStatus === "available")
                          .map((room) => (
                            <option key={room._id} value={room.roomNumber}>
                              {room.roomNumber} -{" "}
                              {(
                                room.roomTypeId?.name ||
                                room.roomTypeName ||
                                "Room"
                              ).substring(0, 20)}
                              {(
                                room.roomTypeId?.name ||
                                room.roomTypeName ||
                                "Room"
                              ).length > 20
                                ? "..."
                                : ""}{" "}
                              (
                              {formatPrice(
                                room.roomTypeId?.price || 0,
                                currency
                              )}
                              )
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>
                          No available rooms
                        </option>
                      )}
                    </select>
                  ) : (
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handleFetchRooms}
                        disabled={isLoadingRooms}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {room.fetchedRooms && room.hotelRooms.length === 0 ? (
                          <>No Available Rooms</>
                        ) : isLoadingRooms ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                            Loading rooms...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Load Available Roomsa
                          </>
                        )}
                      </button>
                      {fetchRoomsError && (
                        <p className="mt-1 text-sm text-red-600">
                          Failed to load rooms. Please try again.
                        </p>
                      )}
                    </div>
                  )}
                  {reservationErrors.roomType && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.roomType}
                    </p>
                  )}
                </div>

                {/* Selected Room Details */}
                {reservationForm.roomType &&
                  hotelRooms &&
                  (() => {
                    const selectedRoom = hotelRooms.find(
                      (room) => room.roomNumber === reservationForm.roomType
                    );
                    if (!selectedRoom) return null;

                    return (
                      <div className="md:col-span-2 mt-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-5 border border-primary-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-primary-100 rounded-lg mr-3">
                            <Bed className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-secondary-900">
                              Room {selectedRoom.roomNumber}
                            </h3>
                            <span className="text-xs text-secondary-500">
                              {selectedRoom.roomTypeId?.name ||
                                selectedRoom.roomTypeName ||
                                "Room"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <Tag className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-secondary-500 mb-0.5">
                                  Room Type
                                </p>
                                <p className="text-sm font-medium text-secondary-900">
                                  {selectedRoom.roomTypeId?.name ||
                                    selectedRoom.roomTypeName ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Layers className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-secondary-500 mb-0.5">
                                  Floor
                                </p>
                                <p className="text-sm font-medium text-secondary-900">
                                  Floor {selectedRoom.floor}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Users className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-secondary-500 mb-0.5">
                                  Capacity
                                </p>
                                <p className="text-sm font-medium text-secondary-900">
                                  {selectedRoom.roomTypeId?.capacity ? (
                                    <>
                                      {selectedRoom.roomTypeId.capacity}{" "}
                                      {selectedRoom.roomTypeId.capacity === 1
                                        ? "person"
                                        : "people"}
                                    </>
                                  ) : (
                                    "N/A"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start">
                              <DollarSign className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-secondary-500 mb-0.5">
                                  Price
                                </p>
                                <p className="text-sm font-semibold text-primary-600">
                                  {formatPrice(
                                    selectedRoom.roomTypeId?.price || 0,
                                    currency
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Building className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-secondary-500 mb-0.5">
                                  Status
                                </p>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    selectedRoom.roomStatus === "available"
                                      ? "bg-green-100 text-green-800"
                                      : selectedRoom.roomStatus === "occupied"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {selectedRoom.roomStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <div className="relative">
                    <input
                      ref={reservationCheckInRef}
                      type="date"
                      value={reservationForm.checkIn}
                      onChange={(e) => {
                        const newCheckIn = e.target.value;
                        setReservationForm({
                          ...reservationForm,
                          checkIn: newCheckIn,
                        });
                        const checkInError = validateField(
                          "checkIn",
                          newCheckIn
                        );

                        // Re-validate payment date if it exists
                        let paymentDateError = "";
                        if (reservationForm.paymentDate) {
                          paymentDateError = validateField(
                            "paymentDate",
                            reservationForm.paymentDate
                          );
                        }

                        setReservationErrors({
                          ...reservationErrors,
                          checkIn: checkInError,
                          paymentDate: paymentDateError,
                        });
                      }}
                      onBlur={(e) => {
                        const checkInError = validateField(
                          "checkIn",
                          e.target.value
                        );

                        // Re-validate payment date if it exists
                        let paymentDateError = "";
                        if (reservationForm.paymentDate) {
                          paymentDateError = validateField(
                            "paymentDate",
                            reservationForm.paymentDate
                          );
                        }

                        setReservationErrors({
                          ...reservationErrors,
                          checkIn: checkInError,
                          paymentDate: paymentDateError,
                        });
                      }}
                      onClick={() => {
                        if (reservationCheckInRef.current) {
                          reservationCheckInRef.current.showPicker();
                        }
                      }}
                      // min={stayType === StayType.WALK_IN ? new Date().toISOString().split("T")[0] : (() => {
                      //   const tomorrow = new Date();
                      //   tomorrow.setDate(tomorrow.getDate() + 1);
                      //   return tomorrow.toISOString().split("T")[0];
                      // })()}
                      //  max={stayType === StayType.WALK_IN ? new Date().toISOString().split("T")[0] : undefined}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${
                        reservationErrors.checkIn
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                        colorScheme: "light",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (reservationCheckInRef.current) {
                          reservationCheckInRef.current.showPicker();
                        }
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 hover:text-secondary-600 focus:outline-none focus:text-primary-500"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                  {reservationErrors.checkIn && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.checkIn}
                    </p>
                  )}
                </div>

                {stayType === StayType.RESERVED && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Expected Payment Date *
                    </label>
                    <input
                      type="date"
                      value={reservationForm.paymentDate}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setReservationForm((prev) => ({
                          ...prev,
                          paymentDate: newValue,
                        }));
                        const error = validateField("paymentDate", newValue);
                        setReservationErrors((prev) => ({
                          ...prev,
                          paymentDate: error,
                        }));
                      }}
                      onBlur={(e) => {
                        const error = validateField(
                          "paymentDate",
                          e.target.value
                        );
                        setReservationErrors((prev) => ({
                          ...prev,
                          paymentDate: error,
                        }));
                      }}
                      onClick={(e) => {
                        // Make the entire input clickable to open date picker
                        const target = e.target as HTMLInputElement;
                        if (target && typeof target.showPicker === "function") {
                          target.showPicker();
                        }
                      }}
                      // min={(() => {
                      //   const today = new Date();
                      //   return today.toISOString().split('T')[0];
                      // })()}
                      // max={reservationForm.checkIn ? (() => {
                      //   const checkInDate = new Date(reservationForm.checkIn);
                      //   checkInDate.setDate(checkInDate.getDate() - 1);
                      //   return checkInDate.toISOString().split('T')[0];
                      // })() : undefined}
                      placeholder="YYYY-MM-DD"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${
                        reservationErrors.paymentDate
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                    />
                    {reservationErrors.paymentDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {reservationErrors.paymentDate}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={reservationForm.paymentMethod}
                    onChange={(e) => {
                      setReservationForm({
                        ...reservationForm,
                        paymentMethod: e.target.value,
                      });
                      const error = validateField(
                        "paymentMethod",
                        e.target.value
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        paymentMethod: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validateField(
                        "paymentMethod",
                        e.target.value
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        paymentMethod: error,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.paymentMethod
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                  >
                    <option value="">Select payment method</option>
                    {paymentMethodList.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {reservationErrors.paymentMethod && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.paymentMethod}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-out Date *
                  </label>
                  <div className="relative">
                    <input
                      ref={reservationCheckOutRef}
                      type="date"
                      value={reservationForm.checkOut}
                      onChange={(e) => {
                        setReservationForm({
                          ...reservationForm,
                          checkOut: e.target.value,
                        });
                        const error = validateField("checkOut", e.target.value);
                        setReservationErrors({
                          ...reservationErrors,
                          checkOut: error,
                        });
                      }}
                      onBlur={(e) => {
                        const error = validateField("checkOut", e.target.value);
                        setReservationErrors({
                          ...reservationErrors,
                          checkOut: error,
                        });
                      }}
                      onClick={() => {
                        if (reservationCheckOutRef.current) {
                          reservationCheckOutRef.current.showPicker();
                        }
                      }}
                      min={
                        reservationForm.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer ${
                        reservationErrors.checkOut
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                        colorScheme: "light",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (reservationCheckOutRef.current) {
                          reservationCheckOutRef.current.showPicker();
                        }
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 hover:text-secondary-600 focus:outline-none focus:text-primary-500"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                  {reservationErrors.checkOut && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.checkOut}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adults *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reservationForm.adults}
                    onChange={(e) => {
                      const newAdults = parseInt(e.target.value) || 1;
                      setReservationForm({
                        ...reservationForm,
                        adults: newAdults,
                      });
                      // Use current values for validation
                      const adultsError = validateField(
                        "adults",
                        e.target.value,
                        newAdults,
                        reservationForm.children
                      );
                      const childrenError = validateField(
                        "children",
                        reservationForm.children.toString(),
                        newAdults,
                        reservationForm.children
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        adults: adultsError,
                        children: childrenError,
                      });
                    }}
                    onBlur={(e) => {
                      const currentAdults = parseInt(e.target.value) || 1;
                      const adultsError = validateField(
                        "adults",
                        e.target.value,
                        currentAdults,
                        reservationForm.children
                      );
                      const childrenError = validateField(
                        "children",
                        reservationForm.children.toString(),
                        currentAdults,
                        reservationForm.children
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        adults: adultsError,
                        children: childrenError,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.adults
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                  />
                  {reservationErrors.adults && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.adults}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={reservationForm.children}
                    onChange={(e) => {
                      const newChildren = parseInt(e.target.value) || 0;
                      setReservationForm({
                        ...reservationForm,
                        children: newChildren,
                      });
                      // Use current values for validation
                      const adultsError = validateField(
                        "adults",
                        reservationForm.adults.toString(),
                        reservationForm.adults,
                        newChildren
                      );
                      const childrenError = validateField(
                        "children",
                        e.target.value,
                        reservationForm.adults,
                        newChildren
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        adults: adultsError,
                        children: childrenError,
                      });
                    }}
                    onBlur={(e) => {
                      const currentChildren = parseInt(e.target.value) || 0;
                      const adultsError = validateField(
                        "adults",
                        reservationForm.adults.toString(),
                        reservationForm.adults,
                        currentChildren
                      );
                      const childrenError = validateField(
                        "children",
                        e.target.value,
                        reservationForm.adults,
                        currentChildren
                      );
                      setReservationErrors({
                        ...reservationErrors,
                        adults: adultsError,
                        children: childrenError,
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      reservationErrors.children
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                  />
                  {reservationErrors.children && (
                    <p className="mt-1 text-sm text-red-600">
                      {reservationErrors.children}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={reservationForm.specialRequests}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      specialRequests: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {reservationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600">{reservationError}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    // Clear all reservation form state
                    setReservationForm({
                      guestName: "",
                      email: "",
                      countryCode: "+1",
                      phone: "",
                      address: "",
                      checkIn: "",
                      checkOut: "",
                      adults: 2,
                      children: 0,
                      roomType: "",
                      specialRequests: "",
                      paymentDate: "",
                      paymentMethod: "",
                    });
                    // Clear all reservation errors
                    setReservationErrors({
                      guestName: "",
                      phone: "",
                      email: "",
                      address: "",
                      roomType: "",
                      checkIn: "",
                      checkOut: "",
                      adults: "",
                      children: "",
                      paymentDate: "",
                      paymentMethod: "",
                    });
                    // Reset stay type to default
                    setStayType(StayType.RESERVED);
                    // Close modal
                    setShowReservationModal(false);
                  }}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingReservation}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingReservation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {stayType === StayType.RESERVED
                        ? "New Reservation"
                        : stayType === StayType.BOOKED
                        ? "New Booking"
                        : "Walk-in"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal (public-like booking separate from reservation) */}
      {false && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0"
          style={{
            margin: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Book a Room
              </h2>
              <button
                onClick={() => {}}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // For now, just close to keep it dummy/UX-only, separate from reservation
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    value={reservationForm.guestName}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        guestName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter guest name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={reservationForm.phone}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={reservationForm.checkIn}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        checkIn: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-out *
                  </label>
                  <input
                    type="date"
                    min={
                      reservationForm.checkIn ||
                      new Date().toISOString().split("T")[0]
                    }
                    value={reservationForm.checkOut}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        checkOut: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adults *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={reservationForm.adults}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        adults: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={reservationForm.children}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        children: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {}}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0"
          style={{
            margin: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Walk-in Guest
              </h2>
              <button
                onClick={() => {
                  // Clear walk-in form state
                  setWalkInForm({
                    guestName: "",
                    email: "",
                    phone: "",
                    checkIn: "",
                    checkOut: "",
                    adults: 2,
                    children: 0,
                    roomType: "",
                    paymentMethod: "",
                    specialRequests: "",
                  });
                  // Close modal
                  setShowWalkInModal(false);
                }}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkInForm.guestName}
                    onChange={(e) =>
                      setWalkInForm({
                        ...walkInForm,
                        guestName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter guest name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={walkInForm.email}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="guest@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={walkInForm.phone}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Room *
                  </label>
                  {hotelRooms && hotelRooms.length > 0 ? (
                    <select
                      required
                      value={walkInForm.roomType}
                      onChange={(e) =>
                        setWalkInForm({
                          ...walkInForm,
                          roomType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select available room</option>
                      {hotelRooms?.filter(
                        (room) => room.roomStatus === RoomStatus.Available
                      ).length > 0 ? (
                        hotelRooms
                          ?.filter((room) => room.roomStatus === "available")
                          .map((room) => (
                            <option key={room._id} value={room.roomNumber}>
                              {room.roomNumber} -{" "}
                              {(
                                room.roomTypeId?.name ||
                                room.roomTypeName ||
                                "Room"
                              ).substring(0, 20)}
                              {(
                                room.roomTypeId?.name ||
                                room.roomTypeName ||
                                "Room"
                              ).length > 20
                                ? "..."
                                : ""}{" "}
                              (
                              {formatPrice(
                                room.roomTypeId?.price || 0,
                                currency
                              )}
                              )
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>
                          No available rooms
                        </option>
                      )}
                    </select>
                  ) : (
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handleFetchRooms}
                        disabled={isLoadingRooms}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {room.fetchedRooms && room.hotelRooms.length === 0 ? (
                          <>No Available Rooms</>
                        ) : isLoadingRooms ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                            Loading rooms...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Load Available Roomsx
                          </>
                        )}
                      </button>
                      {fetchRoomsError && (
                        <p className="mt-1 text-sm text-red-600">
                          Failed to load rooms. Please try again.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkIn}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, checkIn: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkInForm.checkOut}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, checkOut: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={walkInForm.adults}
                    onChange={(e) =>
                      setWalkInForm({
                        ...walkInForm,
                        adults: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={walkInForm.children}
                    onChange={(e) =>
                      setWalkInForm({
                        ...walkInForm,
                        children: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={walkInForm.paymentMethod}
                    onChange={(e) =>
                      setWalkInForm({
                        ...walkInForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select payment method</option>
                    {paymentMethodList.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={walkInForm.specialRequests}
                  onChange={(e) =>
                    setWalkInForm({
                      ...walkInForm,
                      specialRequests: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    // Clear walk-in form state
                    setWalkInForm({
                      guestName: "",
                      email: "",
                      phone: "",
                      checkIn: "",
                      checkOut: "",
                      adults: 2,
                      children: 0,
                      roomType: "",
                      paymentMethod: "",
                      specialRequests: "",
                    });
                    // Close modal
                    setShowWalkInModal(false);
                  }}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Process Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0"
          style={{
            margin: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Add New Property
              </h2>
              <button
                onClick={() => {
                  setPropertyForm({
                    hotelName: "",
                    country: "",
                    countryCode: "+1",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    currency: "",
                    agreeToTerms: false,
                  });
                  setPropertyErrors({
                    hotelName: "",
                    country: "",
                    countryCode: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    currency: "",
                    agreeToTerms: "",
                  });
                  setShowAddPropertyModal(false);
                }}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePropertySubmit} className="space-y-6">
              {/* Hotel Information Section */}
              <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <div className="flex items-center mb-4">
                  <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Hotel Information
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="hotel-name"
                    className="block text-sm font-medium text-secondary-700 mb-2"
                  >
                    Hotel Name *
                  </label>
                  <input
                    id="hotel-name"
                    name="hotelName"
                    type="text"
                    value={propertyForm.hotelName}
                    onChange={(e) => {
                      setPropertyForm({
                        ...propertyForm,
                        hotelName: e.target.value,
                      });
                      const error = validatePropertyField(
                        "hotelName",
                        e.target.value
                      );
                      setPropertyErrors({
                        ...propertyErrors,
                        hotelName: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validatePropertyField(
                        "hotelName",
                        e.target.value
                      );
                      setPropertyErrors({
                        ...propertyErrors,
                        hotelName: error,
                      });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      propertyErrors.hotelName
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                    placeholder="Enter your hotel name"
                  />
                  {propertyErrors.hotelName && (
                    <p className="mt-1 text-sm text-red-600">
                      {propertyErrors.hotelName}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Contact Information
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="property-phone"
                    className="block text-sm font-medium text-secondary-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="flex rounded-lg overflow-hidden">
                    <select
                      name="countryCode"
                      value={propertyForm.countryCode}
                      onChange={(e) => {
                        setPropertyForm({
                          ...propertyForm,
                          countryCode: e.target.value,
                        });
                        const error = validatePropertyField(
                          "countryCode",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          countryCode: error,
                        });
                      }}
                      onBlur={(e) => {
                        const error = validatePropertyField(
                          "countryCode",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          countryCode: error,
                        });
                      }}
                      className={`w-24 flex-shrink-0 px-3 py-3 border ${
                        propertyErrors.countryCode
                          ? "border-red-500"
                          : "border-secondary-300"
                      } text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white`}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.phoneCode}>
                          {country.flag} {country.phoneCode}
                        </option>
                      ))}
                    </select>
                    <input
                      id="property-phone"
                      name="phone"
                      type="tel"
                      value={propertyForm.phone}
                      onChange={(e) => {
                        setPropertyForm({
                          ...propertyForm,
                          phone: e.target.value,
                        });
                        const error = validatePropertyField(
                          "phone",
                          e.target.value
                        );
                        setPropertyErrors({ ...propertyErrors, phone: error });
                      }}
                      onBlur={(e) => {
                        const error = validatePropertyField(
                          "phone",
                          e.target.value
                        );
                        setPropertyErrors({ ...propertyErrors, phone: error });
                      }}
                      className={`flex-1 px-4 py-3 border ${
                        propertyErrors.phone
                          ? "border-red-500"
                          : "border-secondary-300"
                      } border-l-0 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {propertyErrors.countryCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {propertyErrors.countryCode}
                    </p>
                  )}
                  {propertyErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {propertyErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Information Section */}
              <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Location Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="property-country"
                      className="block text-sm font-medium text-secondary-700 mb-2"
                    >
                      Country *
                    </label>
                    <select
                      id="property-country"
                      name="country"
                      value={propertyForm.country}
                      onChange={(e) => {
                        setPropertyForm({
                          ...propertyForm,
                          country: e.target.value,
                        });
                        const error = validatePropertyField(
                          "country",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          country: error,
                        });
                      }}
                      onBlur={(e) => {
                        const error = validatePropertyField(
                          "country",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          country: error,
                        });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        propertyErrors.country
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    {propertyErrors.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {propertyErrors.country}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="property-address"
                      className="block text-sm font-medium text-secondary-700 mb-2"
                    >
                      Address *
                    </label>
                    <input
                      id="property-address"
                      name="address"
                      type="text"
                      value={propertyForm.address}
                      onChange={(e) => {
                        setPropertyForm({
                          ...propertyForm,
                          address: e.target.value,
                        });
                        const error = validatePropertyField(
                          "address",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          address: error,
                        });
                      }}
                      onBlur={(e) => {
                        const error = validatePropertyField(
                          "address",
                          e.target.value
                        );
                        setPropertyErrors({
                          ...propertyErrors,
                          address: error,
                        });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        propertyErrors.address
                          ? "border-red-500"
                          : "border-secondary-300"
                      }`}
                      placeholder="Enter your hotel address"
                    />
                    {propertyErrors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {propertyErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="property-city"
                        className="block text-sm font-medium text-secondary-700 mb-2"
                      >
                        City *
                      </label>
                      <input
                        id="property-city"
                        name="city"
                        type="text"
                        value={propertyForm.city}
                        onChange={(e) => {
                          setPropertyForm({
                            ...propertyForm,
                            city: e.target.value,
                          });
                          const error = validatePropertyField(
                            "city",
                            e.target.value
                          );
                          setPropertyErrors({ ...propertyErrors, city: error });
                        }}
                        onBlur={(e) => {
                          const error = validatePropertyField(
                            "city",
                            e.target.value
                          );
                          setPropertyErrors({ ...propertyErrors, city: error });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          propertyErrors.city
                            ? "border-red-500"
                            : "border-secondary-300"
                        }`}
                        placeholder="Enter city"
                      />
                      {propertyErrors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {propertyErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="property-state"
                        className="block text-sm font-medium text-secondary-700 mb-2"
                      >
                        State/Province *
                      </label>
                      <input
                        id="property-state"
                        name="state"
                        type="text"
                        value={propertyForm.state}
                        onChange={(e) => {
                          setPropertyForm({
                            ...propertyForm,
                            state: e.target.value,
                          });
                          const error = validatePropertyField(
                            "state",
                            e.target.value
                          );
                          setPropertyErrors({
                            ...propertyErrors,
                            state: error,
                          });
                        }}
                        onBlur={(e) => {
                          const error = validatePropertyField(
                            "state",
                            e.target.value
                          );
                          setPropertyErrors({
                            ...propertyErrors,
                            state: error,
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          propertyErrors.state
                            ? "border-red-500"
                            : "border-secondary-300"
                        }`}
                        placeholder="Enter state/province"
                      />
                      {propertyErrors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {propertyErrors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="property-postal-code"
                        className="block text-sm font-medium text-secondary-700 mb-2"
                      >
                        Postal Code *
                      </label>
                      <input
                        id="property-postal-code"
                        name="postalCode"
                        type="text"
                        value={propertyForm.postalCode}
                        onChange={(e) => {
                          setPropertyForm({
                            ...propertyForm,
                            postalCode: e.target.value,
                          });
                          const error = validatePropertyField(
                            "postalCode",
                            e.target.value
                          );
                          setPropertyErrors({
                            ...propertyErrors,
                            postalCode: error,
                          });
                        }}
                        onBlur={(e) => {
                          const error = validatePropertyField(
                            "postalCode",
                            e.target.value
                          );
                          setPropertyErrors({
                            ...propertyErrors,
                            postalCode: error,
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          propertyErrors.postalCode
                            ? "border-red-500"
                            : "border-secondary-300"
                        }`}
                        placeholder="Enter postal code"
                      />
                      {propertyErrors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {propertyErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Settings Section */}
              <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Business Settings
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="property-currency"
                    className="block text-sm font-medium text-secondary-700 mb-2"
                  >
                    Currency *
                  </label>
                  <select
                    id="property-currency"
                    name="currency"
                    value={propertyForm.currency}
                    onChange={(e) => {
                      setPropertyForm({
                        ...propertyForm,
                        currency: e.target.value,
                      });
                      const error = validatePropertyField(
                        "currency",
                        e.target.value
                      );
                      setPropertyErrors({ ...propertyErrors, currency: error });
                    }}
                    onBlur={(e) => {
                      const error = validatePropertyField(
                        "currency",
                        e.target.value
                      );
                      setPropertyErrors({ ...propertyErrors, currency: error });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      propertyErrors.currency
                        ? "border-red-500"
                        : "border-secondary-300"
                    }`}
                  >
                    <option value="">Select your currency</option>
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  {propertyErrors.currency && (
                    <p className="mt-1 text-sm text-red-600">
                      {propertyErrors.currency}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <div className="flex items-start">
                  <input
                    id="agree-terms-property"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={propertyForm.agreeToTerms}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPropertyForm({
                        ...propertyForm,
                        agreeToTerms: checked,
                      });
                      const error = validatePropertyField(
                        "agreeToTerms",
                        checked
                      );
                      setPropertyErrors({
                        ...propertyErrors,
                        agreeToTerms: error,
                      });
                    }}
                    onBlur={(e) => {
                      const error = validatePropertyField(
                        "agreeToTerms",
                        propertyForm.agreeToTerms
                      );
                      setPropertyErrors({
                        ...propertyErrors,
                        agreeToTerms: error,
                      });
                    }}
                    className={`h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1 ${
                      propertyErrors.agreeToTerms ? "border-red-500" : ""
                    }`}
                  />
                  <div className="ml-3">
                    <label
                      htmlFor="agree-terms-property"
                      className="text-sm text-secondary-700"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </label>
                    {propertyErrors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-600">
                        {propertyErrors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {addPropertyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{addPropertyError}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPropertyForm({
                      hotelName: "",
                      country: "",
                      countryCode: "+1",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      currency: "",
                      agreeToTerms: false,
                    });
                    setPropertyErrors({
                      hotelName: "",
                      country: "",
                      countryCode: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      postalCode: "",
                      currency: "",
                      agreeToTerms: "",
                    });
                    setShowAddPropertyModal(false);
                  }}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingProperty}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingProperty ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
