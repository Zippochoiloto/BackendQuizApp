const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "Quizz_Management";
const db = {}

async function connectToDb() {
  await client.connect();
  console.log("Connected successfully to server");
  const database = client.db(dbName);
  db.users = database.collection("Users");

  // the following code examples can be pasted here...

  return "done.";
}

module.exports = {connectToDb, db}
