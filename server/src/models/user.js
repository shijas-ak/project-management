const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profile_image: {
    type: String,
    default:'/images/default_DP.png',
  },
  role: {
    type: String,
    default: "user",
  },
  isApproved:{
    type : Boolean,
    default: false,
  },
  others: {
    about: String,
    company: String,
    job: String,
    country: String,
    address: String,
    phone: String,
    twitter: String,
    facebook: String,
    instagram: String,
    linkedin: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
