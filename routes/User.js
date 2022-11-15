const express = require("express");
const { db } = require("../model/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { application } = require("express");
const { ObjectId } = require("mongodb");
const UserRouter = express.Router();

UserRouter.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing email or username or password or username",
    });

  try {
    let user = await db.User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const newpassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.insertOne({
      email,
      username,
      password: newpassword,
    });
    const accessToken = jwt.sign({ userId: newUser.insertedId }, "sha");
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

UserRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Missing email or password ",
    });

  try {
    const user = await db.User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });

    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });

    const accessToken = jwt.sign({ userId: user["_id"] }, "sha");
    return res.json({ success: true, accessToken });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

UserRouter.get("/profile", async (req, res) => {
  try {
    const id = req.headers.id;
    let user;
    if (id) {
      user = await db.User.findOne({
        _id: new ObjectId(id),
      });
    } else {
      user = await db.User.find({}).toArray();
    }
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

UserRouter.get("/top-winner", async (req, res) => {
  try {
    let topWinner;
    topWinner = await db.User.find({})
      .skip(0)
      .limit(10)
      .sort({ score: -1 })
      .toArray();

    res.status(200);
    res.json(topWinner);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

module.exports = UserRouter;
