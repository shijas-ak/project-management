const nodemailer = require("nodemailer");
require('dotenv').config()

const sendWelcomeEmail = (user, password) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.USER_EMAIL,
      pass:process.env.USEREMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to:  `${user.email}`,
    subject: `Welcome ${user.firstname} as Project Manager`,
    text: `Welcome Mr. ${user.firstname} as the Project Manager of Nuox Technologies.Your registration is successfully completed, and here are your login details:\n\nUsername: ${user.username}\nPassword: ${password}\n\nThank you for joining us!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    }
  });
};


const sendSuccessEmail = async (user, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL, 
        pass: process.env.USEREMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL, 
      to: `${user.email}`,
      subject: `Welcome ${user.firstname}`,
      text: `Welcome ${user.firstname}!\n\nYour registration is successful.\n\nThank you for joining us!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email : ${error.message}`);
  }
};


const generateOTP = () => {
  
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = (user, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USEREMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user,
    subject: 'Password Reset OTP',
    text: `Your one-time password (OTP) for password reset is: ${otp}. This OTP is valid for a short period. Do not share it with anyone.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    }
  });
};

module.exports = {sendWelcomeEmail, sendSuccessEmail ,generateOTP,sendOTPEmail};


