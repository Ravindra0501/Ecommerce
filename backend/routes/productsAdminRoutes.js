import express from "express";
import Product from '../models/Product.js'
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

// @route GET /api/admin/products
// @desc get all products (Admin Only)
// @access private/admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;