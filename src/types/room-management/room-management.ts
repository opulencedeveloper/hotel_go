import { RoomStatus } from "./enum";

export interface AddRoomModalProps {
  onClose: () => void;
  addRoomType: () => void;
}

export interface ManageHotelAmenitiesModalProps {
  onClose: () => void;
}

export interface AddRoomModalType {
  roomNumber: string;
  floor: number;
  roomTypeId: string;
  roomStatus: string;
  note?: string;
}

export interface RoomStatusListType {
  label: string;
  value: RoomStatus;
}

export interface AddRoomTypeModalProps {
  onClose: () => void;
}

export interface RoomTypeSliceParams {
  _id: string;
  name: string;
  capacity: number;
  price: number;
  description?: string;
  amenities?: string[];
}

export interface RoomSliceParams {
  _id: string;
  floor: number;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  roomStatus: string;
  note: string;
  lastCleaned: string;
}

export interface RoomState {
  fetchedData: boolean;
  hotelRoomTypes: RoomTypeSliceParams[];
  hotelRooms: RoomSliceParams[];
}

export interface RoomManagementCardProps {
  addRoom: () => void;
  addRoomType: () => void;
  addRatePlan: () => void;
}

export interface RoomStatusUpdate {
  roomId: string;
  status: string;
}
