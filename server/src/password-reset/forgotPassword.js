const express = require("express");
const router = express.Router();
const OTP = require("../models/otp");
const User = require("../models/user");
const { generateOTP, sendOTPEmail } = require("../services/mailService");


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpRecord = new OTP({
      user: user._id,
      otp,
    });

    await otpRecord.save();

    sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ status: 200, message: "OTP sent successfully", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpRecord = new OTP({
      user: user._id,
      otp,
    });

    await otpRecord.save();

    sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ status: 200, message: "OTP resent successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
