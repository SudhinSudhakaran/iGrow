/* eslint-disable space-infix-ops */
import { createSlice } from "@reduxjs/toolkit";

const taskSlice=createSlice({
    name:'startTask',
    initialState:{
        startTask:null,
        endTask:null,
        addButton:null,
    },
    reducers:{
        setStartTask:(state,action)=>{
            state.startTask=action.payload;
        },
        setEndTask:(state,action)=>{
            state.endTask=action.payload;
        },
        setAddButton:(state,action)=>{
            state.addButton=action.payload;
        },
    },
});

export const {setStartTask,setEndTask,setAddButton}=taskSlice.actions;
export default taskSlice.reducer;