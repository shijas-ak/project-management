const User = require("../models/user");

const profileController = {
  getProfileById: async (req, res) => {
    try {
      const userId = req.params.Id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userProfileData = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile_image: user.profile_image,
        username: user.username,
        ...user.others,
      };

      res.status(200).json({ userId, user: userProfileData });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateProfileById: async (req, res) => {
    try {
      const userId = req.params.Id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { firstname, lastname, email, username, ...others } = req.body;

      let profile_image = req.file;

      if (req.file) {
        profile_image = "/images/" + req.file.filename;
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            profile_image: profile_image,
            "others.about": others.about,
            "others.company": others.company,
            "others.job": others.job,
            "others.country": others.country,
            "others.address": others.address,
            "others.phone": others.phone,
            "others.twitter": others.twitter,
            "others.facebook": others.facebook,
            "others.instagram": others.instagram,
            "others.linkedin": others.linkedin,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        updatedUser: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = profileController;
