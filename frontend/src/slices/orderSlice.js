import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const responce = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            return responce.data;
        } catch (error) {
            return rejectWithValue(error.responce.data)
        }
    }
);

// Async thunk to fetch orders details byID
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            const responce = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            return responce.data;
        } catch (error) {
            rejectWithValue(error.responce.data);
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // Fetch User orders
        .addCase(fetchUserOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchUserOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(fetchUserOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })

        // Fetch order details
        .addCase(fetchOrderDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchOrderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(fetchOrderDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
    }
});

export default orderSlice.reducer;
