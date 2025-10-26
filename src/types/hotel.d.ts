export interface HotelSliceParams {
  _id: string;
  hotelName: string;
  address: string;
  currency: string;
  amenities: string[];
  createdAt: string;
}


export interface HotelState {
  hotels: HotelSliceParams[];
  selectedHotelId: string | null;
}
