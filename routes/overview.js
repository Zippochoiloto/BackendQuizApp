const express = require("express");
const { db } = require("../model/db");
const OverviewRouter = express.Router();

OverviewRouter.get("/", async (req, res) => {
    try {
        let data = {};
        data.totalQuizes = await db.Quiz.find({}).count()
        data.totalUsers = await db.User.find({}).count();
        data.totalAdmins = await db.Admin.find({}).count();
        data.totalCategories = await db.Categories.find({}).count();
      
    res.status(200);
    res.json(data);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
})

OverviewRouter.get("/top-category", async (req, res) => {
  try {
    let data = {};
    let array = await db.Categories.aggregate([
      {
        $lookup: {
          from: "Quiz",
          localField: "_id",
          foreignField: "categoryId",
          as: "questions",
        },
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          cate: "$_id",
          count: "$count",
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $skip: 0
      }, 
      {
        $limit: 4
      }
    ]).toArray();
    

    res.status(200);
    res.json(array);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
});

module.exports = OverviewRouter;
