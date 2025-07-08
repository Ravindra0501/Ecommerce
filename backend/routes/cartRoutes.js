import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function to get cart by userId or guestId 
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
}

// @route POST /api/cart
// @desc add a product to the cart for a guest or logged in user
// @access public
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Determine if the user is Logged in or guest
        let cart = await getCart(userId, guestId);

        // if the cart exist,update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // If the product already exist, update the quantity
                cart.products[productIndex].quantity += Number(quantity);
            } else {
                // add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity: Number(quantity)
                });
            }
            // Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // create a new cart for the guest user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity: Number(quantity)

                    },
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route PUT /api/cart
// @desc update product quantity in the cart for a guest or logged in user
// @access public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); //remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route DELETE /api//cart
// @desc remove a product form the cart
// @access public
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);

        if (!cart) return res.status(404).json({ message: "cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ message: "cart not found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/cart/merge
// @desc MERGE guest cart into user cart or login
// @access private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if(guestCart){
            if(guestCart.products.length===0){
                return res.status(400).json({message:"Guest Cart is empty"})
            }

            if(userCart){
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex(
                        (item)=>
                            item.productId.toString()===guestItem.productId.toString() &&
                        item.size===guestItem.size &&
                        item.color===guestItem.color
                    );
                    if(productIndex>-1){
                        // if thwe item exist in usercart, update the quantity
                        userCart.products[productIndex].quantity+=guestItem.quantity;
                    } else{
                        // otherwise add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice=userCart.products.reduce(
                    (acc,item)=>acc+item.price*item.quantity,
                    0
                );
                await userCart.save();
                // Remove the guest card after merging
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error("Error deleting guest cart:",error);
                }
                res.status(200).json(userCart);
            } else{
                //  if the user has no existig cart assign the guest cart to the user 
                guestCart.user=req.user._id;
                guestCart.guestId=undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        } else{
            if(userCart){
                // Guest cart has already been merged , return usercart
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"Guest cart not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
})

export default router;