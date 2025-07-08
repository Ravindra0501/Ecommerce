import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const getToken = () => {
    // We are now storing the token under the key "token" (lowercase 't')
    return localStorage.getItem("token");
};


// Async Thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async (_, { rejectWithValue }) => {
        const token = getToken(); // Call the function to get the current token
        if (!token) {
            // If no token, immediately reject and provide a clear error message
            return rejectWithValue({ message: "No authentication token found. Please log in." });
        }
        const response = await axios.get(`${API_URL}/api/admin/products`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data
    }
);

// async function to create a new product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {

        const token = getToken(); // Get the current token
            if (!token) {
                return rejectWithValue({ message: "No authentication token found. Please log in." });
            }


        const response = await axios.post(
            `${API_URL}/api/admin/products`,
            productData,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data
    }
);

// async thunk to update an existing product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {

        const token = getToken(); // Get the current token
            if (!token) {
                return rejectWithValue({ message: "No authentication token found. Please log in." });
            }

        const response = await axios.put(

            `${API_URL}/api/admin/products/${id}`,
            productData,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data
    }
)

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        const token = getToken(); // Get the current token
            if (!token) {
                return rejectWithValue({ message: "No authentication token found. Please log in." });
            }
        await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: { authorization: `Bearer ${token}` },
        });
        return id;
    }
);
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            });
    },
});

export default adminProductSlice.reducer;