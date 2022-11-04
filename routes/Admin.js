const express = require("express");
const { db } = require("../model/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const AdminRouter = express.Router();

AdminRouter.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing email or username or password or nickname",
    });

  try {
    let admin = await db.Admin.findOne({ admin });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const newpassword = await bcrypt.hash(password, 10);

    const newUser = await db.Admin.insertOne({
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
module.exports = AdminRouter