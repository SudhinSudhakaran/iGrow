import { createSlice } from "@reduxjs/toolkit";
const profileSlice = createSlice({
    name:'profileData',
    initialState:{
        profileData:{},
    },
    reducers:{
        setProfileData:(state,action)=>{
            state.profileData=action.payload;
        },
    },
});
export const {setProfileData}=profileSlice.actions;
export default profileSlice.reducer;