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
    about:{
      type:String,
    } ,
    company:{
      type:String,
    },
    job:{
      type:String,
    },
    country:{
      type:String,
    },
    address:{
      type:String,
    },
    phone:{
      type:String,
    },
    twitter:{
      type:String,
    },
    facebook:{
      type:String,
    },
    instagram:{
      type:String,
    },
    linkedin:{
      type:String,
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
