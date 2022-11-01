const express = require("express");
const { db } = require("../model/db");
const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const level = req.headers.level;
    const name = req.headers.name;
    // const interested = req.headers.interested;
    let category;
    // if (name) {
    //   category = await db.Categories.find({
    //     name,
    //   })
    //     .sort({ interested: -1 })
    //     .toArray();
    // } else if (level) {
    //   category = await db.Categories.find({
    //     level,
    //   })
    //     .sort({ interested: -1 })
    //     .toArray();
    // } else if (interested) {
    //   // let interestedString = interested.toString()
    //   let interestedBool = interested === "true";
    //   category = await db.Categories.find({
    //     interested: interestedBool,
    //   }).toArray();
    // } else {
    //   category = await db.Categories.find({})
    //     .sort({ interested: -1 })
    //     .toArray();
    // }
    let query = {};
    // const sort = {}
    if (level) {
      query["level"] = level;
    }
    if (name) {
      query["name"] = name;
    }
    // if (interested) sort(interested) = 1
    category = await db.todos.find(query).sort({ interested: -1 }).toArray();
    res.status(201);
    res.json(category);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

categoryRouter.get("/quiz", async (req, res) => {
  try {
    const name = req.headers.name;
    let quiz;
    if (name) {
      quiz = await db.Categories.aggregate([
        {
          $match: { name },
        },
        {
          $lookup: {
            from: "Quiz",
            localField: "_id",
            foreignField: "categoryId",
            as: "questions",
          },
        },
        {
          $unwind: {
            path: "$questions",
          },
        },
        {
          $project: {
            _id: 0,
            questions: 1,
          },
        },
      ]).toArray();
    } else {
      quiz = await db.Quiz.find({}).sort({ order: 1 }).toArray();
    }

    res.status(201);
    res.json(quiz);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

module.exports = categoryRouter;
