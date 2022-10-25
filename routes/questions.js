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

QuesRoute.get("/:idCate", async function (req, res, next) {
  try {
    const questions = await db.Quiz.aggregate([
      {
        $match: {categoryId:new ObjectId(req.params.idCate)}
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
