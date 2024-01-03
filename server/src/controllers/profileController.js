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

      const updateFields = {};

      if (req.body && req.body.others) {
        updateFields.$set = {
          'others.about': req.body.others.about,
          'others.company': req.body.others.company,
          'others.job': req.body.others.job,
          'others.country': req.body.others.country,
          'others.address': req.body.others.address,
          'others.phone': req.body.others.phone,
          'others.twitter': req.body.others.twitter,
          'others.facebook': req.body.others.facebook,
          'others.instagram': req.body.others.instagram,
          'others.linkedin': req.body.others.linkedin,
        };
      }

      if (req.file) {
        updateFields.profile_image = req.file.filename;
      }

      const user = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators:true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = profileController;
