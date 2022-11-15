const express = require("express");
const { ObjectId } = require("mongodb");
const QuesRoute = express.Router();
const { db } = require("../model/db");

QuesRoute.get("/", async function (req, res, next) {
  try {
    const questions = await db.Quiz.aggregate([
      {
        $lookup: {
          from: "Answer",
          localField: "answers",
          foreignField: "_id",
          as: "answers",
        },
      },
    ]).toArray();
    res.json({ data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

QuesRoute.get("/total", async function (req, res) {
  let TotalAnwer = 0;
  let averageTime = 0;
  try {
    const questions = await db.Quiz.find().toArray();
    for (let i = 0; i < questions.length; i++) {
      TotalAnwer += questions[i].answers.length;
      let second = questions[i].duration.split("s")[0];
      averageTime += Number(second);
    }
    averageTime /= questions.length;

    res
      .status(200)
      .json({
        data: { TotalQuiz: questions.length, TotalAnswer: TotalAnwer, averageTime : averageTime },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

QuesRoute.get("/:idCate", async function (req, res, next) {
  try {
    const questions = await db.Quiz.aggregate([
      {
        $match: { categoryId: new ObjectId(req.params.idCate) },
      },
      {
        $lookup: {
          from: "Answer",
          localField: "answers",
          foreignField: "_id",
          as: "answers",
        },
      },
    ]).toArray();
    res.json({ data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = QuesRoute;
