import {createSlice} from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'userDetails',
  initialState: {
    userDetails: {},
  },
  reducers: {
    setUserDetails: (state,action)=> {
      state.userDetails = action.payload;
    },
  },
});

export const {setUserDetails} = userSlice.actions;
export default userSlice.reducer;
