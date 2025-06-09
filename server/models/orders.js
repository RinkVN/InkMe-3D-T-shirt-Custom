const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    orderDescription: {
        type: String,
        required: true,
    },
    orderType: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: "",
    },
    products: [
        {
            productId: { type: String },
            productTitle: { type: String },
            quantity: { type: Number },
            images: [{ type: String }],
            price: { type: Number },
            subTotal: { type: Number },
            classifications: [
                {
                    _id: { type: String },
                    name: { type: String },
                    image: { type: String },
                    price: { type: Number },
                    quantity: { type: Number },
                    subTotal: { type: Number }
                }
            ]
        }
    ],
    status: {
        type: String,
        default: "Pending",
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

ordersSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

ordersSchema.set("toJSON", {
    virtuals: true,
});

exports.Orders = mongoose.model("Orders", ordersSchema);
exports.ordersSchema = ordersSchema;