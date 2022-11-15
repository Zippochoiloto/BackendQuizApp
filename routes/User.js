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
