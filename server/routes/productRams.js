const { ProductRams } = require("../models/productRams");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
    try {
        const productRamsList = await ProductRams.find();

        if (!productRamsList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productRamsList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get(`/:id`, async (req, res) => {

    const item = await ProductRams.findById(req.params.id);

    if (!item) {
        res.status(404).json({
            message: "Product Rams ID not found",
            success: false
        });
    }
    res.status(200).send(item);
});

router.post('/create', async (req, res) => {

    let productRams = new ProductRams({
        productRams: req.body.productRams
    });

    if (!productRams) {
        return res.status(500).json({ 
            success: false,
            error: "Product Weight could not be created"
        });
    }

    productRams = await productRams.save();

    res.status(201).json(productRams);

});

router.delete(`/:id`, async (req, res) => {

    const deletedItem = await ProductRams.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: "Product Weight ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Product Weight deleted successfully",
        success: true
    });
});

router.put(`/:id`, async (req, res) => {

    const item = await ProductRams.findByIdAndUpdate(
        req.params.id,
        {
            productRams: req.body.productRams
        },
        {
            new: true
        }
    );

    if (!item) {
        res.status(404).json({
            message: "Product Weight ID not found",
            success: false
        });
    }
    res.status(200).json(item);
});

module.exports = router;