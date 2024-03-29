const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
require("dotenv").config();
const {
  sendWelcomeEmail,
  sendSuccessEmail,
} = require("../services/mailService.js");
const User = require("../models/user");

const authController = {
  register: async (req, res) => {
    try {
      const {
        firstname,
        email,
        username,
        password,
        role,
        isApproved,
      } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email or username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstname,
        email,
        username,
        password: hashedPassword,
        role,
        isApproved,
      });

      await newUser.save();

      if (role === "PM") {
        sendWelcomeEmail(newUser, password);
      } else {
        sendSuccessEmail(newUser);
      }

      res.status(200).json({
        message: "User registered successfully",
        status: 200,
        newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      if (user.isApproved === false) {
        return res
          .status(401)
          .json({
            message:
              "You are not approved yet.Please contact the administrator",
          });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Login successful",
        status: 200,
        token,
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
