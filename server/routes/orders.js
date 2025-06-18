const { Orders } = require("../models/orders");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await Orders.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Không có dữ liệu" });
        }

        const ordersList = await Orders.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            ordersList: ordersList,
            totalPages: totalPages,
            page: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post(`/create`, async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            city,
            address,
            note,
            amount,
            products,
            orderId,
            userId,
            language,
            orderType,
            orderDescription,
            status = "Success",
        } = req.body;

        // Validate userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Validate products
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products array is required and cannot be empty",
            });
        }

        // Validate classifications within products
        products.forEach(product => {
            if (product.classifications) {
                product.classifications.forEach(cls => {
                    if (!cls._id || !cls.name || !cls.image || typeof cls.price !== 'number' || typeof cls.quantity !== 'number' || typeof cls.subTotal !== 'number') {
                        throw new Error("Invalid classification data");
                    }
                });
            }
        });

        // Optionally validate address against user's saved addresses
        if (city && address) {
            const userAddress = user.address.find(
                (addr) =>
                    addr.city === city &&
                    `${addr.details}${addr.moreInfo ? `, ${addr.moreInfo}` : ""}` === address
            );
            if (!userAddress) {
                console.warn("Provided address does not match user's saved addresses");
            }
        }

        const order = new Orders({
            fullname,
            email,
            phoneNumber,
            city,
            address,
            note,
            amount,
            products,
            orderId,
            userId,
            language,
            orderType,
            orderDescription,
            status: status || "Pending",
        });

        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Order could not be created",
            details: error.message,
        });
    }
});

router.get(`/:id`, async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order ID not found" });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { products } = req.body;

        // Validate products if provided
        if (products) {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Products array is required and cannot be empty",
                });
            }
            products.forEach(product => {
                if (product.classifications) {
                    product.classifications.forEach(cls => {
                        if (!cls._id || !cls.name || !cls.image || typeof cls.price !== 'number' || typeof cls.quantity !== 'number' || typeof cls.subTotal !== 'number') {
                            throw new Error("Invalid classification data");
                        }
                    });
                }
            });
        }

        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                fullname: req.body.fullname,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                city: req.body.city,
                address: req.body.address,
                note: req.body.note,
                amount: req.body.amount,
                products: req.body.products,
                orderId: req.body.orderId,
                userId: req.body.userId,
                language: req.body.language,
                orderType: req.body.orderType,
                orderDescription: req.body.orderDescription,
                status: req.body.status,
            },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post(`/order/create`, async (req, res, formData) => {
    try {
        res.status(200).json(formData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;