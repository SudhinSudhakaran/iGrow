import {createSlice} from '@reduxjs/toolkit';

const lastSyncAt = createSlice({
  name: 'lastSyncAt',
  initialState: {
    lastSyncAt: '',
  },
  reducers: {
    setLastSyncAt: (state, actions) => {
      state.lastSyncAt = actions.payload;
    },
  },
});
export const {setLastSyncAt} = lastSyncAt.actions;
export default lastSyncAt.reducer;
