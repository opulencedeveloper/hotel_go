export interface HotelSliceParams {
  _id: string;
  hotelName: string;
  totalRooms: number;
  totalRoomsOccupied:  number;
  address: string;
  currency: string;
  totalRoomsInMaintenance: number;
  amenities: string[];
}


export interface HotelState {
  hotels: HotelSliceParams[];
  selectedHotelId: string | null;
}
