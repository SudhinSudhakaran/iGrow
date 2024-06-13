import {createSlice} from '@reduxjs/toolkit';
const notificationCountSlice = createSlice({
  name: 'notificationCount',
  initialState: {
    notificationCount: 0,
  },
  reducers: {
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});
export const {setNotificationCount} = notificationCountSlice.actions;
export default notificationCountSlice.reducer;
