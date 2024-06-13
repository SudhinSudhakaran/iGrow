import {createSlice} from '@reduxjs/toolkit';
/**
 <---------------------------------------------------------------------------------------------->
 * Purpose: reduxPersistSlice
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 10-05-2023
 * Steps:
 * 1.   declare initial states
 <---------------------------------------------------------------------------------------------->
 */
const reduxPersistSlice = createSlice({
  name: 'reduxPersist',
  initialState: {
    notePersist: [],
    vitalPersist: [],
    incidentPersist: [],
    assetList:[],
  },
  reducers: {
    /**
     <---------------------------------------------------------------------------------------------->
     * Purpose: setNotePersist
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 10-05-2023
     * Steps:
     * 1.   function for storing notes in persistent
     <---------------------------------------------------------------------------------------------->
     */
    setNotePersist: (state, action) => {
      state.notePersist = action.payload;
    },
    setAssetList: (state, action) => {
      state.assetList = action.payload;
    },
    /**
     <---------------------------------------------------------------------------------------------->
     * Purpose: Delete notes
     * Created/Modified By: Sudhin Sudhakaran
     * Created/Modified Date: 10-05-2023
     * Steps:
     * 1.   function for deleting notes in persistent
     * 2.   get the id to delete
     * 3.   filter the array with out that  item
     <---------------------------------------------------------------------------------------------->
     */
    deleteNote: (state, action) => {
      const idToDelete = action.payload;
      state.notePersist = state.notePersist.filter(
        note => note.noteUniqId !== idToDelete,
      );
    },
    setVitalPersist: (state, action) => {
      state.vitalPersist = action.payload;
    },
    deleteVital: (state, action) => {
      const idToDelete = action.payload;
      state.vitalPersist = state.vitalPersist.filter(
        vital => vital.vitalUniqId !== idToDelete,
      );
    },
    setIncidentPersist: (state, action) => {
      state.incidentPersist = action.payload;
    },
    deleteIncident: (state, action) => {
      const idToDelete = action.payload;
      state.incidentPersist = state.incidentPersist.filter(
        incident => incident.incidentUniqId !== idToDelete,
      );
    },
  },
});
export const {
  setNotePersist,
  deleteVital,
  setVitalPersist,
  setAssetList,
  setIncidentPersist,
  deleteNote,
  deleteIncident,
} = reduxPersistSlice.actions;
export default reduxPersistSlice.reducer;
