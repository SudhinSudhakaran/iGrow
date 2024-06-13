import { createSlice } from "@reduxjs/toolkit";

const detailSlice =createSlice({
    name:'detailSchedule',
    initialState:{
        detailSchedule:[]
    },
    reducers:{
        setDetailSchedule:(state,action)=>{
            state.detailSchedule=action.payload;
        }
    }
});

export const {setDetailSchedule}=detailSlice.actions;
export default detailSlice.reducer;