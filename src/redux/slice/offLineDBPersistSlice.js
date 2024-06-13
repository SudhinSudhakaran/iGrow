import {createSlice} from '@reduxjs/toolkit';

const offLineDBPersistSlice = createSlice({
  name: 'assetPersist',
  initialState: {
    assets: [],
    admins: [],
    incidents: [],
    programmes: [],
    departments: [],
    scheduleList: [],
    assetsImagesList: [],
    incidentsImagesList: [],
  },
  reducers: {
    addAdmins: (state, action) => {
      state.admins = action.payload;
    },
    addAssets: (state, action) => {
      // state.assets = JSON.stringify(action.payload);
      console.log('Add assets function called' , action)
      state.assets = action.payload;
    },
    addIncidents: (state, action) => {
      state.incidents = action.payload;
    },
    addDepartments: (state, action) => {
      state.departments = action.payload;
    },
    addProgrammes: (state, action) => {
      state.programmes = action.payload;
    },
    addScheduleList: (state, action) => {
      state.scheduleList = action.payload;
    },
    addAssetsImagesList: (state, action) => {
      state.assetsImagesList = action.payload;
    },
    addIncidentsImagesList: (state, action) => {
      state.incidentsImagesList = action.payload;
    },
  },
});
export const {
  addAdmins,
  getAssets,
  addAssets,
  addIncidents,
  addProgrammes,
  addDepartments,
  addScheduleList,
  addAssetsImagesList,
  addIncidentsImagesList,
} = offLineDBPersistSlice.actions;
export default offLineDBPersistSlice.reducer;
