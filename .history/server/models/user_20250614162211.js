const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: [
    {
      city: {
        type: String,
        default: "",
      },
      details: {
        type: String,
        default: "",
      },
      moreInfo: {
        type: String,
        default: "",
      },
    },
  ],

  images: [
    {
      type: String,
      required: true,
    },
  ],
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "locked"],
    default: "inactive", // hoặc giá trị mặc định tùy ý bạn
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
