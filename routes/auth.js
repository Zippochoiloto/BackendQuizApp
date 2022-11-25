const express = require("express");
const { db } = require("../model/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { application } = require("express");
const { ObjectId } = require("mongodb");
const AuthRouter = express.Router();
const jwtKey = require("../model/key")

AuthRouter.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing email or username or password",
    });

  try {
    let user = await db.User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    // user = await db.Users.findOne({ nickname });
    // if (user) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Nickname already taken" });
    // }

    const newpassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.insertOne({
      email,
      username,
      password: newpassword,
      score: +0,
      avt: "", 
    });
    const accessToken = jwt.sign({ userId: newUser.insertedId }, jwtKey);
    res.json({ success: true});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

AuthRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const msgBody = req.body
  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Missing email or password ",
    });

  try {
    const user = await db.User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    let checkPassword = await bcrypt.compare(password, user.password);
    
    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const accessToken = jwt.sign( msgBody, jwtKey);
    const userId = user._id
    return res.json({ success: true, accessToken, userId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = AuthRouter;