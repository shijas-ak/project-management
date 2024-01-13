const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const assignRoutes = require("./src/routes/assignRoutes");
const forgotPasswordRoute = require("./src/password-reset/forgotPassword");
const resetPasswordRoute = require("./src/password-reset/resetPassword");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/images", express.static("./public/images"));
app.use(authRoutes);
app.use("/projects", projectRoutes);
app.use(taskRoutes);
app.use(assignRoutes);
app.use(forgotPasswordRoute);
app.use(resetPasswordRoute);
app.use("/users-profile", profileRoutes);

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
