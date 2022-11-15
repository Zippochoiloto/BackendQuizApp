const express = require("express");
const { db } = require("../model/db");
const OverviewRouter = express.Router();

OverviewRouter.get("/", async (req, res) => {
    try {
        let data = {};
        let totalQuizes;
        totalQuizes = await db.Quiz.find({}).toArray().length;
        data.totalUsers = await db.User.find({}).toArray().length;
        data.totalAdmins = await db.Admin.find({}).toArray().length;
        data.totalCategories = await db.Categories.find({}).toArray().length;
    res.status(200);
    res.json(totalQuizes);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
})

module.exports = OverviewRouter;
