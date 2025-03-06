// src/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';


export type Product = {
  id: number,
  name: string,
  price: number,
  description: string,
  vendor: Vendor
}
export type Vendor  = {
  "vendorId": string,
  "vendorName": string,
  "vendorEmail": string,
  "vendorPhone": string,
  "vendorAddress": string,
  "vendorCity": string,
  "vendorState": string,
  "vendorZipCode": string,
  "vendorPostalCode": string,
  "vendorWebsite": string,
  "vendorWebsiteUrl": string,
  "vendorFaxUrl": string,
}
// Definir el tipo para el estado
interface CounterState {
  count: number;
}


// Estado inicial con el tipo definido
const initialState: CounterState = {
  count: 0,
};

// Crear un slice para el contador
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    // Acción que recibe un payload (si fuera necesario)
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

const InitialVendorState: Vendor[] = [];


const vendorSlice = createSlice({
  name: 'vendor',
  initialState: InitialVendorState,
  reducers: {
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.push(action.payload);
    },
    removeVendor: (state, action: PayloadAction<string>) => {
      return state.filter((vendor) => vendor.vendorId !== action.payload);
    },
    updateVendor: (state, action: PayloadAction<Vendor>) => {
      const index = state.findIndex((vendor) => vendor.vendorId === action.payload.vendorId);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state = action.payload;
    }
  },
});

// Exportar las acciones
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const { addVendor, removeVendor, updateVendor, setVendors } = vendorSlice.actions;

// Crear el store con los tipos
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    vendors: vendorSlice.reducer,
  },
});

// Definir el tipo del estado global
export type RootState = ReturnType<typeof store.getState>;
// El tipo del dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
