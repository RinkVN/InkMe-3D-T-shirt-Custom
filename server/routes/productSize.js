const { ProductSize } = require("../models/productSize");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
    try {
        const productSizeList = await ProductSize.find();

        if (!productSizeList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productSizeList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get(`/:id`, async (req, res) => {

    const item = await ProductSize.findById(req.params.id);

    if (!item) {
        res.status(404).json({
            message: "Product Rams ID not found",
            success: false
        });
    }
    res.status(200).send(item);
});

router.post('/create', async (req, res) => {

    let productSize = new ProductSize({
        productSize: req.body.productSize
    });

    if (!productSize) {
        return res.status(500).json({ 
            success: false,
            error: "Product Weight could not be created"
        });
    }

    productSize = await productSize.save();

    res.status(201).json(productSize);

});

router.delete(`/:id`, async (req, res) => {

    const deletedItem = await ProductSize.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: "Product Size ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Product Size deleted successfully",
        success: true
    });
});

router.put(`/:id`, async (req, res) => {

    const item = await ProductSize.findByIdAndUpdate(
        req.params.id,
        {
            productSize: req.body.productSize
        },
        {
            new: true
        }
    );

    if (!item) {
        res.status(404).json({
            message: "Product Size ID not found",
            success: false
        });
    }
    res.status(200).json(item);
});

module.exports = router;