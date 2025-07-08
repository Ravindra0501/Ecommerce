import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from 'axios'

// Retrive user and token from localstorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// check for an existing guest ID in the localstorage or generate a new one 
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;

//  Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async Thunk for user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);

            return response.data.user; // Return the user object from the responce
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Async Thunk for user Registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);

            return response.data.user; // Return the user object from the responce
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; //Reset guest ID on Logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            localStorage.setItem("guestId", state.guestId); //set
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;

                console.log("Response data after login:", action.payload); // See the whole payload
                console.log("Token value to be stored:", action.payload.Token); // What is response.data.Token?
                // state.token = action.payload.Token; // You might want to store token in Redux state too
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;