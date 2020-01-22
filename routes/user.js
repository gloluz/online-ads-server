const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

const router = express.Router();

//Create Sign Up:
router.post("/user/sign_up", async (req, res) => {
  try {
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);

    const user = new User({
      token: token,
      salt: salt,
      hash: hash,
      email: req.fields.email,
      account: {
        username: req.fields.username,
        phone: req.fields.phone
      }
    });

    const alreadyExistingEmail = await User.findOne({
      email: req.fields.email
    });

    if (req.fields.username && req.fields.email && req.fields.password) {
      if (!alreadyExistingEmail) {
        await user.save();

        return res.json({
          _id: user._id,
          token: user.token,
          account: {
            username: user.account.username,
            phone: user.account.phone
          }
        });
      } else {
        return res.status(400).json({ message: "Already existing email" });
      }
    } else {
      return res.status(400).json({ message: "Missing parameter(s)" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Log In:
router.post("/user/log_in", async (req, res) => {
  try {
    const userLogInEmail = await User.findOne({ email: req.fields.email });

    if (userLogInEmail) {
      if (
        SHA256(req.fields.password + userLogInEmail.salt).toString(
          encBase64
        ) === userLogInEmail.hash
      ) {
        return res.json({
          _id: userLogInEmail._id,
          token: userLogInEmail.token,
          account: userLogInEmail.account
        });
      } else {
        return res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
