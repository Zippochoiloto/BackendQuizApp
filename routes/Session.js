const express = require("express");
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

SessionRoute.put("/update", function (req, res) {
  const {questionID , time_to_resole , user_id , answer_time} = req
  try {
    // const update = await 
  } catch (error) {}
});

module.exports = SessionRoute;
