import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/store';

// Define the initial state using that type
const initialState = {
  provincesData: [],
};

export const provincesSlice = createSlice({
  name: 'provinces',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getProvinces: (state) => {
      return state;
    },
    setProvinces: (state, action) => {
      state.provincesData = action.payload;
    }, //// demo check fake login
  },
});

export const { getProvinces, setProvinces } = provincesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const provincesReducer = (state: RootState) => state.provinces;

export default provincesSlice.reducer;
