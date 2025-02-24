// src/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

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


// Exportar las acciones
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Crear el store con los tipos
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Definir el tipo del estado global
export type RootState = ReturnType<typeof store.getState>;
// El tipo del dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
