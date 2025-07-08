import jwt from 'jsonwebtoken'
import User from '../models/User.js'


// middleware to protect routes

export const protect = async (req, res, next) => {
    console.log("Request Headers:", req.headers); // Add this
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select("-password");  //Exclude password
            next();

        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed " });
        }
    } else {
        console.log("No authorization header or invalid format."); // Add this
        res.status(401).json({ message: "Not authorized, no token provided" })
    }
};

// Middleware to check if the user is an admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not Authorized as an admin" })
    }
};
