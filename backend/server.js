import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import subscribeRoutes from './routes/SubscriberRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import productAdminRoutes from './routes/productsAdminRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 9001;

app.get("/", (req, res) => {
    res.send("WELCOME TO RABBIT API");
});

const startServer = async () => {
    try {
        await connectDB(); // ✅ Wait for MongoDB connection first

        // ✅ Only register routes after DB is connected
        app.use("/api/users", userRoutes);
        app.use("/api/products", productRoutes);
        app.use("/api/cart", cartRoutes);
        app.use("/api", subscribeRoutes);

        // Admin routes
        app.use("/api/admin/users",adminRoutes);
        app.use("/api/admin/products",productAdminRoutes);
        app.use("/api/admin/orders",adminOrderRoutes);


        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();
