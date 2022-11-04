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
      message: "Missing email or username or password or nickname",
    });

  try {
    let user = await db.Users.findOne({ username });
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

    const newUser = await db.Users.insertOne({
      email,
      username,
      password: newpassword,
    });
    const accessToken = jwt.sign({ userId: newUser.insertedId }, "sha");
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
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
    const user = await db.Users.findOne({ email });
    if (!user)
      res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });

    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword)
      res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });

    const accessToken = jwt.sign({ userId: user["_id"] }, "sha");
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
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
    topWinner = await db.User.find({}).skip(0).limit(10).sort({ score: -1 }).toArray();
    
    res.status(200);
    res.json(topWinner);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});


module.exports = UserRouter;
