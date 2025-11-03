export interface HotelSliceParams {
  _id: string;
  hotelName: string;
  address: string;
  currency: string;
  amenities: string[];
  createdAt: string;
  email?: string;
  phoneNo?: string;
}


export interface HotelState {
  hotels: HotelSliceParams[];
  selectedHotelId: string | null;
}
