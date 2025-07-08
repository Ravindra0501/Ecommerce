import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import products from './productData/products.js'

dotenv.config();

// connect to mongodb
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', async () => {
  console.log('MongoDB connected successfully');
  await seedData();
});

// Function to seed data

const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();


        // create a default admin user 
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin",
        });

        // Assign the default User Id to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((products) => {
            return { ...products, user: userID };
        });

        // Insert the products into thye database
        await Product.insertMany(sampleProducts);
        console.log("product data seeded successfully");
        process.exit();

    } catch (error) {
        console.error("Error seeding the data:", error);
        process.exit(1);
    }
};

