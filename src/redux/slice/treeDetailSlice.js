import {createSlice} from '@reduxjs/toolkit';
const treeDetailSlice = createSlice({
  name: 'treeDetails',
  initialState: {
    treeDetails: {},
    noteDetails:[],
    vitalsDetails:[],
    imagesDetails:[],
    incidentDetails:[],
    reportIncidents: {},
    treeisLoading: {},
    selectedQr: '',
    assetLocation: '',
    incidentIsLoading: {},
    reportIncidentsById: {},
    incidentIsLoadingById: {},
    detailsImageList: [],
    isFormAddVitals: true,
  },
  reducers: {
    settreeDetails: (state, actions) => {
      state.treeDetails = actions.payload;
    },
    setnoteDetails: (state, actions) => {
      state.noteDetails = actions.payload;
    },
    setincidentDetails: (state, actions) => {
      state.incidentDetails = actions.payload;
    },
    setvitalsDetails: (state, actions) => {
      state.vitalsDetails = actions.payload;
    },
    setimagesDetails: (state, actions) => {
      state.imagesDetails = actions.payload;
    },
    setIncidentIsLoading: (state, actions) => {
      state.incidentIsLoading = actions.payload;
    },
    setreportIncidents: (state, actions) => {
      state.reportIncidents = actions.payload;
    },
    setIncidentIsLoadingById: (state, actions) => {
      state.incidentIsLoadingById = actions.payload;
    },
    setreportIncidentsById: (state, actions) => {
      state.reportIncidentsById = actions.payload;
    },
    settreeIsLoading: (state, actions) => {
      state.treeisLoading = actions.payload;
    },
    /**
    * Purpose: sore the selected qr code
    * Created/Modified By: Sudhin Sudahakaran
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. pass the qr value to the function 
             2. assign the value
    */
    setSelectedQr: (state, actions) => {
      state.selectedQr = actions.payload;
    },
    /**
    * Purpose: sore the selected assets location
    * Created/Modified By: Sudhin Sudahakaran
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. pass the qr value to the function 
             2. assign the value
    */
    setAssetsLocation: (state, actions) => {
      state.assetLocation = actions.payload;
    },

    /**
    * Purpose: sore the selected assets location
    * Created/Modified By: Sudhin Sudahakaran
    * Created/Modified Date: 29 Feb 2023
    * Steps: 1. pass the qr value to the function 
             2. assign the value
    */
    setDetailsImageList: (state, actions) => {
      state.detailsImageList = actions.payload;
    },
    /**
    * Purpose: sore the selected assets location
    * Created/Modified By: Sudhin Sudahakaran
    * Created/Modified Date: 29 Feb 2023
    * Steps: 1. pass the qr value to the function 
             2. assign the value
    */
    setIsFromAddVitals: (state, actions) => {
      state.isFormAddVitals = actions.payload;
    },
  },
});

export const {
  settreeDetails,
  setreportIncidents,
  setIncidentIsLoadingById,
  setreportIncidentsById,
  settreeIsLoading,
  setSelectedQr,
  setAssetsLocation,
  setIncidentIsLoading,
  setDetailsImageList,
  setIsFromAddVitals,
  setnoteDetails,
  setvitalsDetails,
  setimagesDetails,
  setincidentDetails,
} = treeDetailSlice.actions;
export default treeDetailSlice.reducer;
