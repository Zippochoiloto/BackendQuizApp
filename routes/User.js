const express = require("express");
const { db } = require("../model/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { application } = require("express");
const { ObjectId } = require("mongodb");
const UserRouter = express.Router();

UserRouter.get("/profile", async (req, res) => {
  try {
    const id = req.headers.id;
    let user;
    let admin;
    if (id) {
      user = await db.User.findOne({
        _id: new ObjectId(id),
      })
      if (user) {
        delete user.password
        delete user._id
      } else if (!user) {
        admin = await db.Admin.findOne({
          _id: new ObjectId(id),
        });
        if (admin) {
          delete admin.password;
          delete admin._id;
        }
      }
    } else {
      if (req.userRole === "admin") {
        user = await db.User.find({}).toArray();
        // delete user.password;
        // delete user._id;
      }
    }
    res.status(200);
    res.json(user || admin);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
});

UserRouter.get("/top-winner", async (req, res) => {
  try {
    let topWinner;
    topWinner = await db.User.find({})
      .skip(0)
      .sort({ score: -1 })
      .limit(10)
      .toArray();

    res.status(200);
    res.json(topWinner);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

module.exports = UserRouter;
