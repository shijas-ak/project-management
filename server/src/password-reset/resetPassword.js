const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const OTP = require("../models/otp");
const User = require("../models/user");

router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestOTP = await OTP.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    if (!latestOTP || latestOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({
      status: 200,
      message: "OTP verified successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res
      .status(200)
      .json({ status: 200, message: "Password reset successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
