"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
//import storage from "redux-persist/lib/storage";


import userReducer from "./user-slice";
import hotelReducer from "./hotel-slice";
import roomReducer from "./room-slice";
import stayReducer from "./stay-slice";
import hotelServiceReducer from "./hotel-services-slice";
import scheduledServiceReducer from "./scheduled-services-slice";
import facilitiesReducer from "./facility-slice";
import menuReducer from "./menu-slice";
import orderReducer from "./order-slice";
import staffReducer from "./staff-slice";

// const clientCartPersistConfig = {
//   key: "token",
//   storage,
// };

const rootReducer = combineReducers({
  // token: persistReducer(
  //   clientCartPersistConfig,
  //   toastReducer.reducer
  // ),
  user: userReducer.reducer,
  hotel: hotelReducer.reducer,
  room: roomReducer.reducer,
  stay: stayReducer.reducer,
  hotelService: hotelServiceReducer.reducer,
  scheduledService: scheduledServiceReducer.reducer,
  facilities: facilitiesReducer.reducer,
  menu: menuReducer.reducer,
  order: orderReducer.reducer,
  staff: staffReducer.reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


// "use client";

// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import user from "@/store/redux/user-slice";
// import authReducer from "@/store/slices/authSlice";
// import reservationsReducer from "@/store/slices/reservationsSlice";
// import guestsReducer from "@/store/slices/guestsSlice";
// import roomsReducer from "@/store/slices/roomsSlice";
// import staffReducer from "@/store/slices/staffSlice";
// import dashboardReducer from "@/store/slices/dashboardSlice";

// const rootReducer = combineReducers({
//   user: user.reducer,
//   auth: authReducer,
//   reservations: reservationsReducer,
//   guests: guestsReducer,
//   rooms: roomsReducer,
//   staff: staffReducer,
//   dashboard: dashboardReducer,
// });

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;
