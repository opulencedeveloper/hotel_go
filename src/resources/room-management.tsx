import { RoomStatus } from "@/types/room-management/enum";
import { RoomStatusListType } from "@/types/room-management/room-management";

export const roomStatusList: RoomStatusListType[] = [
  { label: "Available", value: RoomStatus.Available },
  { label: "Unavailable", value: RoomStatus.Unavailable },
  { label: "Occupied", value: RoomStatus.Occupied },
  { label: "Marked for Cleaning", value: RoomStatus.MarkForCleaning },
  { label: "Cleaning", value: RoomStatus.Cleaning },
  { label: "Maintenance", value: RoomStatus.Maintenance },
];
