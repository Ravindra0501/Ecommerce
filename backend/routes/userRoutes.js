import express from 'express';
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// @router POST /api/Users/register
// @desc Register a new User
// @access public

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Registration Logic
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exist" })

        user = new User({ name, email, password });
        await user.save();

        // Create jwt Payload
        const payload = { user: { id: user._id, role: user.role } }

        // Sign and return the token along with user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "200h" },
            (err, token) => {
                if (err) throw err;

                // send the user and token in responce
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        )


    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});


// @route.post /api/users/login
// @desc Authenticate user
// @access public

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user by id
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });
        const isMatch = await user.matchPassword(password);

        if (!isMatch)
            return res.status(400).json({ message: "Invalid Credentials" });


        // Create jwt Payload
        const payload = { user: { id: user._id, role: user.role } }

        // Sign and return the token along with user data
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                // send the user and token in responce
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
});

// @route GET /api/users/profile
// @GET logged-in user's profile{protected route}
// access private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
})

export default router;