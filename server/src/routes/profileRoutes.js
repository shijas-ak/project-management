const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profileController')
const authentication = require("../middleware/authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images")); 
  },
  filename: (req, file, cb) => {
    cb(null, "profile_image_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get('/users-profile/:Id', authentication.verifyToken, profileController.getProfileById);
router.patch('/users-profile/:Id', authentication.verifyToken,upload.single('profile_image'), profileController.updateProfileById);

module.exports = router;
