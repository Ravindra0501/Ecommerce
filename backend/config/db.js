import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connectred successfully");
    } catch (error) {
        console.error("MongoDB Connection failed", error);
        
    }
};

export default  connectDB