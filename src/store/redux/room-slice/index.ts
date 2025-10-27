import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RoomSliceParams,
  RoomState,
  RoomStatusUpdate,
  RoomTypeSliceParams,
} from "@/types/room-management/room-management";
import { RoomType } from "@/types";

const initialState: RoomState = {
  fetchedRooms: false,
  fetchedRoomType: false,
  hotelRooms: [],
  hotelRoomTypes: [],
};

const roomSlice = createSlice({
  name: "Room",
  initialState,
  reducers: {
    // Replace all room types
    setRoomTypes: (state, action: PayloadAction<RoomTypeSliceParams[]>) => {
      state.fetchedRooms = true;

      state.hotelRoomTypes = action.payload;
    },

    // ✅ Add a single room type, merging it safely with existing ones
    addRoomType: (state, action: PayloadAction<RoomTypeSliceParams>) => {
      const newRoomType = action.payload;
      state.fetchedRoomType = true;
      // Use reduce to rebuild array while avoiding duplicates by _id
      state.hotelRoomTypes = state.hotelRoomTypes
        .concat(newRoomType)
        .reduce<RoomTypeSliceParams[]>((acc, current) => {
          const exists = acc.find((r) => r._id === current._id);
          if (!exists) acc.push(current);
          return acc;
        }, []);
    },

    updateRoomType: (state, action: PayloadAction<RoomTypeSliceParams>) => {
      const updatedRoomType = action.payload;

      state.hotelRoomTypes = state.hotelRoomTypes.map((roomType) =>
        roomType._id === updatedRoomType._id
          ? { ...roomType, ...updatedRoomType } // merge updates
          : roomType
      );
    },

    deleteRoomType: (state, action: PayloadAction<string>) => {
      const roomTypeId = action.payload;
      state.hotelRoomTypes = state.hotelRoomTypes.filter(
        (roomType) => roomType._id !== roomTypeId
      );
    },

    setRooms: (state, action: PayloadAction<RoomSliceParams[]>) => {
      state.hotelRooms = action.payload;
    },

    addRoom: (state, action: PayloadAction<RoomSliceParams>) => {
      const newRoomType = action.payload;

      // Use reduce to rebuild array while avoiding duplicates by _id
      state.hotelRooms = state.hotelRooms
        .concat(newRoomType)
        .reduce<RoomSliceParams[]>((acc, current) => {
          const exists = acc.find((r) => r._id === current._id);
          if (!exists) acc.push(current);
          return acc;
        }, []);
    },

    updateRoom: (state, action: PayloadAction<RoomSliceParams>) => {
      const updatedRoom = action.payload;

      state.hotelRooms = state.hotelRooms.map((room) =>
        room._id === updatedRoom._id
          ? { ...room, ...updatedRoom } // merge updates
          : room
      );
    },

    updateRoomStatus: (state, action: PayloadAction<RoomStatusUpdate>) => {
      const { roomId, status } = action.payload;

      state.hotelRooms = state.hotelRooms.map((room) =>
        room._id === roomId ? { ...room, roomStatus: status } : room
      );
    },
  },
});

export const roomActions = roomSlice.actions;
export default roomSlice;
