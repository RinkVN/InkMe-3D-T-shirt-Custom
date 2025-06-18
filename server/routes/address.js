const express = require("express");
const router = express.Router();
const { Address } = require("../models/address");
const { User } = require("../models/user");

// Get all addresses of a user
router.get(`/user/:userId`, async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.params.userId });
        return res.status(200).send(addresses);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Add new address
router.post(`/`, async (req, res) => {
    try {
        const { userId, city, details, moreInfo } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        // If this is the first address, make it default
        const addressCount = await Address.countDocuments({ userId });
        const isDefault = addressCount === 0;

        const address = new Address({
            userId,
            city,
            details,
            moreInfo,
            isDefault
        });

        const savedAddress = await address.save();
        return res.status(201).json({
            message: "Address added successfully",
            address: savedAddress
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Update address
router.put(`/:id`, async (req, res) => {
    try {
        const { city, details, moreInfo } = req.body;

        const address = await Address.findByIdAndUpdate(
            req.params.id,
            {
                city,
                details,
                moreInfo
            },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        return res.status(200).json({
            message: "Address updated successfully",
            address: address
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Delete address
router.delete(`/:id`, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        // If this was the default address and there are other addresses,
        // make another address the default
        if (address.isDefault) {
            const anotherAddress = await Address.findOne({
                userId: address.userId,
                _id: { $ne: address._id }
            });
            if (anotherAddress) {
                anotherAddress.isDefault = true;
                await anotherAddress.save();
            }
        }

        await Address.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Address deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Set address as default
router.put(`/:id/set-default`, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        // Remove default from all other addresses of this user
        await Address.updateMany(
            { userId: address.userId },
            { isDefault: false }
        );

        // Set this address as default
        address.isDefault = true;
        await address.save();

        return res.status(200).json({
            message: "Address set as default successfully",
            address: address
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

module.exports = router; 