const express = require("express");
const { ObjectId } = require("mongodb");
const SessionRoute = express.Router();
const { db } = require("../model/db");

SessionRoute.get("/", async function (req, res) {
  try {
    const session = await db.Session.find().toArray();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

SessionRoute.get("/trending", async function (req, res) {
  try {
    let TotalAnwer = 0;
    let TotalQuestioned = 0;
    let averageTime = 0;
    let totalUser = [];
    const questions = await db.Quiz.find().toArray();
    const session = await db.Session.find().toArray();
    for (let i = 0; i < questions.length; i++)
      TotalAnwer += questions[i].answers.length;

    for (let i = 0; i < session.length; i++) {
      TotalQuestioned += session[i].questionID.length;
      averageTime += session[i].answer_time;
      totalUser.push(session[i].user_id);
    }
    averageTime /= session.length;

    res.status(200).json({
      data: {
        TotalQuiz: questions.length,
        TotalAnswer: TotalAnwer,
        TotalQuestioned: TotalQuestioned,
        TotalUser: totalUser.length,
        averageTime: averageTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

SessionRoute.put("/update", async function (req, res) {
  const { questionID, user_id, answer_time } = req.body;
  const newQues = [];
  questionID.forEach(element => {
    newQues.push(new ObjectId(element))
  });
  try {
    const update = await db.Session.insertOne({
      questionID: newQues,
      user_id: new ObjectId(user_id),
      answer_time: answer_time,
      TotalQuestion: questionID.length,
    });
    res.status(201).json({success:true , message:"Updated successfully"})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = SessionRoute;
