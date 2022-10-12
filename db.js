const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://traclam:lam123456@quizgame.lhbki.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "QuizGame";
const db = {};

async function connectToDb() {
  await client.connect();
  console.log("Connected successfully to Database");
  const database = client.db(dbName);

  db.Admin = database.collection("Admin");
  db.User = database.collection("User");
  db.Question = database.collection("Question");
  db.Answer = database.collection("Answer");

  return "done.";
}

module.exports = { connectToDb, db };