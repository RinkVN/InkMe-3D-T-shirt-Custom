const { Cart } = require("../models/cart");
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

router.get(`/`, async (req, res) => {
    try {
        const cartList = await Cart.find(req.query);

        if (!cartList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.post('/add', async (req, res) => {
    try {
        const cartItem = await Cart.find({ productId: req.body.productId, userId: req.body.userId });

        if (cartItem.length === 0) {
            // Calculate total quantity and subtotal from classifications
            const classifications = req.body.classifications || [];
            const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
            const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

            let cartList = new Cart({
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            });

            cartList = await cartList.save();
            res.status(201).json(cartList);
        } else {
            return res.status(401).json({
                message: "Sản phẩm đã có trong giỏ hàng",
                status: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Cart could not be created",
            success: false
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const cartItem = await Cart.find({ productId: req.body.productId, userId: req.body.userId });

        if (cartItem.length === 0) {
            // Calculate total quantity and subtotal from classifications
            const classifications = req.body.classifications || [];
            const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
            const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

            let cartList = new Cart({
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            });

            cartList = await cartList.save();
            res.status(201).json(cartList);
        } else {
            return res.status(401).json({
                message: "Sản phẩm đã có trong giỏ hàng",
                status: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Cart could not be created",
            success: false
        });
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false
            });
        }
        res.status(200).json({
            message: "Cart deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const classifications = req.body.classifications || [];

        // If no classifications remain, delete the cart item
        if (classifications.length === 0) {
            const deletedItem = await Cart.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({
                    message: "Cart item not found",
                    success: false
                });
            }
            return res.status(200).json({
                message: "Cart item deleted as no classifications remain",
                success: true
            });
        }

        // Calculate total quantity and subtotal from classifications
        const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
        const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

        const cartList = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            },
            { new: true }
        );

        if (!cartList) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false
            });
        }

        return res.status(200).send(cartList);
    } catch (error) {
        res.status(500).json({
            message: "Error updating cart item",
            success: false
        });
    }
});


module.exports = router;