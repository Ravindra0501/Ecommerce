import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {

    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }
    );
    return response.data;
});

// Add the create user action
export const addUser = createAsyncThunk(
    "admin/addUser", async (userData, { rejectWithValue }) => {
        try {
            const responce = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            return responce.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

// Update user info
export const updateUser = createAsyncThunk("admin/updateUser",
    async ({ id, name, email, role }) => {
        const token = localStorage.getItem("token");
        console.log("Token retrieved in adminSlice thunk:", token); // What is retrieved?
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
            { name, email, role },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return response.data.user;
    })

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return id;
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updateUser = action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updateUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updateUser;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

    },
});

export default adminSlice.reducer;