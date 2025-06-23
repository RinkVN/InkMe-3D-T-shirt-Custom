const { Category } = require("../models/category");
const { Product } = require("../models/products");
const { RecentlyProducts } = require("../models/recentlyProducts");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// ------------ img upload

var imagesArray = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
})

const upload = multer({
    storage: storage
});

router.post(`/upload`, upload.array("images"), async (req, res) => {

    imagesArray = [];

    try {
        for (let i = 0; i < req.files.length; i++) {

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const img = await cloudinary.uploader.upload(req.files[i].path, options, function (error, result) {
                imagesArray.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`);
            });
        }

        let imagesUploaded = new ImageUpload({
            images: imagesArray
        });

        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArray);

    }
    catch (err) {
        console.log(err);
    }

});

// ------------ img upload


router.get(`/`, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const totalPosts = await Product.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);
        const sort = req.query.sort || 'menu_order'; // Mặc định sắp xếp theo menu_order

        // Xác định tiêu chí sắp xếp
        let sortOption = {};
        switch (sort) {
            case 'menu_order':
                sortOption = { _id: 1 }; // Sắp xếp mặc định theo _id
                break;
            case 'popularity':
                sortOption = { quantitySold: -1 }; // Bán nhiều nhất trước
                break;
            case 'rating':
                sortOption = { rating: -1 }; // Đánh giá cao nhất trước
                break;
            case 'date':
                sortOption = { dateCreated: -1 }; // Mới nhất trước
                break;
            case 'price':
                sortOption = { price: 1 }; // Giá thấp đến cao
                break;
            case 'price-desc':
                sortOption = { price: -1 }; // Giá cao đến thấp
                break;
            case 'discount':
                sortOption = { discount: -1 }; // Giảm giá cao nhất trước
                break;
            case 'stock':
                sortOption = { countInStock: -1 }; // Tồn kho nhiều nhất trước
                break;
            default:
                sortOption = { _id: 1 }; // Mặc định
        }

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        let productList = [];

        if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined) {
            productList = await Product.find({ subCatId: req.query.subCatId }).populate("category subCat").sort(sortOption);

            const filteredProducts = productList.filter(product => {
                if (req.query.minPrice && product.oldPrice < parseInt(+req.query.minPrice)) {
                    return false;
                }
                if (req.query.maxPrice && product.oldPrice > parseInt(+req.query.maxPrice)) {
                    return false;
                }
                return true;
            });

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": filteredProducts,
                "totalPages": totalPages,
                "page": page
            });

        } else if (req.query.page !== undefined && req.query.perPage !== undefined) {

            productList = await Product.find(req.query).populate("category subCat").skip((page - 1) * perPage).sort(sortOption).limit(perPage).exec();

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": productList,
                "totalPages": totalPages,
                "page": page
            });
        } else {
            productList = await Product.find(req.query).populate("category subCat").sort(sortOption);

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": productList,
                "totalPages": totalPages,
                "page": page
            });
        }

    } catch (error) {
        res.status(500).json({ success: false });
    }
});



router.get(`/featured`, async (req, res) => {
    const productList = await Product.find({ isFeatured: true });

    if (!productList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json(productList);

});



router.post(`/create`, async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).send("Invalid Category");
    }

    const images_array = [];
    const uploadedImages = await ImageUpload.find();

    const images_Arr = uploadedImages?.map((item) => {
        item.images.map((image) => {
            images_array.push(image);
        })
    })
    images_Arr();

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: images_array,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        subCatId: req.body.subCatId,
        category: req.body.category,
        discount: req.body.discount,
        subCat: req.body.subCat,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        // numReviews: req.body.numReviews,
        productRams: req.body.productRams,
        productSize: req.body.productSize,
        productWeight: req.body.productWeight,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();
    if (!product) {
        res.status(500).json({
            error: "Product could not be created",
            success: false
        })

    }

    imagesArray = [];

    return res.status(201).json(product);
});

router.get(`/recentlyProducts`, async (req, res) => {
    let productList = [];
    productList = await RecentlyProducts.find(req.query).populate("category subCat");
    if (!productList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json(productList);
});

router.post(`/recentlyProducts`, async (req, res) => {
    try {
        let findProduct = await RecentlyProducts.findOne({ prodId: req.body.id });

        var product;

        if (!findProduct) {
            product = new RecentlyProducts({
                prodId: req.body.id,
                name: req.body.name,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catName: req.body.catName,
                subCatId: req.body.subCatId,
                category: req.body.category,
                discount: req.body.discount,
                subCat: req.body.subCat,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                productRams: req.body.productRams,
                productSize: req.body.productSize,
                productWeight: req.body.productWeight,
                isFeatured: req.body.isFeatured,
            });

            product = await product.save();
            return res.status(201).json(product);
        }

        return res.status(200).json({ message: "Product already exists", product: findProduct });
    } catch (error) {
        return res.status(500).json({ error: error.message, success: false });
    }
});


router.get(`/:id`, async (req, res) => {

    const productEditId = req.params.id;

    try {
        const product = await Product.findById(productEditId).populate("category subCat");

        if (!product) {
            return res.status(500).json({ message: "Product ID not found" });  // Dừng xử lý ngay tại đây
        }

        return res.status(200).send(product);  // Gửi phản hồi nếu tìm thấy sản phẩm
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});


router.delete(`/deleteImage`, async (req, res) => {

    const imgUrl = req.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    const response = cloudinary.uploader.destroy(imageName, (error, result) => {

    });

    if (response) {
        res.status(200).send(response);
    }

});

router.delete(`/:id`, async (req, res) => {

    const product = await Product.findById(req.params.id);
    const images = product.images;

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if (imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {

            });
        }
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
        res.status(404).json({
            message: "Product ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Product deleted successfully",
        success: true
    });

});


router.put(`/:id`, async (req, res) => {

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            discount: req.body.discount,
            catName: req.body.catName,
            subCatId: req.body.subCatId,
            category: req.body.category,
            subCat: req.body.subCat,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            productRams: req.body.productRams,
            productSize: req.body.productSize,
            productWeight: req.body.productWeight,
            isFeatured: req.body.isFeatured
        },
        {
            new: true
        }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            status: false
        });
    }

    res.status(200).send({
        message: "Product updated successfully",
        status: true
    });
});

router.get('/category/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const products = await Product.find({ category: categoryId }).populate('category subCat');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router