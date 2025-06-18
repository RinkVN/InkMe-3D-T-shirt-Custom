const { User } = require("../models/user");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const {
  sendEmailVerification,
  sendEmailResetPassword,
} = require("../config/EmailServices");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  console.log("userid", userid);
  return payload;
}

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
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
});

const upload = multer({
  storage: storage,
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

      const img = await cloudinary.uploader.upload(
        req.files[i].path,
        options,
        function (error, result) {
          imagesArray.push(result.secure_url);
          fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }
      );
    }

    let imagesUploaded = new ImageUpload({
      images: imagesArray,
    });

    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArray);
  } catch (err) {
    console.log(err);
  }
});

// ------------ img upload

router.post(`/signup`, async (req, res) => {
  const { name, phone, email, password, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    const existingUserByPhone = await User.findOne({ phone: phone });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists" });
    }
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ error: true, message: "Phone already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    //create token verify
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await User.create({
      name: name,
      phone: phone,
      email: email,
      password: hashPassword,
      isAdmin: isAdmin,
      verificationToken,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    //create link user click when verify
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/user/signup/verify/${verificationToken}`;
    //call function send email verification
    await sendEmailVerification(name, email, verificationLink);

    res.status(200).json({
      message:
        "Đăng kí tài khoản thành công, vui lòng kiểm tra mail để xác minh tài khoản",
      user: result,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message,
    });
  }
});

router.get(`/signup/verify/:token`, async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    //check user token
    if (!user) {
      return res.status(400).json({ message: "Token is not valid!" });
    }

    //verify user
    user.status = "active";
    user.isVerified = true;
    user.verificationToken = null;

    await user.save();
    return res.json({
      message: "Tài khoản đã được xác minh thành công, bạn có thể đăng nhập",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(`/signin`, async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(500).json({ error: true, message: "User not found" });
    }

    if (existingUser.isVerified == false) {
      return res.status(400).json({
        error: true,
        message:
          "Account was not verified. Please check your mail to verified your account.",
      });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    res.status(200).json({
      user: existingUser,
      token: token,
      msg: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.post(`/google-auth`, async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verify(token);
    const { email, name, picture } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      const result = await User.create({
        name: name,
        email: email,
        password: null,
        images: [picture],
        isAdmin: false,
        status: "active",
      });

      const tokenReturn = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY
      );

      res.status(200).send({
        user: result,
        token: tokenReturn,
        msg: "Login successful",
      });
    } else {
      user.name = name;
      user.images = [picture];
      await user.save();
      const tokenReturn = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY
      );
      res.status(200).send({
        user,
        token: tokenReturn,
        msg: "Login successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message,
    });
  }
});

// router.post(`/authWithGoogle`, async (req, res) => {
//   const { name, phone, email, password, images, isAdmin } = req.body;
//   try {
//     const existingUser = await User.findOne({ email: email });

//     if (!existingUser) {
//       const result = await User.create({
//         name: name,
//         phone: phone,
//         email: email,
//         password: null,
//         images: images,
//         isAdmin: isAdmin,
//       });

//       const token = jwt.sign(
//         { email: result.email, id: result._id },
//         process.env.JSON_WEB_TOKEN_SECRET_KEY
//       );

//       res.status(200).send({
//         user: result,
//         token: token,
//         msg: "Login successful",
//       });
//     } else {
//       const existingUser = await User.findOne({ email: email });
//       const token = jwt.sign(
//         { email: existingUser.email, id: existingUser._id },
//         process.env.JSON_WEB_TOKEN_SECRET_KEY
//       );
//       res.status(200).send({
//         user: existingUser,
//         token: token,
//         msg: "Login successful",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ error: true, message: "Something went wrong" });
//     console.log(error);
//   }
// });

router.post(`/forgot-password`, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Email was not register in shop" });
    }
    //create token verify
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    await user.save();
    //create link user click when verify
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    //call function send email verification
    await sendEmailResetPassword(email, resetLink);

    res.status(200).json({
      message: "Send mail reset password successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Token is not valid" });
    }

    //create new hash password
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    //delete reset token after use
    user.resetToken = null;
    await user.save();

    return res.status(200).json({
      message: "Password is reseted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Lỗi máy chủ",
      notify: error.message,
    });
  }
});

router.put(`/changePassword/:id`, async (req, res) => {
  try {
    const { password, newPass } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Current password is incorrect" });
    } else {
      let newPassword;

      if (newPass) {
        newPassword = bcrypt.hashSync(newPass, 10);
      } else {
        newPassword = existingUser.hashPassword;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          password: newPassword,
        },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).send({ message: "User ID not found" });
      }

      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find();

    if (!userList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).send(userList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(500).json({
        message: "User ID not found",
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    User.findByIdAndDelete(req.params.id).then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User ID not found",
          success: false,
        });
      }
      res.status(200).json({
        message: "User deleted successfully",
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const userCount = await User.countDocuments((count) => count);

    if (!userCount) {
      res.status(500).json({ success: false });
    }

    return res.status(200).send({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    const userExist = await User.findById(req.params.id);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        phone: phone,
        email: email,
        images: imagesArray,
        address,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).send({ message: "User ID not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.put(`/:id`, async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        const userExist = await User.findById(req.params.id);
        let newPassword
        if(req.body.password){
            newPassword = await bcrypt.hash(password, 10);
        }else{
            newPassword = userExist.hashPassword;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                images: imagesArray,
                password: newPassword
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).send({ message: "User ID not found" });
        }

        return res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Routes for address management
router.post(`/:id/address`, async (req, res) => {
  try {
    const { city, details, moreInfo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    user.address.push({
      city,
      details,
      moreInfo
    });

    await user.save();

    return res.status(200).json({
      message: "Address added successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message
    });
  }
});

router.put(`/:id/address/:addressId`, async (req, res) => {
  try {
    const { city, details, moreInfo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const address = user.address.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: true, message: "Address not found" });
    }

    address.city = city;
    address.details = details;
    address.moreInfo = moreInfo;

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message
    });
  }
});

router.delete(`/:id/address/:addressId`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const address = user.address.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: true, message: "Address not found" });
    }

    address.remove();
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      user: user
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
