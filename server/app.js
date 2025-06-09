const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helper/jwt");
const path = require("path");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(authJwt());

//Routes
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/categories");
const subCatRoutes = require("./routes/subCat");
const productRoutes = require("./routes/products");
const imageUploadRoutes = require("./helper/imageUpload");
const productSizeRoutes = require("./routes/productSize");
const productRamsRoutes = require("./routes/productRams");
const productReviewsRoutes = require("./routes/productReviews");
const cart = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orders");
const homeBannerRouters = require("./routes/homeBanner");
const searchRoutes = require("./routes/search");
const aiRoutes = require("./routes/ai");

app.use(`/api/user`, userRoutes);
app.use(`/uploads`, express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/productSize`, productSizeRoutes);
app.use(`/api/productRams`, productRamsRoutes);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/cart`, cart);
app.use("/payment", paymentRoutes);
app.use(`/api/orders`, orderRoutes);
app.use(`/api/homeBanner`, homeBannerRouters);
app.use(`/api/search`, searchRoutes);
app.use(`/api/ai`, aiRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));
// Chuyển tất cả các yêu cầu không khớp về index.html của React
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
    //Server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running http://localhost:${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(err);
})

