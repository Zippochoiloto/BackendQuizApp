const express = require("express");
const { db } = require("../model/db");
const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const level = req.headers.level;
    const name = req.headers.name;
    let category;
    let query = {};
    if (level) {
      query["level"] = level;
    }
    if (name) {
      query["name"] = name;
    }
    category = await db.Categories.find(query)
      .sort({ interested: -1 })
      .toArray();
    res.status(200);
    res.json(category);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
});

categoryRouter.get("/quiz", async (req, res) => {
  try {
    const name = req.headers.name;
    let quiz;
    if (name) {
      array = await db.Categories.aggregate([
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

      quiz = array.map((item) => {
        return item.questions 
      })
    } else {
      quiz = await db.Quiz.find({}).sort({ order: 1 }).toArray();
    }

    res.status(200);
    res.json(quiz);
  } catch (error) {
    res.status(500);
    res.send("Something went wrong!");
  }
});

module.exports = categoryRouter;
