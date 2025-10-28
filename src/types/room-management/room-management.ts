import { RoomStatus } from "./enum";

export interface AddRoomModalProps {
  isOpen: boolean;
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
  isOpen: boolean;
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
   roomTypeId: {
    name: string;
    price: number;
    capacity: number;
  };
  roomTypeName: string;
  roomStatus: RoomStatus;
  note: string;
  lastCleaned: string;
}

export interface RoomState {
  fetchedRooms: boolean;
  fetchedRoomType: boolean;
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
  status: RoomStatus;
}
