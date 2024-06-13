import { createSlice } from "@reduxjs/toolkit";

const notificationViewSlice =createSlice({
    name:'viewNotification',
    initialState:{
        viewNotification:[],

    },
    reducers:{
        setViewNotification:(state,action)=>{
            state.viewNotification=action.payload;
        },
    },
});
export const {setViewNotification}=notificationViewSlice.actions;
export default notificationViewSlice.reducer;