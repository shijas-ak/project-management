  const jwt = require("jsonwebtoken");
  const User = require("../models/user");

  module.exports.verifyToken = async function (req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error("Error during token verification:", err.message);
      res.status(401).json({ message: "Invalid token" });
    }
  };

  module.exports.verifyTokenForAdminAndPM = (req, res, next) => {
    try {
      this.verifyToken(req, res, () => {
        if (req.user.role == 'admin' || req.user.role == 'PM') {
          next();
        } else {
          res.status(403).json("You are not allowed to do that! ONLY ADMIN and PROJECT MANAGER CAN");
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error Occurred In verifyTokenForAdminAndPM' });
    }
  };

  module.exports.verifyTokenAndAdmin = (req, res, next) => {
    try {
      this.verifyToken(req, res, () => {
        if (req.user.role == 'admin') {
          next();
        } else {
          res.status(403).json("You are not allowed to do that! ONLY ADMIN CAN");
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error Occurred In verifyTokenAndAdmin' });
    }
  };

  module.exports.verifyTokenAndUser = (req, res, next) => {
    try {
      this.verifyToken(req, res, () => {
        if (req.user.role == 'user') {
          next();
        } else {
          res.status(403).json("You are not allowed to do that! ONLY USER CAN");
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error Occurred In verifyTokenAndUser' });
    }
  };